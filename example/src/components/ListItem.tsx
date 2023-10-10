import { useNavigation } from "@react-navigation/native";
import Color from "../Color";
import type RootStackParamList from "../types/RootStackParamList";
import type RootStackScreenProps from "../types/RootStackScreenProps";
import { TouchableWithoutFeedback, Text, View, StyleSheet } from "react-native";

type ListItemProps =
    {
        name: string;
        guard?: () => boolean;
    }
    &
    {
        [K in keyof RootStackParamList]:
            { screen: K } & (RootStackParamList[K] extends undefined ? { params?: RootStackParamList[K] } : { params: RootStackParamList[K] })
        ;
    }[keyof RootStackParamList]
;

function ListItem({ name, screen, params, guard }: ListItemProps): React.JSX.Element
{
    const navigation: RootStackScreenProps<"Home">["navigation"] = useNavigation();

    return (
        <TouchableWithoutFeedback onPress={() => (guard ? guard() : true) && navigation.push(screen, params)}>
            <View style={style.container}>
                <Text style={style.text}>{name}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
}

const style = StyleSheet.create({
    container: {
        width: "100%",
        minHeight: 50,
        justifyContent: "center",
        paddingLeft: 15,
        borderStyle: "solid",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#0D153D60",
    },
    text: {
        fontSize: 16,
        color: Color.PrimaryText,
    },
});

export default ListItem;