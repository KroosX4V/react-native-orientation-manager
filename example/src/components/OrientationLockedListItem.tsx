import type RootStackParamList from "../types/RootStackParamList";
import ListItem from "./ListItem";

interface OrientationLockedListItemProps
{
    name: Parameters<typeof ListItem>[0]["name"];
    lock: RootStackParamList["OrientationLocked"]["lock"];
    text: RootStackParamList["OrientationLocked"]["text"];
    guard?: Parameters<typeof ListItem>[0]["guard"];
}

function OrientationLockedListItem({ name, lock, text, guard }: OrientationLockedListItemProps): React.JSX.Element
{
    return (
        <ListItem name={name} screen="OrientationLocked" params={{ lock, title: name, text }} guard={guard} />
    );
}

export default OrientationLockedListItem;