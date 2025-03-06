import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { loadFonts, fonts } from '../../utils/Fonts/fonts';
import { Link } from 'expo-router';
import { fetchPrompt } from '../../api/fetchPrompt';

const PromptOfTheDay = () => {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [fontError, setFontError] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(100);
    const [promptData, setPromptData] = useState({ text: '', time: '00:00:00' });
    const [loadingPrompt, setLoadingPrompt] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getPrompt = async () => {
            setLoadingPrompt(true);
            const { data, error } = await fetchPrompt();

            if (error) {
                setError(error);
            } else if (data) {
                setPromptData(data);
            }

            setLoadingPrompt(false);
        };

        getPrompt();
    }, []);

    useEffect(() => {
        if (fontsLoaded) {
            try {
                const timer = setInterval(() => {
                    setTimeRemaining(prev => Math.max(prev - 0.1, 0));
                }, 1000);
                return () => clearInterval(timer);
            } catch (error) {
                console.error('Error updating timer:', error);
            }
        }
    }, [fontsLoaded]);

    useEffect(() => {
        (async () => {
            const result = await loadFonts();
            setFontsLoaded(true);
            if (!result.success) setFontError(result.error);
        })();
    }, []);

    if (!fontsLoaded || loadingPrompt) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6441A5" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error loading prompt: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {fontError && <Text style={styles.errorText}>Font loading error. Using system fonts.</Text>}
            <View style={styles.outsideHeader}>
                <Text style={styles.greetingText}>Hi, Rohit! 👋</Text>
                <Text style={styles.promptTitle}>Prompt of the day</Text>
            </View>

            <Link href="(tabs)/post/" asChild>
                <TouchableOpacity style={styles.promptCard}>
                    <View style={styles.promptContainer}>
                        <View style={styles.promptTextBorder}>
                            <Text style={styles.promptText}>{promptData.text}</Text>
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <Text style={styles.tapToAnswerText}>"tap to answer"</Text>
                        <Text style={styles.promptTime}>{promptData.time}</Text>
                    </View>
                </TouchableOpacity>
            </Link>
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    loadingText: {
        color: '#fff',
        marginTop: 10,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 14,
    },
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#000',
    },
    outsideHeader: {
        marginBottom: 15,
        paddingHorizontal: 5,
        paddingTop: 10,
    },
    greetingText: {
        fontSize: 14,
        fontFamily: fonts.light,
        color: '#a8b1c2',
        marginBottom: 5,
    },
    promptTitle: {
        fontSize: 24,
        fontFamily: fonts.semiBoldItalic,
        color: '#fff',
    },
    promptCard: {
        backgroundColor: '#132fba',
        borderRadius: 20,
        minHeight: 200,
        flexDirection: 'column',
    },
    promptContainer: {
        flex: 1,
        paddingHorizontal: 15,
        justifyContent: 'center',
        paddingTop: 20,
    },
    promptTextBorder: {
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: 12,
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    promptText: {
        fontSize: 22,
        lineHeight: 30,
        fontFamily: fonts.semiBold,
        color: '#fff',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
    },
    tapToAnswerText: {
        fontSize: 12,
        fontFamily: fonts.medium,
        fontStyle: 'italic',
        color: '#fff',
    },
    promptTime: {
        fontSize: 14,
        fontFamily: fonts.medium,
        color: '#fff',
    }
});

export default PromptOfTheDay;