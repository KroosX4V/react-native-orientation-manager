import * as React from "react";
import { View, StyleSheet, Text, StatusBar } from "react-native";
import Color from "../../Color";
import { useFocusEffect } from "@react-navigation/native";
import {
    lockToPortrait,
    lockToPortraitUpsideDown,
    lockToLandscapeLeft,
    lockToLandscapeRight,
    lockToLandscape,
    lockToAllOrientationsButUpsideDown,
    unlockAllOrientations,
    resetInterfaceOrientationSetting,
} from "react-native-orientation-manager";
import RootStackScreenProps from "../../types/RootStackScreenProps";
import OrientationLock from "../../types/OrientationLock";

function OrientationLockedScreen({ navigation, route: { params: { lock, title, text } } }: RootStackScreenProps<"OrientationLocked">): React.JSX.Element
{
    React.useEffect(
        () => {
            navigation.setOptions({ title });
        },
        [],
    );

    const lockFunction = React.useMemo<(...args: []) => any>(
        () => {
            switch (lock)
            {
                case OrientationLock.PORTRAIT:
                    return lockToPortrait;
                
                case OrientationLock.PORTRAIT_UPSIDE_DOWN:
                    return lockToPortraitUpsideDown;
                
                case OrientationLock.LANDSCAPE_LEFT:
                    return lockToLandscapeLeft;
                
                case OrientationLock.LANDSCAPE_RIGHT:
                    return lockToLandscapeRight;
                
                case OrientationLock.LANDSCAPE:
                    return lockToLandscape;
                
                case OrientationLock.ALL_ORIENTATIONS_BUT_UPSIDE_DOWN:
                    return lockToAllOrientationsButUpsideDown;
                
                case OrientationLock.UNLOCK_ALL_ORIENTATIONS:
                    return unlockAllOrientations;
                
                default:
                    throw new Error("Unable to determine lock function");
            }
        },
        [lock],
    );

    useFocusEffect(React.useCallback(
        () => (lockFunction(), resetInterfaceOrientationSetting),
        [],
    ));

    return (
        <View style={style.container}>
            <StatusBar backgroundColor={Color.PrimaryAdjacent} barStyle="light-content" />
            <Text style={style.text}>
                {text}
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
        paddingHorizontal: 20,
    },
    text: {
        color: Color.TertiaryText,
        fontSize: 18,
        textAlign: "center",
    },
});

export default OrientationLockedScreen;