import type OrientationLock from "./OrientationLock";

type RootStackParamList = {
    Home: undefined;
    OrientationObserver: undefined;
    OrientationLocked: {
        lock: OrientationLock;
        title: string;
        text: string;
    };
    LandscapeOnlyWithLeavingOnOrientationChange: undefined;
    PortraitOnlyThatNavigatesToLandscapeOnly: undefined;
};

export default RootStackParamList;