import "react-native-gesture-handler";
import "react-native-orientation-manager";
import { AppRegistry } from "react-native";
import App from "./src/App";
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => App);