import * as React from "react";
import type DeviceOrientation from "../DeviceOrientation";
import Orientations, { addDeviceOrientationChangeListener } from "../manager";

function useDeviceOrientation(): DeviceOrientation
{
    const [deviceOrientation, setDeviceOrientation] = React.useState<DeviceOrientation>(Orientations.deviceOrientation);

    React.useEffect(
        () => {
            return addDeviceOrientationChangeListener((deviceOrientation: DeviceOrientation) => {
                setDeviceOrientation(deviceOrientation);
            });
        },
        [],
    );

    return deviceOrientation;
}

export default useDeviceOrientation;