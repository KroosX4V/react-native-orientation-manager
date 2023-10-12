import * as React from "react";
import type InterfaceOrientationEffect from "../types/InterfaceOrientationEffect";
import Orientations, { addInterfaceOrientationChangeListener } from "../manager";
import type InterfaceOrientation from "../InterfaceOrientation";

function useInterfaceOrientationEffect(effect: InterfaceOrientationEffect, deps: React.DependencyList = []): void
{
    React.useEffect(
        () => {
            let cleanupCallback = effect(Orientations.interfaceOrientation);

            const interfaceOrientationChangeListenerRemover = addInterfaceOrientationChangeListener((interfaceOrientation: InterfaceOrientation) => {
                if (typeof cleanupCallback === "function") cleanupCallback();
                cleanupCallback = effect(interfaceOrientation);
            });

            return () => {
                interfaceOrientationChangeListenerRemover();
                if (typeof cleanupCallback === "function") cleanupCallback();
            };
        },
        deps,
    );
}

export default useInterfaceOrientationEffect;