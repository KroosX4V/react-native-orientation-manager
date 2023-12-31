# react-native-orientation-manager

A React Native module to retrieve interface/device orientation, listen to orientation changes, and lock screen to a specific orientation.

## Supported platforms

- [x] iOS
- [x] Android
- [x] Windows

## Installation

### Using npm

```sh
npm install react-native-orientation-manager
```

### Using yarn

```sh
yarn add react-native-orientation-manager
```

### iOS Only:
Make sure pods are installed by navigating to the iOS project and running:
```sh
bundle exec pod install
```

## Additional Configuration

To ensure that the module is fully initialized during app startup, include this import statement in your app's entry file (`index.*` or `App.*`):
```js
import "react-native-orientation-manager";
```
For example:
```ts
import "react-native-orientation-manager";
import { AppRegistry } from "react-native";
import App from "./src/App";
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => App);
```

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

```ts
import Orientations from "react-native-orientation-manager";
import type { InterfaceOrientation, DeviceOrientation } from "react-native-orientation-manager";

const currentInterfaceOrientation: InterfaceOrientation = Orientations.interfaceOrientation;
const currentDeviceOrientation: DeviceOrientation = Orientations.deviceOrientation;
```

### Use current interface and device orientations as state hooks:

```tsx
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

### Using functions:
```ts
import { lockToLandscape, lockToPortrait, unlockAllOrientations, resetInterfaceOrientationSetting } from "react-native-orientation-manager";

lockToLandscape();
// ...or
lockToPortrait();
// ...or
unlockAllOrientations();

// remove lock
resetInterfaceOrientationSetting();
```
### Using `OrientationLocker` component:
```tsx
import { View } from "react-native";
import { OrientationLocker } from "react-native-orientation-manager";

function LandscapeOnlyScreen(): React.JSX.Element
{
    return (
        <View style={{ flex: 1 }}>
            <OrientationLocker lock="Landscape" />
        </View>
    );
}
```

### Listen to orientation changes:

```ts
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

```ts
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

## Component OrientationLocker
| Prop | Type | Value |
| --- | --- | --- |
| `lock` | string | Can be one of the following:<ul><li>`"Portrait"`: Locks to portrait only. Same as `lockToPortrait()`</li><li>`"PortraitUpsideDown"`: Locks to portrait upside down only. Same as `lockToPortraitUpsideDown()`</li><li>`"LandscapeLeft"`: Locks to landscape left only. Same as `lockToLandscapeLeft()`</li><li>`"LandscapeRight"`: Locks to landscape right only. Same as `lockToLandscapeRight()`</li><li>`"Landscape"`: Locks to landscape left or right only. Same as `lockToLandscape()`</li><li>`"AllButUpsideDown"`: Locks to all orientations except portrait upside down. Same as `lockToAllOrientationsButUpsideDown()`. Not supported on Android</li><li>`"All"`: Unlocks all orientations. Same as `unlockAllOrientations()`</li><ul> |

## Hooks:

| Hook | Return Type | Functionality
| --- | --- | --- |
| `useInterfaceOrientation()` | InterfaceOrientation | Uses current interface orientation as a state |
| `useDeviceOrientation()` | DeviceOrientation | Uses current device orientation as a state |
| `useInterfaceOrientationEffect(`<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`effect: (interfaceOrientation: InterfaceOrientation) => CleanupFunction \| undefined,`<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`dependencies: any[] = [],`<BR>`)` | void | This runs on mount and subsequently whenever the interface orientation changes or when dependencies change during a re-render |
| `useDeviceOrientationEffect(`<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`effect: (deviceOrientation: DeviceOrientation) => CleanupFunction \| undefined,`<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`dependencies: any[] = [],`<BR>`)` | void | This runs on mount and subsequently whenever the device orientation changes or when dependencies change during a re-render |
| `useInterfaceOrientationWhenFocusedEffect(`<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`effect: (interfaceOrientation: InterfaceOrientation) => CleanupFunction \| undefined,`<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`dependencies: any[] = [],`<BR>`)` | void | This hook runs under three conditions:<BR><ol><li>When screen has just been focused</li><li>When interface orientation changes while screen is focused</li><li>When a re-render occurs and dependencies change while screen is focused</li></ol>Second argument (dependencies) is optional. When it's not given or an empty array is given, the third condition does not apply.<BR>You can provide a cleanup function that gets called before the effect function must run again or when screen loses focus |