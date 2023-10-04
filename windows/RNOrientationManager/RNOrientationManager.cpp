#include "pch.h"
#include "RNOrientationManager.h"

namespace RNOrientationManager
{
	void Module::Initialize(React::ReactContext const& reactContext) noexcept
	{
        m_reactContext = reactContext;

        Module::UIDispatch(
            [&] {
                m_displayInformation = DisplayInformation::GetForCurrentView();
                m_uiViewSettings = UIViewSettings::GetForCurrentView();

                m_lastInterfaceOrientation = Module::GetInterfaceOrientation();

                m_defaultDisplayOrientations = std::unique_ptr<DisplayOrientations>(
                    new DisplayOrientations{ m_displayInformation.AutoRotationPreferences() }
                );
            },
            true
        );

        m_simpleOrientationSensor = SimpleOrientationSensor::GetDefault();
        m_lastDeviceOrientation = Module::GetDeviceOrientation();
	}

    void Module::GetConstants(React::ReactConstantProvider& provider) noexcept
    {
        provider.Add(L"initialInterfaceOrientationValue", static_cast<int>(m_lastInterfaceOrientation));
        provider.Add(L"initialDeviceOrientationValue", static_cast<int>(m_lastDeviceOrientation));
    }

    void Module::AddListener(std::string eventName) noexcept
    {
        if (eventName == "interfaceOrientationChanged")
        {
            Module::UIDispatch([&] {
                m_displayInformation.OrientationChanged({ this, &Module::OnDisplayOrientationChanged });
                Module::SendInterfaceOrientationChangedIfOccurred();
            });
        }
        else if (m_simpleOrientationSensor)
        {
            m_simpleOrientationSensor.OrientationChanged({ this, &Module::OnSimpleOrientationChanged });
            Module::SendDeviceOrientationChangedIfOccurred();
        }
    }

    void Module::RemoveListeners(int) noexcept {}

    void Module::LockToPortrait(React::ReactPromise<void>&& promise) noexcept
    {
        Module::SetAutoRotationPreferences(std::move(promise), DisplayOrientations::Portrait);
    }

    void Module::LockToPortraitUpsideDown(React::ReactPromise<void>&& promise) noexcept
    {
        Module::SetAutoRotationPreferences(std::move(promise), DisplayOrientations::PortraitFlipped);
    }

    void Module::LockToLandscapeLeft(React::ReactPromise<void> && promise) noexcept
    {
        Module::SetAutoRotationPreferences(std::move(promise), DisplayOrientations::Landscape);
    }

    void Module::LockToLandscapeRight(React::ReactPromise<void> && promise) noexcept
    {
        Module::SetAutoRotationPreferences(std::move(promise), DisplayOrientations::LandscapeFlipped);
    }

    void Module::LockToLandscape(React::ReactPromise<void> && promise) noexcept
    {
        Module::SetAutoRotationPreferences(std::move(promise), DisplayOrientations::Landscape | DisplayOrientations::LandscapeFlipped);
    }

    void Module::LockToAllOrientationsButUpsideDown(React::ReactPromise<void>&& promise) noexcept
    {
        Module::SetAutoRotationPreferences(
            std::move(promise),
            DisplayOrientations::Portrait | DisplayOrientations::Landscape | DisplayOrientations::LandscapeFlipped
        );
    }

    void Module::UnlockAllOrientations(React::ReactPromise<void>&& promise) noexcept
    {
        Module::SetAutoRotationPreferences(
            std::move(promise),
            DisplayOrientations::Portrait | DisplayOrientations::PortraitFlipped | DisplayOrientations::Landscape
            | DisplayOrientations::LandscapeFlipped
        );
    }

    void Module::ResetInterfaceOrientationSetting(React::ReactPromise<void>&& promise) noexcept
    {
        Module::SetAutoRotationPreferences(std::move(promise), *m_defaultDisplayOrientations);
    }

    void Module::SetAutoRotationPreferences(React::ReactPromise<void>&& promise, DisplayOrientations displayOrientations)
    {
        Module::UIDispatch([&, promise = std::move(promise)]() noexcept {
            try
            {
                if
                (
                    m_uiViewSettings.UserInteractionMode() == UserInteractionMode::Touch
                    && m_displayInformation.AutoRotationPreferences() != displayOrientations
                ) DisplayInformation::AutoRotationPreferences(displayOrientations);

                promise.Resolve();
            }
            catch (...)
            {
                promise.Reject("Unknown error");
            }
        });
    }

    void Module::SendInterfaceOrientationChangedIfOccurred()
    {
        Module::UIDispatch([&] {
            InterfaceOrientation interfaceOrientation = Module::GetInterfaceOrientation();
            if (interfaceOrientation == m_lastInterfaceOrientation) return;

            m_lastInterfaceOrientation = interfaceOrientation;

            InterfaceOrientationChanged(React::JSValueObject{
                { "interfaceOrientationValue", static_cast<int>(interfaceOrientation) }
            });
        });
    }

    void Module::SendDeviceOrientationChangedIfOccurred()
    {
        Module::SendDeviceOrientationChangedIfOccurred(Module::GetDeviceOrientation());
    }

    void Module::SendDeviceOrientationChangedIfOccurred(DeviceOrientation deviceOrientation)
    {
        std::lock_guard lock{ m_checkingForDeviceOrientationChangeMutex };

        if (deviceOrientation == m_lastDeviceOrientation) return;
        m_lastDeviceOrientation = deviceOrientation;

        DeviceOrientationChanged(React::JSValueObject{
            { "deviceOrientationValue", static_cast<int>(deviceOrientation) }
        });
    }

	void Module::OnSimpleOrientationChanged(SimpleOrientationSensor const&, SimpleOrientationSensorOrientationChangedEventArgs const& args)
	{
        Module::SendDeviceOrientationChangedIfOccurred(Module::SimpleOrientationToDeviceOrientation(args.Orientation()));
	}

    void Module::OnDisplayOrientationChanged(DisplayInformation const&, IInspectable const&)
    {
        Module::SendInterfaceOrientationChangedIfOccurred();
    }

    InterfaceOrientation Module::GetInterfaceOrientation()
    {
        return Module::DisplayOrientationToInterfaceOrientation(m_displayInformation.CurrentOrientation());
    }

    DeviceOrientation Module::GetDeviceOrientation()
    {
        return m_simpleOrientationSensor
            ?
                Module::SimpleOrientationToDeviceOrientation(m_simpleOrientationSensor.GetCurrentOrientation())
            :
                DeviceOrientation::Unknown
        ;
    }

    void Module::UIDispatch(std::function<void()>&& func, bool waitIfPosted)
    {
        if (m_reactContext.UIDispatcher().HasThreadAccess())
        {
            func();
        }
        else if (waitIfPosted)
        {
            std::promise<void> promise;

            m_reactContext.UIDispatcher().Post([&]() noexcept {
                func();
                promise.set_value();
            });

            promise.get_future().wait();
        }
        else
        {
            m_reactContext.UIDispatcher().Post([func = std::move(func), weakThis = weak_from_this()] {
                std::shared_ptr<Module> sharedThis = weakThis.lock();
                if (sharedThis) func();
            });
        }
    }

    InterfaceOrientation Module::DisplayOrientationToInterfaceOrientation(DisplayOrientations displayOrientation)
    {
        switch (displayOrientation)
        {
            case DisplayOrientations::Portrait:
                return InterfaceOrientation::Portrait;

            case DisplayOrientations::PortraitFlipped:
                return InterfaceOrientation::PortraitUpsideDown;

            case DisplayOrientations::Landscape:
                return InterfaceOrientation::LandscapeLeft;

            case DisplayOrientations::LandscapeFlipped:
                return InterfaceOrientation::LandscapeRight;

            default:
                return InterfaceOrientation::Unknown;
        }
    }

    DeviceOrientation Module::SimpleOrientationToDeviceOrientation(SimpleOrientation simpleOrientation)
    {
        switch (simpleOrientation)
        {
            case SimpleOrientation::NotRotated:
                return DeviceOrientation::LandscapeLeft;

            case SimpleOrientation::Rotated90DegreesCounterclockwise:
                return DeviceOrientation::PortraitUpsideDown;

            case SimpleOrientation::Rotated180DegreesCounterclockwise:
                return DeviceOrientation::LandscapeRight;

            case SimpleOrientation::Rotated270DegreesCounterclockwise:
                return DeviceOrientation::Portrait;

            case SimpleOrientation::Faceup:
                return DeviceOrientation::FaceUp;

            case SimpleOrientation::Facedown:
                return DeviceOrientation::FaceDown;

            default:
                return DeviceOrientation::Unknown;
        }
    }
}