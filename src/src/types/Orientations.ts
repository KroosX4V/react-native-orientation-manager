import type DeviceOrientation from "../DeviceOrientation";
import type InterfaceOrientation from "../InterfaceOrientation";

interface Orientations
{
    readonly interfaceOrientation: InterfaceOrientation;
    readonly deviceOrientation: DeviceOrientation;
}

export default Orientations;