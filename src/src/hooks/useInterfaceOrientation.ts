import * as React from "react";
import type InterfaceOrientation from "../InterfaceOrientation";
import Orientations, { addInterfaceOrientationChangeListener } from "../manager";

function useInterfaceOrientation(): InterfaceOrientation
{
    const [interfaceOrientation, setInterfaceOrientation] = React.useState<InterfaceOrientation>(Orientations.interfaceOrientation);

    React.useEffect(
        () => {
            return addInterfaceOrientationChangeListener((interfaceOrientation: InterfaceOrientation) => {
                setInterfaceOrientation(interfaceOrientation);
            });
        },
        [],
    );

    return interfaceOrientation;
}

export default useInterfaceOrientation;