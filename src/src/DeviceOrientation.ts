import DeviceOrientationValue from "./types/DeviceOrientationValue";

class DeviceOrientation
{
    private readonly deviceOrientationValue: DeviceOrientationValue;

    constructor (deviceOrientationValue: DeviceOrientationValue)
    {
        this.deviceOrientationValue = deviceOrientationValue;
    }

    public isUnknown(): boolean
    {
        return this.deviceOrientationValue === DeviceOrientationValue.Unknown;
    }

    public isPortrait(): boolean
    {
        return this.deviceOrientationValue === DeviceOrientationValue.Portrait;
    }

    public isPortraitUpsideDown(): boolean
    {
        return this.deviceOrientationValue === DeviceOrientationValue.PortraitUpsideDown;
    }

    public isLandscapeLeft(): boolean
    {
        return this.deviceOrientationValue === DeviceOrientationValue.LandscapeLeft;
    }

    public isLandscapeRight(): boolean
    {
        return this.deviceOrientationValue === DeviceOrientationValue.LandscapeRight;
    }

    public isFaceUp(): boolean
    {
        return this.deviceOrientationValue === DeviceOrientationValue.FaceDown;
    }

    public isFaceDown(): boolean
    {
        return this.deviceOrientationValue === DeviceOrientationValue.FaceDown;
    }

    public isEitherPortrait(): boolean
    {
        return this.isPortrait() || this.isPortraitUpsideDown();
    }

    public isLandscape(): boolean
    {
        return this.isLandscapeLeft() || this.isLandscapeRight();
    }

    public isFace(): boolean
    {
        return this.isFaceUp() || this.isFaceDown();
    }

    public getName(): string
    {
        switch (this.deviceOrientationValue)
        {
            case DeviceOrientationValue.Unknown:
                return "Unknown";
                
            case DeviceOrientationValue.Portrait:
                return "Portrait";
                
            case DeviceOrientationValue.PortraitUpsideDown:
                return "Portrait Upside Down";
                
            case DeviceOrientationValue.LandscapeLeft:
                return "Landscape Left";
                
            case DeviceOrientationValue.LandscapeRight:
                return "Landscape Right";
                
            case DeviceOrientationValue.FaceUp:
                return "Face Up";
                
            case DeviceOrientationValue.FaceDown:
                return "Face Down";

            default:
                throw new Error("Could not get name of device orientation");
        }
    }

    public equals(deviceOrientation: DeviceOrientation): boolean
    {
        if (!(deviceOrientation instanceof DeviceOrientation)) throw new Error("Value compared to must be an instance of DeviceOrientation");
        return this.deviceOrientationValue === deviceOrientation.deviceOrientationValue;
    }
}

export default DeviceOrientation;