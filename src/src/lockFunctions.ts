import { Platform } from "react-native";
import OrientationManagerModule from "./OrientationManagerModule";

async function lockToPortrait(): Promise<void>
{
    await OrientationManagerModule.lockToPortrait();
}

async function lockToPortraitUpsideDown(): Promise<void>
{
    await OrientationManagerModule.lockToPortraitUpsideDown();
}

async function lockToLandscapeLeft(): Promise<void>
{
    await OrientationManagerModule.lockToLandscapeLeft();
}

async function lockToLandscapeRight(): Promise<void>
{
    await OrientationManagerModule.lockToLandscapeRight();
}

async function lockToLandscape(): Promise<void>
{
    await OrientationManagerModule.lockToLandscape();
}

async function lockToAllOrientationsButUpsideDown(): Promise<void>
{
    if (Platform.OS === "android") throw new Error("lockToAllOrientationsButUpsideDown() is not supported on Android");
    await OrientationManagerModule.lockToAllOrientationsButUpsideDown();
}

async function unlockAllOrientations(): Promise<void>
{
    await OrientationManagerModule.unlockAllOrientations();
}

async function resetInterfaceOrientationSetting(): Promise<void>
{
    await OrientationManagerModule.resetInterfaceOrientationSetting();
}

export {
    lockToPortrait,
    lockToPortraitUpsideDown,
    lockToLandscapeLeft,
    lockToLandscapeRight,
    lockToLandscape,
    lockToAllOrientationsButUpsideDown,
    unlockAllOrientations,
    resetInterfaceOrientationSetting,
};