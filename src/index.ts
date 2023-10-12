export { default } from "./src/manager";
export * from "./src/manager";

export * from "./src/lockFunctions";

export { default as InterfaceOrientation } from "./src/InterfaceOrientation";
export { default as DeviceOrientation } from "./src/DeviceOrientation";

export { default as useInterfaceOrientation } from "./src/hooks/useInterfaceOrientation";
export { default as useInterfaceOrientationEffect } from "./src/hooks/useInterfaceOrientationEffect";
export { default as useInterfaceOrientationWhenFocusedEffect } from "./src/hooks/useInterfaceOrientationWhenFocusedEffect";
export { default as useDeviceOrientation } from "./src/hooks/useDeviceOrientation";
export { default as useDeviceOrientationEffect } from "./src/hooks/useDeviceOrientationEffect";

export { default as OrientationLocker } from "./src/components/OrientationLocker";