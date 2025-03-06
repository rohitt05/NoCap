import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function AuthLayout() {
    const { isSignedIn } = useAuth()

    if (isSignedIn) {
        return <Redirect href={'/'} />
    }

    return (
        <Stack>
            <Stack.Screen name="Sign In" options={{ headerShown: false }} />
            <Stack.Screen name="Sign Up" options={{ headerShown: false }} />
        </Stack>
    )
}