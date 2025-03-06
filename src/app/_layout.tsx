import { Slot, Stack } from "expo-router";
import { tokenCache } from '../../cache'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'



export default function Rootlayout() {
    const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

    if (!publishableKey) {
        throw new Error(
            'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
        )
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
                <ClerkLoaded>
                    <Slot />
                </ClerkLoaded>
            </ClerkProvider>
        </GestureHandlerRootView >
    )
}



