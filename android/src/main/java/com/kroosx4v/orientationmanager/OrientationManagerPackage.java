package com.kroosx4v.orientationmanager;

import androidx.annotation.NonNull;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class OrientationManagerPackage implements ReactPackage
{
    @NonNull
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext)
    {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new OrientationManagerModule(reactContext));

        return modules;
    }

    @NonNull
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext)
    {
        return Collections.emptyList();
    }
}