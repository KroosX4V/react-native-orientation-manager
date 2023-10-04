import OrientationManagerModule from "./OrientationManagerModule";
import { NativeEventEmitter, Platform } from "react-native";
import getUniqueId from "./getUniqueId";
import InterfaceOrientation from "./InterfaceOrientation";
import DeviceOrientation from "./DeviceOrientation";
import type IOrientations from "./types/Orientations";
import type InterfaceOrientationChangeListenerCallback from "./types/InterfaceOrientationChangeListenerCallback";
import type DeviceOrientationChangeListenerCallback from "./types/DeviceOrientationChangeListenerCallback";
import type InterfaceOrientationChangedNativeEvent from "./types/InterfaceOrientationChangedNativeEvent";
import type DeviceOrientationChangedNativeEvent from "./types/DeviceOrientationChangedNativeEvent";

type ListenerRemover = () => void;

let addInterfaceOrientationChangeListener: (callback: InterfaceOrientationChangeListenerCallback) => ListenerRemover;
let addDeviceOrientationChangeListener: (callback: DeviceOrientationChangeListenerCallback) => ListenerRemover;
let Orientations: IOrientations;
{
    let currentInterfaceOrientation: InterfaceOrientation;
    let currentDeviceOrientation: DeviceOrientation;
    {
        const { initialInterfaceOrientationValue, initialDeviceOrientationValue } = OrientationManagerModule.getConstants();

        currentInterfaceOrientation = new InterfaceOrientation(
            Platform.OS === "android" ? Number(initialInterfaceOrientationValue) : initialInterfaceOrientationValue,
        );

        currentDeviceOrientation = new DeviceOrientation(Platform.OS === "android" ? Number(initialDeviceOrientationValue) : initialDeviceOrientationValue);
    }

    const interfaceOrientationChangeListeners: Record<number, InterfaceOrientationChangeListenerCallback> = {};
    const deviceOrientationChangeListeners: Record<number, DeviceOrientationChangeListenerCallback> = {};

    {
        const nativeEventEmitter = new NativeEventEmitter(OrientationManagerModule);

        nativeEventEmitter.addListener(
            "interfaceOrientationChanged",
            ({ interfaceOrientationValue }: InterfaceOrientationChangedNativeEvent) => {
                const interfaceOrientation = new InterfaceOrientation(Platform.OS === "android" ? Number(interfaceOrientationValue) : interfaceOrientationValue);
                currentInterfaceOrientation = interfaceOrientation;

                for (const listenerCallbackId in interfaceOrientationChangeListeners)
                {
                    interfaceOrientationChangeListeners[listenerCallbackId]!(interfaceOrientation);
                }
            },
        );

        nativeEventEmitter.addListener(
            "deviceOrientationChanged",
            ({ deviceOrientationValue }: DeviceOrientationChangedNativeEvent) => {
                const deviceOrientation = new DeviceOrientation(Platform.OS === "android" ? Number(deviceOrientationValue) : deviceOrientationValue);
                currentDeviceOrientation = deviceOrientation;

                for (const listenerCallbackId in deviceOrientationChangeListeners) deviceOrientationChangeListeners[listenerCallbackId]!(deviceOrientation);
            },
        );
    }

    Orientations = Object.freeze({
        get interfaceOrientation(): InterfaceOrientation {
            return currentInterfaceOrientation;
        },
        get deviceOrientation(): DeviceOrientation {
            return currentDeviceOrientation;
        },
    });
    
    addInterfaceOrientationChangeListener = (callback: InterfaceOrientationChangeListenerCallback): ListenerRemover => {
        const id = getUniqueId();
        interfaceOrientationChangeListeners[id] = callback;

        return (): void => {
            delete interfaceOrientationChangeListeners[id];
        };
    };
    
    addDeviceOrientationChangeListener = (callback: DeviceOrientationChangeListenerCallback): ListenerRemover => {
        const id = getUniqueId();
        deviceOrientationChangeListeners[id] = callback;

        return (): void => {
            delete deviceOrientationChangeListeners[id];
        };
    };
}

export default Orientations;
export { addInterfaceOrientationChangeListener, addDeviceOrientationChangeListener };