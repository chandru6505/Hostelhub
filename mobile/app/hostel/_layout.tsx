import { Stack } from "expo-router";

export default function HostelLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="[id]" 
        options={{ 
          headerTitle: "Hostel Details",
          headerShown: true 
        }} 
      />
    </Stack>
  );
}
