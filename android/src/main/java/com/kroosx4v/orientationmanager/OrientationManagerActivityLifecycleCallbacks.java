package com.kroosx4v.orientationmanager;

import android.app.Activity;
import android.app.Application.ActivityLifecycleCallbacks;
import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public class OrientationManagerActivityLifecycleCallbacks implements ActivityLifecycleCallbacks
{
    public void onActivityResumed(@NonNull Activity activity)
    {
        OrientationManagerModule.enableOrientationListener();
    }

    public void onActivityPaused(@NonNull Activity activity)
    {
        OrientationManagerModule.disableOrientationListener();
    }

    public void onActivityCreated(@NonNull Activity activity, @Nullable Bundle savedInstanceState) {}
    public void onActivityStarted(@NonNull Activity activity) {}
    public void onActivityStopped(@NonNull Activity activity) {}
    public void onActivitySaveInstanceState(@NonNull Activity activity, @NonNull Bundle outState) {}
    public void onActivityDestroyed(@NonNull Activity activity) {}
}