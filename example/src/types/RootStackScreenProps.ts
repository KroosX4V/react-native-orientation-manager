import type RootStackParamList from "./RootStackParamList";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { StackScreenProps } from "@react-navigation/stack";

type RootStackScreenProps<S extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, S> | StackScreenProps<RootStackParamList, S>;

export default RootStackScreenProps;