import * as React from "react";
import { View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootStackNavigator } from "./components/navigators/RootStackNavigator";
import Color from "./Color";

function App(): React.JSX.Element
{
    return (
        <View style={style.backgroundMaskView}>
            <GestureHandlerRootView style={style.gestureHandlerRootView}>
                <SafeAreaProvider>
                    <NavigationContainer>
                        <RootStackNavigator />
                    </NavigationContainer>
                </SafeAreaProvider>
            </GestureHandlerRootView>
        </View>
    );
}

const style = StyleSheet.create({
    backgroundMaskView: {
        flex: 1,
        backgroundColor: Color.Primary,
    },
    gestureHandlerRootView: {
        flex: 1,
    },
});

export default App;