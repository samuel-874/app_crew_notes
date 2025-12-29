import { Stack } from "expo-router";
import { Button } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function HomeLayout() {
  const { signOut } = useAuth();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerRight: () => <Button title="Logout" onPress={signOut} />,
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
