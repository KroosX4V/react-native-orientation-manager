import * as React from "react";
import { View, StyleSheet, Text, StatusBar } from "react-native";
import Color from "../../Color";
import { useInterfaceOrientationWhenFocusedEffect, type InterfaceOrientation } from "react-native-orientation-manager";
import type RootStackScreenProps from "../../types/RootStackScreenProps";

function LandscapeOnlyWithLeavingOnOrientationChangeScreen({ navigation }: RootStackScreenProps<"LandscapeOnlyWithLeavingOnOrientationChange">): React.JSX.Element
{
    useInterfaceOrientationWhenFocusedEffect((interfaceOrientation: InterfaceOrientation) => {
        if (!interfaceOrientation.isLandscape()) navigation.goBack();
    });

    return (
        <View style={style.container}>
            <StatusBar backgroundColor={Color.PrimaryAdjacent} barStyle="light-content" />
            <Text style={style.text}>
                This is a landscape-only screen that leaves when orientation changes to portrait.
            </Text>
            <Text style={style.text}>
                Try to change orientation to portrait.
            </Text>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.Tertiary,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: Color.TertiaryText,
        fontSize: 18,
        textAlign: "center",
    },
});

export default LandscapeOnlyWithLeavingOnOrientationChangeScreen;