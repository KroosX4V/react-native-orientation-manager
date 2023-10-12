import * as React from "react";
import {
    lockToPortrait,
    lockToPortraitUpsideDown,
    lockToLandscapeLeft,
    lockToLandscapeRight,
    lockToLandscape,
    lockToAllOrientationsButUpsideDown,
    unlockAllOrientations,
    resetInterfaceOrientationSetting
} from "../lockFunctions";
import { Platform } from "react-native";

interface OrientationLockerProps
{
    lock: "Portrait" | "PortraitUpsideDown" | "LandscapeLeft" | "LandscapeRight" | "Landscape" | "AllButUpsideDown" | "All";
}

interface StackEntry
{
    lockFunction: typeof lockToPortrait;
}

class OrientationLocker extends React.PureComponent<OrientationLockerProps>
{
    private static lockStack: StackEntry[] = [];
    private static lockUpdateImmediateId: NodeJS.Immediate | null = null;

    private stackEntry: StackEntry | null = null;

    render(): React.ReactNode
    {
        return null;
    }

    public componentDidMount(): void
    {
        this.stackEntry = this.createStackEntry();

        OrientationLocker.lockStack.push(this.stackEntry);
        OrientationLocker.updateLock();
    }

    public componentDidUpdate(): void
    {
        const stackEntryIndex = OrientationLocker.lockStack.indexOf(this.stackEntry!);
        OrientationLocker.lockStack[stackEntryIndex] = this.stackEntry = this.createStackEntry();
        if (stackEntryIndex === OrientationLocker.lockStack.length - 1) OrientationLocker.updateLock();
    }

    public componentWillUnmount(): void
    {
        const stackEntryIndex = OrientationLocker.lockStack.indexOf(this.stackEntry!);
        OrientationLocker.lockStack.splice(stackEntryIndex, 1);
        if (stackEntryIndex === OrientationLocker.lockStack.length) OrientationLocker.updateLock();
    }

    private static updateLock(): void
    {
        if (OrientationLocker.lockUpdateImmediateId !== null)
        {
            clearImmediate(OrientationLocker.lockUpdateImmediateId);
            OrientationLocker.lockUpdateImmediateId = null;
        }

        OrientationLocker.lockUpdateImmediateId = setImmediate(() => {
            OrientationLocker.lockUpdateImmediateId = null;

            if (OrientationLocker.lockStack.length) OrientationLocker.lockStack[OrientationLocker.lockStack.length - 1]!.lockFunction();
            else resetInterfaceOrientationSetting();
        });
    }

    private createStackEntry(): StackEntry
    {
        let lockFunction: StackEntry["lockFunction"];

        switch (this.props.lock)
        {
            case "Portrait":

                lockFunction = lockToPortrait;
                break;

            case "PortraitUpsideDown":

                lockFunction = lockToPortraitUpsideDown;
                break;

            case "LandscapeLeft":

                lockFunction = lockToLandscapeLeft;
                break;

            case "LandscapeRight":

                lockFunction = lockToLandscapeRight;
                break;

            case "Landscape":

                lockFunction = lockToLandscape;
                break;

            case "AllButUpsideDown":

                if (Platform.OS === "android")
                {
                    console.error(`"${this.props.lock}" is not supported on Android. Assumed "All" instead`);
                }
                else
                {
                    lockFunction = lockToAllOrientationsButUpsideDown;
                    break;
                }

            case "All":

                lockFunction = unlockAllOrientations;
                break;

            default:
                throw new Error("Unknown lock type");
        }

        return { lockFunction };
    }
}

export default OrientationLocker;