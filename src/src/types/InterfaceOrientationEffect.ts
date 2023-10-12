import type InterfaceOrientation from "../InterfaceOrientation";

type InterfaceOrientationEffect = (interfaceOrientation: InterfaceOrientation) => ReturnType<React.EffectCallback>;

export default InterfaceOrientationEffect;