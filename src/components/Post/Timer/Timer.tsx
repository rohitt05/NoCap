import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Timer = ({ promptDate, promptTime }) => {
    // State for countdown timer
    const [timeRemaining, setTimeRemaining] = useState({
        minutes: 15,
        seconds: 0,
        milliseconds: 0
    });

    // State for tracking time elapsed after expiration
    const [timeElapsed, setTimeElapsed] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0
    });

    // Reference to store the interval ID
    const timerInterval = useRef(null);

    // Flag to track if timer has expired
    const [isExpired, setIsExpired] = useState(false);

    // State to track progress percentage
    const [progressPercent, setProgressPercent] = useState(100);

    // Calculate end time and start timer
    useEffect(() => {
        // Clear any existing interval
        if (timerInterval.current) {
            clearInterval(timerInterval.current);
        }

        // Get current time when component mounts
        const now = new Date();

        // Parse the prompt time (assuming format like "19:30")
        let promptTimeObj;
        try {
            // Try to create a date from promptDate and promptTime
            const [hours, minutes] = promptTime.split(':').map(num => parseInt(num, 10));
            promptTimeObj = new Date(promptDate);
            promptTimeObj.setHours(hours, minutes, 0, 0);
        } catch (error) {
            // Fallback: Use current time
            console.log('Error parsing prompt time:', error);
            promptTimeObj = new Date();
        }

        // Calculate end time (15 minutes after prompt time)
        const endTime = new Date(promptTimeObj.getTime() + 15 * 60 * 1000);
        const totalTime = 15 * 60 * 1000; // 15 minutes in milliseconds

        // Initial calculation of remaining time
        const calculateTimeRemaining = () => {
            const now = new Date();
            const diff = endTime - now;

            if (diff <= 0) {
                // Timer expired - calculate how late the user is
                const lateDiff = Math.abs(diff);
                const lateHours = Math.floor(lateDiff / (1000 * 60 * 60));
                const lateMinutes = Math.floor((lateDiff % (1000 * 60 * 60)) / (1000 * 60));
                const lateSeconds = Math.floor((lateDiff % (1000 * 60)) / 1000);
                const lateMilliseconds = Math.floor((lateDiff % 1000) / 10);

                setTimeRemaining({
                    minutes: 0,
                    seconds: 0,
                    milliseconds: 0
                });

                setTimeElapsed({
                    hours: lateHours,
                    minutes: lateMinutes,
                    seconds: lateSeconds,
                    milliseconds: lateMilliseconds
                });

                setProgressPercent(0);
                setIsExpired(true);
                return false;
            }

            // Calculate remaining time components
            const minutes = Math.floor(diff / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            const milliseconds = Math.floor((diff % 1000) / 10); // Get hundredths of a second (0-99)

            // Calculate progress percentage
            const progress = (diff / totalTime) * 100;
            setProgressPercent(progress);

            setTimeRemaining({
                minutes,
                seconds,
                milliseconds
            });
            return true;
        };

        // Initial calculation
        const isActive = calculateTimeRemaining();

        // Only set interval if timer is still active
        if (isActive) {
            timerInterval.current = setInterval(calculateTimeRemaining, 10);
        } else {
            // If already expired, continue to update the "late" timer
            timerInterval.current = setInterval(() => {
                const now = new Date();
                const lateDiff = Math.abs(endTime - now);
                const lateHours = Math.floor(lateDiff / (1000 * 60 * 60));
                const lateMinutes = Math.floor((lateDiff % (1000 * 60 * 60)) / (1000 * 60));
                const lateSeconds = Math.floor((lateDiff % (1000 * 60)) / 1000);
                const lateMilliseconds = Math.floor((lateDiff % 1000) / 10);

                setTimeElapsed({
                    hours: lateHours,
                    minutes: lateMinutes,
                    seconds: lateSeconds,
                    milliseconds: lateMilliseconds
                });
            }, 10);
        }

        // Clean up interval on component unmount
        return () => {
            if (timerInterval.current) {
                clearInterval(timerInterval.current);
            }
        };
    }, [promptDate, promptTime]);

    // Format the timer display with leading zeros
    const formatTime = (time) => {
        const { minutes, seconds, milliseconds } = time;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
    };

    // Format the late timer display with hours
    const formatLateTime = (time) => {
        const { hours, minutes, seconds, milliseconds } = time;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.container}>
            {!isExpired ? (
                // Timer is still active
                <View>
                    <View style={styles.timerRow}>
                        <Text style={styles.timerLabel}>Time Remaining : </Text>
                        <Text style={styles.bigTimerText}>
                            {formatTime(timeRemaining)}
                        </Text>
                    </View>

                    {/* Timer progress bar - only shown when timer is active */}
                    <View style={styles.progressBarContainer}>
                        <View
                            style={[
                                styles.progressBar,
                                { width: `${progressPercent}%` },
                                progressPercent < 30 ? styles.progressBarLow : null
                            ]}
                        />
                    </View>
                </View>
            ) : (
                // Timer has expired - show late message without progress bar
                <View style={styles.lateTimerContainer}>
                    <View style={styles.timerRow}>
                        <Text style={styles.timerLabel}>You are </Text>
                        <Text style={styles.lateTimerText}>
                            {formatLateTime(timeElapsed)}
                        </Text>
                        <Text style={styles.timerLabel}> late</Text>
                    </View>
                    {/* No progress bar rendered when expired */}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 5,
    },
    lateTimerContainer: {
        marginBottom: 10,
    },
    timerRow: {
        flexDirection: 'row',
        justifyContent: 'center', // Center the row contents
        alignItems: 'center',
        marginBottom: 8,
    },
    timerLabel: {
        color: '#FFFFFF',
        fontSize: 22,
    },
    bigTimerText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    lateTimerText: {
        color: '#e02e2e', // Red color for late timer
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    timerExpired: {
        color: '#999999', // Gray color when timer is expired
    },
    progressBarContainer: {
        height: 5,
        backgroundColor: '#222',
        borderRadius: 4,
        overflow: 'hidden',
        marginVertical: 4,
        width: '80%',          // Add this to make it 80% of parent width
        alignSelf: 'center',   // Add this to center the shortened bar
    },
    progressBar: {
        height: '70%',
        backgroundColor: '#fff',
        borderRadius: 25,
    },
    progressBarLow: {
        backgroundColor: '#fff', // Redder color when time is running low
    },
});

export default Timer;