import * as React from "react";
import Orientations, { addDeviceOrientationChangeListener } from "../manager";
import type DeviceOrientationEffect from "../types/DeviceOrientationEffect";
import type DeviceOrientation from "../DeviceOrientation";

function useDeviceOrientationEffect(effect: DeviceOrientationEffect, deps: React.DependencyList = []): void
{
    React.useEffect(
        () => {
            let cleanupCallback = effect(Orientations.deviceOrientation);

            const deviceOrientationChangeListenerRemover = addDeviceOrientationChangeListener((deviceOrientation: DeviceOrientation) => {
                if (typeof cleanupCallback === "function") cleanupCallback();
                cleanupCallback = effect(deviceOrientation);
            });

            return () => {
                deviceOrientationChangeListenerRemover();
                if (typeof cleanupCallback === "function") cleanupCallback();
            };
        },
        deps,
    );
}

export default useDeviceOrientationEffect;