package com.kroosx4v.orientationmanager;

enum DeviceOrientation
{
    UNKNOWN("0"),
    PORTRAIT("1"),
    PORTRAIT_UPSIDE_DOWN("2"),
    LANDSCAPE_LEFT("3"),
    LANDSCAPE_RIGHT("4"),
    FACE_UP("5"),
    FACE_DOWN("6");

    public final String value;

    DeviceOrientation(String value)
    {
        this.value = value;
    }
}