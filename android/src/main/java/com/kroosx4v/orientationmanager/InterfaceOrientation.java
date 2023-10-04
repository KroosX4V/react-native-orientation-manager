package com.kroosx4v.orientationmanager;

enum InterfaceOrientation
{
    UNKNOWN("0"),
    PORTRAIT("1"),
    PORTRAIT_UPSIDE_DOWN("2"),
    LANDSCAPE_LEFT("3"),
    LANDSCAPE_RIGHT("4");

    public final String value;

    InterfaceOrientation(String value)
    {
        this.value = value;
    }
}