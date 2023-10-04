# react-native-orientation-manager

A React Native module to retrieve interface/device orientation, listen to orientation changes, and lock screen to a specific orientation.

## Supported platforms

- [x] iOS
- [x] Android
- [x] Windows

## Installation

### npm

```sh
npm install react-native-orientation-manager
```

### yarn

```sh
yarn add react-native-orientation-manager
```

## Additional Configuration

### Android

Add the following code to `MainApplication.java` which is probably located at `android/app/src/main/java/<your package name>/MainApplication.java`
```java
// ... code
import com.kroosx4v.orientationmanager.OrientationManagerActivityLifecycleCallbacks;

public class MainApplication extends Application implements ReactApplication
{
    // ...code

    @Override
    public void onCreate()
    {
        // ...code
        registerActivityLifecycleCallbacks(new OrientationManagerActivityLifecycleCallbacks());
    }
}
```

### iOS

Add the following code to your project's `AppDelegate.mm`
```objectivec
// ...code
#import "RNOrientationManager.h"

@implementation AppDelegate

// ...code

- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window
{
    return [RNOrientationManager getSupportedInterfaceOrientations];
}

@end
```


## Usage

### Retrieve current interface and device orientations:

```js
import Orientations from "react-native-orientation-manager";
import type { InterfaceOrientation, DeviceOrientation } from "react-native-orientation-manager";

const currentInterfaceOrientation: InterfaceOrientation = Orientations.interfaceOrientation;
const currentDeviceOrientation: DeviceOrientation = Orientations.deviceOrientation;
```

### Use current interface and device orientations as state hooks:

```js
import { Text } from "react-native";
import { useInterfaceOrientation, useDeviceOrientation } from "react-native-orientation-manager";

function OrientationValues(): React.JSX.Element
{
    const interfaceOrientation = useInterfaceOrientation();
    const deviceOrientation = useDeviceOrientation();

    return (
        <>
            <Text style={{ color: "#841584" }}>
                Interface orientation: {interfaceOrientation.getName()}
            </Text>
            <Text style={{ color: "#841584" }}>
                Device orientation: {deviceOrientation.getName()}
            </Text>
        </>
    );
}
```

### Lock interface orientation to a specific orientation:

```js
import { lockToLandscape, lockToPortrait, unlockAllOrientations, resetInterfaceOrientationSetting } from "react-native-orientation-manager";

lockToLandscape();
// ...or
lockToPortrait();
// ...or
unlockAllOrientations();

// remove lock
resetInterfaceOrientationSetting();
```

### Listen to orientation changes:

```js
import { addInterfaceOrientationChangeListener, addDeviceOrientationChangeListener } from "react-native-orientation-manager";
import type { InterfaceOrientation, DeviceOrientation } from "react-native-orientation-manager";

const listenerRemover = addInterfaceOrientationChangeListener((interfaceOrientation: InterfaceOrientation) => {
    if (interfaceOrientation.isPortrait())
    {
        // ...do something
    }
});

const listenerRemover2 = addDeviceOrientationChangeListener((deviceOrientation: DeviceOrientation) => {
    if (deviceOrientation.isPortrait())
    {
        // ...do something
    }
});
```

### Do something every time the interface orientation changes while a screen is focused (requires @react-navigation/native 5x or higher):

```js
import { useInterfaceOrientationWhenFocusedEffect } from "react-native-orientation-manager";
import type { InterfaceOrientation } from "react-native-orientation-manager";
import { useNavigation } from "@react-navigation/native";

function SomeComponent(): React.JSX.Element
{
    const navigation = useNavigation();

    useInterfaceOrientationWhenFocusedEffect((interfaceOrientation: InterfaceOrientation) => {
        if (!interfaceOrientation.isLandscape())
        {
            // Only allow landscape orientation in this screen with the possibility of leaving it when orientation changes to portrait
            navigation.goBack();
            return;
        }

        // optionally return a cleanup function
        return () => {
            // ...do something
        };
    });
}
```

# API

## Class InterfaceOrientation

| Function | Return Type |
| --- | --- |
| `isUnknown()` | boolean |
| `isPortrait()` | boolean |
| `isPortraitUpsideDown()` | boolean |
| `isLandscapeLeft()` | boolean |
| `isLandscapeRight()` | boolean |
| `isEitherPortrait()` | boolean |
| `isLandscape()` | boolean |
| `getName()` | string |
| `equals(interfaceOrientation: InterfaceOrientation)` | boolean |

## Class DeviceOrientation

| Function | Return Type |
| --- | --- |
| `isUnknown()` | boolean |
| `isPortrait()` | boolean |
| `isPortraitUpsideDown()` | boolean |
| `isLandscapeLeft()` | boolean |
| `isLandscapeRight()` | boolean |
| `isFaceUp()` | boolean |
| `isFaceDown()` | boolean |
| `isEitherPortrait()` | boolean |
| `isLandscape()` | boolean |
| `isFace()` | boolean |
| `getName()` | string |
| `equals(deviceOrientation: DeviceOrientation)` | boolean |

## Default Export: An object with the following properties:

| Property | Type | Represents |
| --- | --- | --- |
| `interfaceOrientation` | InterfaceOrientation | Current interface orientation |
| `deviceOrientation` | DeviceOrientation | Current device orienation |

## Listener Registrar Functions:

| Function | Returns |
| --- | --- |
| `addInterfaceOrientationChangeListener((interfaceOrientation: InterfaceOrientation) => void)` | Listener remover function |
| `addDeviceOrientationChangeListener((deviceOrientation: DeviceOrientation) => void)` | Listener remover function |

## Interface Orientation Locking Functions:

| Function | Return Type | Notes |
| --- | --- | --- |
| `async lockToPortrait()` | Promise\<void\> ||
| `async lockToPortraitUpsideDown()` | Promise\<void\> ||
| `async lockToLandscapeLeft()` | Promise\<void\> ||
| `async lockToLandscapeRight()` | Promise\<void\> ||
| `async lockToLandscape()` | Promise\<void\> ||
| `async lockToAllOrientationsButUpsideDown()` | Promise\<void\> | Not supported on Android |
| `async unlockAllOrientations()` | Promise\<void\> ||

## To remove interface orientation lock:

| Function | Return Type |
| --- | --- |
| `async resetInterfaceOrientationSetting()` | Promise\<void\> |

## Hooks:

| Hook | Return Type | Functionality
| --- | --- | --- |
| `useInterfaceOrientation()` | InterfaceOrientation | Uses current interface orientation as a state
| `useDeviceOrientation()` | DeviceOrientation | Uses current device orientation as a state
| `useInterfaceOrientationWhenFocusedEffect(effect: (interfaceOrientation: InterfaceOrientation) => ((...args: any) => any) \| undefined)` | void | Runs every time interface orientation changes while a screen is focused or when it's just been focused. You can return a cleanup function that's called before when the effect function must be called again