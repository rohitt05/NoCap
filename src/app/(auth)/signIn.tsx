import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, Button, View, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, StatusBar } from 'react-native'
import React from 'react'

export default function Page() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')

    // Check if both email and password have values
    const isFormFilled = emailAddress.trim() !== '' && password.trim() !== '';

    // Handle the submission of the sign-in form
    const onSignInPress = React.useCallback(async () => {
        if (!isLoaded || !isFormFilled) return

        // Start the sign-in process using the email and password provided
        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            })

            // If sign-in process is complete, set the created session as active
            // and redirect the user
            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                router.replace('/')
            } else {
                // If the status isn't complete, check why. User might need to
                // complete further steps.
                console.error(JSON.stringify(signInAttempt, null, 2))
            }
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }, [isLoaded, emailAddress, password, isFormFilled])

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>NoCap</Text>
            </View>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoid}
            >
                <View style={styles.formContainer}>
                    <Text style={styles.subheaderText}>Sign in to continue</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            autoCapitalize="none"
                            value={emailAddress}
                            placeholder="Enter email"
                            placeholderTextColor="#666"
                            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                            style={styles.input}
                        />
                        <TextInput
                            value={password}
                            placeholder="Enter password"
                            placeholderTextColor="#666"
                            secureTextEntry={true}
                            onChangeText={(password) => setPassword(password)}
                            style={styles.input}
                        />

                        <TouchableOpacity
                            style={[
                                styles.signInButton,
                                isFormFilled ? styles.signInButtonActive : styles.signInButtonDisabled
                            ]}
                            onPress={onSignInPress}
                            disabled={!isFormFilled}
                        >
                            <Text style={[
                                styles.signInButtonText,
                                isFormFilled ? styles.signInButtonTextActive : styles.signInButtonTextDisabled
                            ]}>Sign in</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.signUpContainer}>
                        <Text style={styles.signUpText}>Don't have an account?</Text>
                        <Link href="/signUp" asChild>
                            <TouchableOpacity>
                                <Text style={styles.signUpLinkText}>Sign up</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    logoText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
    },
    keyboardAvoid: {
        flex: 1,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    subheaderText: {
        fontSize: 16,
        color: '#888',
        marginBottom: 40,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 30,
    },
    input: {
        backgroundColor: '#121212',
        borderRadius: 12,
        padding: 16,
        color: 'white',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#333',
        fontSize: 16,
    },
    signInButton: {
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    signInButtonDisabled: {
        backgroundColor: '#333', // Gray when disabled
    },
    signInButtonActive: {
        backgroundColor: '#FFFFFF', // White when active
    },
    signInButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    signInButtonTextDisabled: {
        color: '#666', // Darker gray text when disabled
    },
    signInButtonTextActive: {
        color: '#000', // Black text on white background when active
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    signUpText: {
        color: '#888',
        marginRight: 5,
    },
    signUpLinkText: {
        color: 'white',
        fontWeight: 'bold',
    },
});