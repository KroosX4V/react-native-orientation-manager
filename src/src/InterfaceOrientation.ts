import InterfaceOrientationValue from "./types/InterfaceOrientationValue";

class InterfaceOrientation
{
    private readonly interfaceOrientationValue: InterfaceOrientationValue;

    constructor (interfaceOrientationValue: InterfaceOrientationValue)
    {
        this.interfaceOrientationValue = interfaceOrientationValue;
    }

    public isUnknown(): boolean
    {
        return this.interfaceOrientationValue === InterfaceOrientationValue.Unknown;
    }

    public isPortrait(): boolean
    {
        return this.interfaceOrientationValue === InterfaceOrientationValue.Portrait;
    }

    public isPortraitUpsideDown(): boolean
    {
        return this.interfaceOrientationValue === InterfaceOrientationValue.PortraitUpsideDown;
    }

    public isLandscapeLeft(): boolean
    {
        return this.interfaceOrientationValue === InterfaceOrientationValue.LandscapeLeft;
    }

    public isLandscapeRight(): boolean
    {
        return this.interfaceOrientationValue === InterfaceOrientationValue.LandscapeRight;
    }

    public isEitherPortrait(): boolean
    {
        return this.isPortrait() || this.isPortraitUpsideDown();
    }

    public isLandscape(): boolean
    {
        return this.isLandscapeLeft() || this.isLandscapeRight();
    }

    public getName(): string
    {
        switch (this.interfaceOrientationValue)
        {
            case InterfaceOrientationValue.Unknown:
                return "Unknown";
                
            case InterfaceOrientationValue.Portrait:
                return "Portrait";
                
            case InterfaceOrientationValue.PortraitUpsideDown:
                return "Portrait Upside Down";
                
            case InterfaceOrientationValue.LandscapeLeft:
                return "Landscape Left";
                
            case InterfaceOrientationValue.LandscapeRight:
                return "Landscape Right";

            default:
                throw new Error("Could not get name of interface orientation");
        }
    }

    public equals(interfaceOrientation: InterfaceOrientation): boolean
    {
        if (!(interfaceOrientation instanceof InterfaceOrientation)) throw new Error("Value compared to must be an instance of InterfaceOrientation");
        return this.interfaceOrientationValue === interfaceOrientation.interfaceOrientationValue;
    }
}

export default InterfaceOrientation;