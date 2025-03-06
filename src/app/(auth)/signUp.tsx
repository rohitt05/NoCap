import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, StatusBar } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter, Link } from 'expo-router'

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [pendingVerification, setPendingVerification] = React.useState(false)
    const [code, setCode] = React.useState('')

    // Check if all fields have values for the signup form
    const isSignUpFormFilled = emailAddress.trim() !== '' && username.trim() !== '' && password.trim() !== '';

    // Check if verification code field is filled
    const isVerificationFormFilled = code.trim() !== '';

    // Handle submission of sign-up form
    const onSignUpPress = async () => {
        if (!isLoaded || !isSignUpFormFilled) return

        // Start sign-up process using email and password provided
        try {
            await signUp.create({
                emailAddress,
                username,
                password,
            })

            // Send user an email with verification code
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            // Set 'pendingVerification' to true to display second form
            // and capture OTP code
            setPendingVerification(true)
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }

    // Handle submission of verification form
    const onVerifyPress = async () => {
        if (!isLoaded || !isVerificationFormFilled) return

        try {
            // Use the code the user provided to attempt verification
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code,
            })

            // If verification was completed, set the session to active
            // and redirect the user
            if (signUpAttempt.status === 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId })
                router.replace('/')
            } else {
                // If the status is not complete, check why. User may need to
                // complete further steps.
                console.error(JSON.stringify(signUpAttempt, null, 2))
            }
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }

    if (pendingVerification) {
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
                        <Text style={styles.subheaderText}>Verify your email</Text>

                        <View style={styles.inputContainer}>
                            <TextInput
                                value={code}
                                placeholder="Enter your verification code"
                                placeholderTextColor="#666"
                                onChangeText={(code) => setCode(code)}
                                style={styles.input}
                            />

                            <TouchableOpacity
                                style={[
                                    styles.signInButton,
                                    isVerificationFormFilled ? styles.signInButtonActive : styles.signInButtonDisabled
                                ]}
                                onPress={onVerifyPress}
                                disabled={!isVerificationFormFilled}
                            >
                                <Text style={[
                                    styles.signInButtonText,
                                    isVerificationFormFilled ? styles.signInButtonTextActive : styles.signInButtonTextDisabled
                                ]}>Verify</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        )
    }

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
                    <Text style={styles.subheaderText}>Create your account</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            autoCapitalize="none"
                            value={emailAddress}
                            placeholder="Enter email"
                            placeholderTextColor="#666"
                            onChangeText={(email) => setEmailAddress(email)}
                            style={styles.input}
                        />
                        <TextInput
                            autoCapitalize="none"
                            value={username}
                            placeholder="Username"
                            placeholderTextColor="#666"
                            onChangeText={(username) => setUsername(username)}
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
                                isSignUpFormFilled ? styles.signInButtonActive : styles.signInButtonDisabled
                            ]}
                            onPress={onSignUpPress}
                            disabled={!isSignUpFormFilled}
                        >
                            <Text style={[
                                styles.signInButtonText,
                                isSignUpFormFilled ? styles.signInButtonTextActive : styles.signInButtonTextDisabled
                            ]}>Sign up</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.signUpContainer}>
                        <Text style={styles.signUpText}>Already have an account?</Text>
                        <Link href="/signIn" asChild>
                            <TouchableOpacity>
                                <Text style={styles.signUpLinkText}>Sign in</Text>
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