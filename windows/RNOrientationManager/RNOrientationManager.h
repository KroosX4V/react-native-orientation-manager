#pragma once

#include "pch.h"
#include <functional>
#include "NativeModules.h"
#include <mutex>
#include <future>
#include "winrt/Windows.Devices.Sensors.h"
#include <winrt/Windows.Graphics.Display.h>
#include <winrt/Windows.UI.ViewManagement.h>

using namespace winrt::Windows::Devices::Sensors;
using namespace winrt::Windows::Graphics::Display;
using namespace winrt::Windows::UI::ViewManagement;

namespace RNOrientationManager
{
    enum class InterfaceOrientation : int
    {
        Unknown = 0,
        Portrait = 1,
        PortraitUpsideDown = 2,
        LandscapeLeft = 3,
        LandscapeRight = 4,
    };

    enum class DeviceOrientation : int
    {
        Unknown = 0,
        Portrait = 1,
        PortraitUpsideDown = 2,
        LandscapeLeft = 3,
        LandscapeRight = 4,
        FaceUp = 5,
        FaceDown = 6,
    };

	REACT_MODULE(Module, L"OrientationManagerModule");
	struct Module : public std::enable_shared_from_this<Module>
	{
        REACT_INIT(Initialize)
        void Initialize(React::ReactContext const& reactContext) noexcept;

        REACT_CONSTANT_PROVIDER(GetConstants)
        void GetConstants(React::ReactConstantProvider& provider) noexcept;

        REACT_EVENT(InterfaceOrientationChanged, L"interfaceOrientationChanged");
        std::function<void(React::JSValueObject)> InterfaceOrientationChanged;

        REACT_EVENT(DeviceOrientationChanged, L"deviceOrientationChanged");
        std::function<void(React::JSValueObject)> DeviceOrientationChanged;

        REACT_METHOD(AddListener, L"addListener");
        void AddListener(std::string) noexcept;

        REACT_METHOD(RemoveListeners, L"removeListeners");
        void RemoveListeners(int) noexcept;

        REACT_METHOD(LockToPortrait, L"lockToPortrait");
        void LockToPortrait(React::ReactPromise<void>&& promise) noexcept;

        REACT_METHOD(LockToPortraitUpsideDown, L"lockToPortraitUpsideDown");
        void LockToPortraitUpsideDown(React::ReactPromise<void>&& promise) noexcept;

        REACT_METHOD(LockToLandscapeLeft, L"lockToLandscapeLeft");
        void LockToLandscapeLeft(React::ReactPromise<void>&& promise) noexcept;

        REACT_METHOD(LockToLandscapeRight, L"lockToLandscapeRight");
        void LockToLandscapeRight(React::ReactPromise<void>&& promise) noexcept;

        REACT_METHOD(LockToLandscape, L"lockToLandscape");
        void LockToLandscape(React::ReactPromise<void>&& promise) noexcept;

        REACT_METHOD(LockToAllOrientationsButUpsideDown, L"lockToAllOrientationsButUpsideDown");
        void LockToAllOrientationsButUpsideDown(React::ReactPromise<void>&& promise) noexcept;

        REACT_METHOD(UnlockAllOrientations, L"unlockAllOrientations");
        void UnlockAllOrientations(React::ReactPromise<void>&& promise) noexcept;

        REACT_METHOD(ResetInterfaceOrientationSetting, L"resetInterfaceOrientationSetting");
        void ResetInterfaceOrientationSetting(React::ReactPromise<void>&& promise) noexcept;

        private:

            React::ReactContext m_reactContext;

            DisplayInformation m_displayInformation{ nullptr };
            UIViewSettings m_uiViewSettings{ nullptr };
            SimpleOrientationSensor m_simpleOrientationSensor{ nullptr };

            InterfaceOrientation m_lastInterfaceOrientation = InterfaceOrientation::Unknown;
            DeviceOrientation m_lastDeviceOrientation = DeviceOrientation::Unknown;

            std::mutex m_checkingForDeviceOrientationChangeMutex;
            std::unique_ptr<DisplayOrientations> m_defaultDisplayOrientations{ nullptr };

            void SetAutoRotationPreferences(React::ReactPromise<void>&& promise, DisplayOrientations displayOrientations);
            void SendInterfaceOrientationChangedIfOccurred();

            void SendDeviceOrientationChangedIfOccurred();
            void SendDeviceOrientationChangedIfOccurred(DeviceOrientation deviceOrientation);

            void OnSimpleOrientationChanged(SimpleOrientationSensor const&, SimpleOrientationSensorOrientationChangedEventArgs const&);
            void OnDisplayOrientationChanged(DisplayInformation const&, IInspectable const&);

            InterfaceOrientation GetInterfaceOrientation();
            DeviceOrientation GetDeviceOrientation();

            void UIDispatch(std::function<void()>&& func, bool waitIfPosted = false);

            static InterfaceOrientation DisplayOrientationToInterfaceOrientation(DisplayOrientations displayOrientation);
            static DeviceOrientation SimpleOrientationToDeviceOrientation(SimpleOrientation simpleOrientation);
	};
}