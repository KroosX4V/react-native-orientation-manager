import { Alert, Platform, ScrollView, StatusBar, StyleSheet } from "react-native";
import Color from "../../Color";
import ListItem from "../ListItem";
import Orientations from "react-native-orientation-manager";
import OrientationLock from "../../types/OrientationLock";
import OrientationLockedListItem from "../OrientationLockedListItem";

function HomeScreen(): React.JSX.Element
{
    return (
        <ScrollView style={style.container}>
            <StatusBar backgroundColor={Color.PrimaryAdjacent} barStyle="light-content" />
            <ListItem name="Orientation Observer" screen="OrientationObserver" />
            <OrientationLockedListItem name="Portrait Only" lock={OrientationLock.PORTRAIT} text="This is a portrait-only screen" />
            <OrientationLockedListItem
                name="Portrait Upside Down Only"
                lock={OrientationLock.PORTRAIT_UPSIDE_DOWN}
                text="This is a portrait-upside-down-only screen. Not supported on some devices."
            />
            <OrientationLockedListItem name="Landscape Left Only" lock={OrientationLock.LANDSCAPE_LEFT} text="This is a landscape-left-only screen" />
            <OrientationLockedListItem name="Landscape Right Only" lock={OrientationLock.LANDSCAPE_RIGHT} text="This is a landscape-right-only screen" />
            <OrientationLockedListItem name="Landscape Only" lock={OrientationLock.LANDSCAPE} text="This is a landscape-only screen" />
            <OrientationLockedListItem
                name="All Orientations but Upside Down"
                lock={OrientationLock.ALL_ORIENTATIONS_BUT_UPSIDE_DOWN}
                text="This is an all-orientations-but-upside-down screen"
                guard={(): boolean => {
                    if (Platform.OS === "android")
                    {
                        Alert.alert("Not Supported", "This lock type is not supported on Android.");
                        return false;
                    }

                    return true;
                }}
            />
            <OrientationLockedListItem
                name="All Orientations Unlocked"
                lock={OrientationLock.UNLOCK_ALL_ORIENTATIONS}
                text="All orientations are unlocked in this screen. This may allow portrait-upside-down orientation on some devices."
            />
            <ListItem
                name="Landscape Only With Leaving on Orientation Change"
                screen="LandscapeOnlyWithLeavingOnOrientationChange"
                guard={(): boolean => {
                    if (Orientations.interfaceOrientation.isLandscape()) return true;

                    Alert.alert("Landscape Only", "You have to be in landscape mode to enter this screen.");
                    return false;
                }}
            />
            <ListItem name="Portrait Only That Navigates to Landscape Only" screen="PortraitOnlyThatNavigatesToLandscapeOnly" />
        </ScrollView>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.Primary,
    },
});

export default HomeScreen;