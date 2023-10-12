import type DeviceOrientation from "../DeviceOrientation";

type DeviceOrientationEffect = (deviceOrientation: DeviceOrientation) => ReturnType<React.EffectCallback>;

export default DeviceOrientationEffect;