import * as React from "react";
import type InterfaceOrientation from "../InterfaceOrientation";
import Orientations, { addInterfaceOrientationChangeListener } from "../manager";
import type InterfaceOrientationEffect from "../types/InterfaceOrientationEffect";

let useFocusEffect: ((effect: () => ReturnType<React.EffectCallback>) => void) | undefined = undefined;

try
{
    useFocusEffect = require("@react-navigation/native").useFocusEffect;
}
catch {}

function useInterfaceOrientationWhenFocusedEffect(effect: InterfaceOrientationEffect, deps: React.DependencyList = []): void
{
    if (!useFocusEffect) throw new Error("'@react-navigation/native' >= 5x package is required to use useInterfaceOrientationWhenFocusedEffect()");

    const effectRef = React.useRef<InterfaceOrientationEffect>(effect);
    effectRef.current = effect;

    useFocusEffect(React.useCallback(
        () => {
            let cleanupCallback = effectRef.current(Orientations.interfaceOrientation);

            const interfaceOrientationChangeListenerRemover = addInterfaceOrientationChangeListener((interfaceOrientation: InterfaceOrientation) => {
                if (typeof cleanupCallback === "function") cleanupCallback();
                cleanupCallback = effectRef.current(interfaceOrientation);
            });

            return () => {
                interfaceOrientationChangeListenerRemover();
                if (typeof cleanupCallback === "function") cleanupCallback();
            };
        },
        deps,
    ));
}

export default useInterfaceOrientationWhenFocusedEffect;