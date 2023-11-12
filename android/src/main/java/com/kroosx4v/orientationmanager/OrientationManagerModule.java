package com.kroosx4v.orientationmanager;

import android.app.Activity;
import android.content.pm.ActivityInfo;
import android.content.res.Configuration;
import android.os.Build;
import android.os.Handler;
import android.os.HandlerThread;
import android.view.Surface;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import java.lang.ref.WeakReference;
import java.util.HashMap;
import java.util.Map;
import javax.annotation.Nonnull;

public class OrientationManagerModule extends ReactContextBaseJavaModule
{
    @Nullable
    private static WeakReference<OrientationManagerModule> currentInstance = null;

    private static boolean enabled = false;

    private boolean mInterfaceOrientationChangedListenerAdded = false;
    private boolean mDeviceOrientationChangedListenerAdded = false;

    @NonNull
    private final DeviceOrientationListener mDeviceOrientationListener;

    @NonNull
    private final Handler mHandler;

    @NonNull
    private InterfaceOrientation mLastInterfaceOrientation = InterfaceOrientation.UNKNOWN;

    @NonNull
    private DeviceOrientation mLastDeviceOrientation = DeviceOrientation.UNKNOWN;

    @Nullable
    private Boolean mNaturalInterfaceOrientationIsPortrait;

    private final InterfaceOrientationChangeDetector mInterfaceOrientationChangeDetector = new InterfaceOrientationChangeDetector();
    private boolean mInterfaceOrientationChangeDetectorIsRunning = false;

    static void enableOrientationListener()
    {
        synchronized (OrientationManagerModule.class)
        {
            if (enabled) return;
            enabled = true;

            final OrientationManagerModule instance = getCurrentInstance();
            if (instance == null) return;

            instance.sendInterfaceOrientationChangedIfOccurred();

            if (instance.mInterfaceOrientationChangedListenerAdded) instance.resumeInterfaceOrientationChangeDetection();
            if (instance.mDeviceOrientationChangedListenerAdded) instance.mDeviceOrientationListener.enable();
        }
    }

    static void disableOrientationListener()
    {
        synchronized (OrientationManagerModule.class)
        {
            if (!enabled) return;
            enabled = false;

            final OrientationManagerModule instance = getCurrentInstance();
            if (instance != null) instance.mDeviceOrientationListener.disable();
        }
    }

    public OrientationManagerModule(ReactApplicationContext context)
    {
        super(context);

        {
            HandlerThread handlerThread = new HandlerThread("OrientationManagerModule");
            handlerThread.start();

            mHandler = new Handler(handlerThread.getLooper());
        }

        mDeviceOrientationListener = new DeviceOrientationListener(context, mHandler) {
            @Override
            protected void onOrientationChanged()
            {
                sendDeviceOrientationChangedIfOccurred();
            }
        };

        currentInstance = new WeakReference<>(this);
    }

    @Override
    @Nonnull
    public String getName()
    {
        return "OrientationManagerModule";
    }

    @Override
    public Map<String, Object> getConstants()
    {
        mLastInterfaceOrientation = getInterfaceOrientation();

        final Map<String, Object> constants = new HashMap<>();
        constants.put("initialInterfaceOrientationValue", mLastInterfaceOrientation.value);
        constants.put("initialDeviceOrientationValue", mLastDeviceOrientation.value);

        return constants;
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void lockToPortrait(Promise promise)
    {
        lockToOrientation(promise, ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void lockToPortraitUpsideDown(Promise promise)
    {
        lockToOrientation(promise, ActivityInfo.SCREEN_ORIENTATION_REVERSE_PORTRAIT);
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void lockToLandscapeLeft(Promise promise)
    {
        lockToOrientation(promise, ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void lockToLandscapeRight(Promise promise)
    {
        lockToOrientation(promise, ActivityInfo.SCREEN_ORIENTATION_REVERSE_LANDSCAPE);
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void lockToLandscape(Promise promise)
    {
        lockToOrientation(promise, ActivityInfo.SCREEN_ORIENTATION_USER_LANDSCAPE);
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void unlockAllOrientations(Promise promise)
    {
        lockToOrientation(promise, ActivityInfo.SCREEN_ORIENTATION_FULL_USER);
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void resetInterfaceOrientationSetting(Promise promise)
    {
        lockToOrientation(promise, ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED);
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void addListener(String eventName)
    {
        if (eventName.equals("interfaceOrientationChanged"))
        {
            mInterfaceOrientationChangedListenerAdded = true;
            sendInterfaceOrientationChangedIfOccurred();

            synchronized (OrientationManagerModule.class)
            {
                if (enabled) resumeInterfaceOrientationChangeDetection();
            }
        }
        // @note: At this point eventName must be "deviceOrientationChanged". So, no need to check.
        else
        {
            mDeviceOrientationChangedListenerAdded = true;

            synchronized (OrientationManagerModule.class)
            {
                if (enabled) mDeviceOrientationListener.enable();
            }
        }
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void removeListeners(Integer count) {}

    @Override
    protected void finalize()
    {
        mHandler.getLooper().quit();
    }

    private void lockToOrientation(Promise promise, int orientation)
    {
        try
        {
            {
                final Activity activity = getCurrentActivity();
                if (activity != null) activity.setRequestedOrientation(orientation);
            }

            promise.resolve(null);
        }
        catch (Throwable throwable)
        {
            promise.reject(throwable);
        }
    }

    private void resumeInterfaceOrientationChangeDetection()
    {
        synchronized (mInterfaceOrientationChangeDetector)
        {
            if (mInterfaceOrientationChangeDetectorIsRunning) return;
            mInterfaceOrientationChangeDetectorIsRunning = true;

            postInterfaceOrientationChangeDetectorDelayed();
        }
    }

    private void postInterfaceOrientationChangeDetectorDelayed()
    {
        mHandler.postDelayed(mInterfaceOrientationChangeDetector, 100);
    }

    private synchronized void sendInterfaceOrientationChangedIfOccurred()
    {
        if (!mInterfaceOrientationChangedListenerAdded) return;

        InterfaceOrientation interfaceOrientation = getInterfaceOrientation();
        if (interfaceOrientation == mLastInterfaceOrientation) return;

        mLastInterfaceOrientation = interfaceOrientation;

        WritableNativeMap map = new WritableNativeMap();
        map.putString("interfaceOrientationValue", interfaceOrientation.value);

        sendEvent("interfaceOrientationChanged", map);
    }

    private synchronized void sendDeviceOrientationChangedIfOccurred()
    {
        if (!mDeviceOrientationChangedListenerAdded) return;

        DeviceOrientation deviceOrientation = getDeviceOrientation();
        if (deviceOrientation == mLastDeviceOrientation) return;

        mLastDeviceOrientation = deviceOrientation;

        WritableNativeMap map = new WritableNativeMap();
        map.putString("deviceOrientationValue", deviceOrientation.value);

        sendEvent("deviceOrientationChanged", map);
    }

    private InterfaceOrientation getInterfaceOrientation()
    {
        final Activity activity = getCurrentActivity();

        if (activity != null)
        {
            final Boolean naturalInterfaceOrientationIsPortrait = isPortraitNaturalInterfaceOrientation(activity);

            if (naturalInterfaceOrientationIsPortrait != null)
            {
                switch (getDisplayRotation(activity))
                {
                    case Surface.ROTATION_0:
                        return naturalInterfaceOrientationIsPortrait ? InterfaceOrientation.PORTRAIT : InterfaceOrientation.LANDSCAPE_LEFT;

                    case Surface.ROTATION_90:
                        return naturalInterfaceOrientationIsPortrait ? InterfaceOrientation.LANDSCAPE_LEFT : InterfaceOrientation.PORTRAIT_UPSIDE_DOWN;

                    case Surface.ROTATION_180:
                        return naturalInterfaceOrientationIsPortrait ? InterfaceOrientation.PORTRAIT_UPSIDE_DOWN : InterfaceOrientation.LANDSCAPE_RIGHT;

                    case Surface.ROTATION_270:
                        return naturalInterfaceOrientationIsPortrait ? InterfaceOrientation.LANDSCAPE_RIGHT : InterfaceOrientation.PORTRAIT;
                }
            }
        }

        return InterfaceOrientation.UNKNOWN;
    }

    private DeviceOrientation getDeviceOrientation()
    {
        final Boolean naturalInterfaceOrientationIsPortrait = isPortraitNaturalInterfaceOrientation();
        if (naturalInterfaceOrientationIsPortrait == null) return DeviceOrientation.UNKNOWN;

        final DeviceOrientation lastDeviceOrientation = mDeviceOrientationListener.getLastOrientation();
        if (naturalInterfaceOrientationIsPortrait) return lastDeviceOrientation;

        switch (lastDeviceOrientation)
        {
            case PORTRAIT:
                return DeviceOrientation.LANDSCAPE_LEFT;

            case LANDSCAPE_LEFT:
                return DeviceOrientation.PORTRAIT_UPSIDE_DOWN;

            case PORTRAIT_UPSIDE_DOWN:
                return DeviceOrientation.LANDSCAPE_RIGHT;

            case LANDSCAPE_RIGHT:
                return DeviceOrientation.PORTRAIT;

            default:
                return lastDeviceOrientation;
        }
    }

    private Boolean isPortraitNaturalInterfaceOrientation()
    {
        return isPortraitNaturalInterfaceOrientation(null);
    }

    private Boolean isPortraitNaturalInterfaceOrientation(@Nullable Activity activity)
    {
        if (mNaturalInterfaceOrientationIsPortrait != null) return mNaturalInterfaceOrientationIsPortrait;
        
        if (activity == null) activity = getCurrentActivity();
        if (activity == null) return null;

        {
            final int configOrientation = activity.getResources().getConfiguration().orientation;

            switch (getDisplayRotation(activity))
            {
                case Surface.ROTATION_0:
                case Surface.ROTATION_180:

                    mNaturalInterfaceOrientationIsPortrait = configOrientation == Configuration.ORIENTATION_PORTRAIT;
                    break;

                case Surface.ROTATION_90:
                case Surface.ROTATION_270:

                    mNaturalInterfaceOrientationIsPortrait = configOrientation == Configuration.ORIENTATION_LANDSCAPE;
                    break;
            }
        }

        return mNaturalInterfaceOrientationIsPortrait;
    }

    private int getDisplayRotation(@NonNull Activity activity)
    {
        return (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R ? activity.getDisplay() : activity.getWindowManager().getDefaultDisplay()).getRotation();
    }

    private void sendEvent(@NonNull String eventName, @Nullable WritableMap params)
    {
        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    @Nullable
    private static OrientationManagerModule getCurrentInstance()
    {
        WeakReference<OrientationManagerModule> currentInstanceCopy = currentInstance;
        return currentInstanceCopy == null ? null : currentInstanceCopy.get();
    }

    private class InterfaceOrientationChangeDetector implements Runnable
    {
        @Override
        public void run()
        {
            synchronized (OrientationManagerModule.class)
            {
                if (enabled)
                {
                    sendInterfaceOrientationChangedIfOccurred();
                    postInterfaceOrientationChangeDetectorDelayed();
                }
                else
                {
                    synchronized (mInterfaceOrientationChangeDetector)
                    {
                        mInterfaceOrientationChangeDetectorIsRunning = false;
                    }
                }
            }
        }
    }
}