package com.kroosx4v.orientationmanager;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Handler;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

abstract class DeviceOrientationListener
{
    private boolean mEnabled = false;
    
    @NonNull
    private final SensorManager mSensorManager;

    @Nullable
    private final Sensor mAccelerometer;

    @Nullable
    private DeviceOrientationEventListener mOrientationListener;

    @Nullable
    private Handler mHandler;

    @NonNull
    private DeviceOrientation mLastReportedOrientation = DeviceOrientation.UNKNOWN;

    @NonNull
    private final DeviceOrientation[] mLastThreeOrientations = new DeviceOrientation[] {
        DeviceOrientation.UNKNOWN,
        DeviceOrientation.UNKNOWN,
        DeviceOrientation.UNKNOWN,
    };

    private boolean mLastOrientationRepeated = false;

    public DeviceOrientationListener(@NonNull Context context, @NonNull Handler handler)
    {
        mSensorManager = (SensorManager)context.getSystemService(Context.SENSOR_SERVICE);
        mAccelerometer = mSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);

        if (mAccelerometer != null)
        {
            mOrientationListener = new DeviceOrientationEventListener();
            mHandler = handler;
        }
    }

    public void enable()
    {
        synchronized (this)
        {
            if (mEnabled || mAccelerometer == null) return;

            mSensorManager.registerListener(mOrientationListener, mAccelerometer, SensorManager.SENSOR_DELAY_NORMAL, mHandler);
            mEnabled = true;
        }
    }

    public void disable()
    {
        synchronized (this)
        {
            if (!mEnabled) return;

            mSensorManager.unregisterListener(mOrientationListener);
            mEnabled = false;
        }
    }

    @Override
    protected void finalize()
    {
        disable();
    }

    private class DeviceOrientationEventListener implements SensorEventListener
    {
        public void onSensorChanged(SensorEvent event)
        {
            double gForce;
            DeviceOrientation orientation = DeviceOrientation.UNKNOWN;
            {
                final float x = event.values[0];
                final float y = event.values[1];
                final float z = event.values[2];

                final float gForceZ = z / SensorManager.GRAVITY_EARTH;

                {
                    final float gForceX = x / SensorManager.GRAVITY_EARTH;
                    final float gForceY = y / SensorManager.GRAVITY_EARTH;

                    gForce = Math.sqrt(gForceX * gForceX + gForceY * gForceY + gForceZ * gForceZ);
                    if (gForce > 1.5) return;
                }

                if ((x * x + y * y) * 4 >= z * z)
                {
                    int orientationInDegrees = normalizeDegree(90 - Math.round((float)Math.atan2(y, -x) * 57.29577957855f));

                    if (orientationInDegrees >= 350 || orientationInDegrees <= 10) orientation = DeviceOrientation.PORTRAIT;
                    else if (orientationInDegrees >= 80 && orientationInDegrees <= 100) orientation = DeviceOrientation.LANDSCAPE_RIGHT;
                    else if (orientationInDegrees >= 170 && orientationInDegrees <= 190) orientation = DeviceOrientation.PORTRAIT_UPSIDE_DOWN;
                    else if (orientationInDegrees >= 260 && orientationInDegrees <= 280) orientation = DeviceOrientation.LANDSCAPE_LEFT;
                }

                if (orientation == DeviceOrientation.UNKNOWN)
                {
                    int inclination = normalizeDegree((int)Math.round(Math.toDegrees(Math.acos(gForceZ))));
                    if (inclination <= 25 || inclination >= 155) orientation = z > 0 ? DeviceOrientation.FACE_UP : DeviceOrientation.FACE_DOWN;
                }
            }

            orientation = decideNewOrientation(orientation, gForce);

            if (orientation != mLastReportedOrientation)
            {
                mLastReportedOrientation = orientation;
                onOrientationChanged();
            }
        }

        public void onAccuracyChanged(Sensor sensor, int accuracy) {}
    }

    public DeviceOrientation getLastOrientation()
    {
        return mLastReportedOrientation;
    }

    abstract protected void onOrientationChanged();

    private DeviceOrientation decideNewOrientation(DeviceOrientation calculatedOrientation, double gForce)
    {
        if (calculatedOrientation == mLastThreeOrientations[mLastThreeOrientations.length - 1] && !mLastOrientationRepeated)
        {
            mLastOrientationRepeated = true;
            return mLastReportedOrientation;
        }

        mLastOrientationRepeated = false;

        for (int i = 1; i < mLastThreeOrientations.length; ++i) mLastThreeOrientations[i - 1] = mLastThreeOrientations[i];
        mLastThreeOrientations[mLastThreeOrientations.length - 1] = calculatedOrientation;

        for (DeviceOrientation orientationToStabilize : new DeviceOrientation[] { DeviceOrientation.FACE_UP, DeviceOrientation.FACE_DOWN })
        {
            if (calculatedOrientation != orientationToStabilize) continue;

            second:
            for (DeviceOrientation orientationToStabilize2 : new DeviceOrientation[] { DeviceOrientation.PORTRAIT, DeviceOrientation.PORTRAIT_UPSIDE_DOWN })
            {
                boolean orientationPresent = false;

                for (DeviceOrientation orientation : mLastThreeOrientations)
                {
                    if (orientation != orientationToStabilize && orientation != orientationToStabilize2 && orientation != DeviceOrientation.UNKNOWN)
                    {
                        continue second;
                    }

                    if (!orientationPresent && orientation == orientationToStabilize2) orientationPresent = true;
                }

                if (orientationPresent) return orientationToStabilize2;
            }
        }

        if (calculatedOrientation == DeviceOrientation.UNKNOWN && gForce <= 1.15)
        {
            DeviceOrientation onlyOrientation = mLastThreeOrientations[0];

            for (int i = 1; i < mLastThreeOrientations.length - 1; ++i)
            {
                if (mLastThreeOrientations[i] == DeviceOrientation.UNKNOWN) continue;

                if (onlyOrientation == DeviceOrientation.UNKNOWN)
                {
                    onlyOrientation = mLastThreeOrientations[i];
                }
                else if (onlyOrientation != mLastThreeOrientations[i])
                {
                    onlyOrientation = DeviceOrientation.UNKNOWN;
                    break;
                }
            }

            if (onlyOrientation != DeviceOrientation.UNKNOWN) return onlyOrientation;
        }

        return calculatedOrientation;
    }

    private int normalizeDegree(int degree)
    {
        if (degree >= 360)
        {
            degree %= 360;
        }
        else if (degree < 0)
        {
            degree = degree % 360;
            if (degree < 0) degree += 360;
        }

        return degree;
    }
}