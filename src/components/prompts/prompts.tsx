import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import promptsData from '../../../assets/prompt/prompt.json';
import { loadFonts, fonts } from '../../utils/Fonts/fonts';
import { Link } from 'expo-router';

const PromptOfTheDay = () => {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [fontError, setFontError] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(100); // Start at 100%

    // Parse the time string to get hours and calculate total minutes
    useEffect(() => {
        if (fontsLoaded) {
            // Example: If promptsData.time is "02:30:00" (2 hours, 30 minutes)
            try {
                const timeString = promptsData.time || "00:00:00";
                const [hours, minutes] = timeString.split(':').map(Number);
                const totalMinutesInitial = hours * 60 + minutes;

                // Mock timer to simulate time passing (in a real app, you'd compare with the end time)
                const timer = setInterval(() => {
                    setTimeRemaining(prev => {
                        const newValue = prev - 0.1;
                        if (newValue <= 0) {
                            clearInterval(timer);
                            return 0;
                        }
                        return newValue;
                    });
                }, 1000);

                return () => clearInterval(timer);
            } catch (error) {
                console.error("Error parsing time:", error);
            }
        }
    }, [fontsLoaded]);

    useEffect(() => {
        async function setupFonts() {
            const result = await loadFonts();
            setFontsLoaded(true);
            if (!result.success) {
                setFontError(result.error);
            }
        }

        setupFonts();
    }, []);

    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6441A5" />
                <Text style={styles.loadingText}>Loading fonts...</Text>
            </View>
        );
    }

    // Calculate progress bar color based on time remaining
    const getProgressBarColor = () => {
        if (timeRemaining > 66) return '#fff';
        if (timeRemaining > 33) return '#FFC107'; // Yellow
        return '#FF5252'; // Red
    };

    // Calculate hours and minutes from timeRemaining percentage
    const getTimeRemainingText = () => {
        try {
            const timeString = promptsData.time || "00:00:00";
            const [hours, minutes] = timeString.split(':').map(Number);
            const totalMinutesInitial = hours * 60 + minutes;

            const minutesLeft = Math.floor((totalMinutesInitial * timeRemaining) / 100);
            const hoursLeft = Math.floor(minutesLeft / 60);
            const minsLeft = minutesLeft % 60;

            return `${hoursLeft.toString().padStart(2, '0')}:${minsLeft.toString().padStart(2, '0')} remaining`;
        } catch (error) {
            return "Time remaining";
        }
    };

    return (
        <View style={styles.container}>
            {fontError && <Text style={styles.errorText}>Font loading error. Using system fonts.</Text>}

            {/* Greeting and title moved outside the card */}
            <View style={styles.outsideHeader}>
                <Text style={styles.greetingText}>Hi, Rohit! 👋</Text>
                <Text style={styles.promptTitle}>Prompt of the day</Text>
            </View>

            <Link href="(tabs)/post/" asChild>
                <TouchableOpacity style={styles.promptCard}>
                    <View style={styles.promptContainer}>
                        <View style={styles.promptTextBorder}>
                            <Text style={styles.promptText}>{promptsData.text}</Text>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.tapToAnswerText}>"tap to answer"</Text>
                        <Text style={styles.promptTime}>{promptsData.time}</Text>
                    </View>
                </TouchableOpacity>
            </Link>

            {/* Time Remaining Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBarBackground}>
                    <View
                        style={[
                            styles.progressBarFill,
                            {
                                width: `${timeRemaining}%`,
                                backgroundColor: getProgressBarColor()
                            }
                        ]}
                    />
                </View>
                <Text style={styles.timeRemainingText}>{getTimeRemainingText()}</Text>
            </View>
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
    errorText: {
        color: '#ff6b6b',
        marginBottom: 10,
        fontSize: 12,
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
        minHeight: 200, // Reduced height as content was removed
        display: 'flex',
        flexDirection: 'column',
    },
    promptContainer: {
        flex: 1,
        paddingHorizontal: 15,
        justifyContent: 'center',
        paddingTop: 20, // Added top padding since the header was removed
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
    },
    // Progress bar styles
    progressContainer: {
        bottom: 5,
        paddingHorizontal: 10,
    },
    progressBarBackground: {
        height: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    timeRemainingText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: fonts.medium,
        marginTop: 5,
        textAlign: 'right',
    }
});

export default PromptOfTheDay;