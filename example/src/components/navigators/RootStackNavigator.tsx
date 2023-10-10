import * as React from "react";
import { StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import { Platform } from "react-native";
import Color from "../../Color";
import type RootStackParamList from "../../types/RootStackParamList";
import HomeScreen from "../screens/HomeScreen";
import OrientationObserverScreen from "../screens/OrientationObserverScreen";
import OrientationLockedScreen from "../screens/OrientationLockedScreen";
import LandscapeOnlyWithLeavingOnOrientationChangeScreen from "../screens/LandscapeOnlyWithLeavingOnOrientationChangeScreen";
import PortraitOnlyThatNavigatesToLandscapeOnlyScreen from "../screens/PortraitOnlyThatNavigatesToLandscapeOnlyScreen";

const RootStack = (Platform.OS === "windows" ? createStackNavigator : createNativeStackNavigator)<RootStackParamList>();

export function RootStackNavigator(): React.JSX.Element
{
    return (
        <RootStack.Navigator
            screenOptions={{
                headerStyle: style.header,
                headerTintColor: Color.PrimaryAdjacentText,
            }}
        >
            <RootStack.Screen name="Home" component={HomeScreen} />
            <RootStack.Screen name="OrientationObserver" component={OrientationObserverScreen} options={{ title: "Orientation Observer" }} />
            <RootStack.Screen name="OrientationLocked" component={OrientationLockedScreen} />
            <RootStack.Screen
                name="LandscapeOnlyWithLeavingOnOrientationChange"
                component={LandscapeOnlyWithLeavingOnOrientationChangeScreen}
                options={{ title: "Landscape Only With Leaving on Orientation Change" }}
            />
            <RootStack.Screen
                name="PortraitOnlyThatNavigatesToLandscapeOnly"
                component={PortraitOnlyThatNavigatesToLandscapeOnlyScreen}
                options={{
                    title: "Portrait Only That Navigates to Landscape Only",
                    headerStyle: style.portraitOnlyThatNavigatesToLandscapeOnlyHeader,
                    headerTintColor: Color.SecondaryAdjacentText,
                }}
            />
        </RootStack.Navigator>
    );
}

const style = StyleSheet.create({
    header: {
        backgroundColor: Color.PrimaryAdjacent,
        borderBottomWidth: 0,
    },
    portraitOnlyThatNavigatesToLandscapeOnlyHeader: {
        backgroundColor: Color.SecondaryAdjacent,
        borderBottomWidth: 0,
    },
});