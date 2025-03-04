import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const VoiceInputComponent = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [timer, setTimer] = useState(null);
    const [recording, setRecording] = useState(null);
    const [recordingUri, setRecordingUri] = useState(null);
    const [hasPermission, setHasPermission] = useState(null);
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackPosition, setPlaybackPosition] = useState(0);
    const [playbackDuration, setPlaybackDuration] = useState(0);

    // Animation values
    const pulseAnim = new Animated.Value(1);

    // Request permissions on component mount
    useEffect(() => {
        (async () => {
            try {
                const { status } = await Audio.requestPermissionsAsync();
                setHasPermission(status === 'granted');

                // Set up audio mode
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                    shouldDuckAndroid: true,
                    playThroughEarpieceAndroid: false,
                    staysActiveInBackground: false,
                });
            } catch (error) {
                console.error('Error requesting permissions:', error);
                Alert.alert('Permission Error', 'Failed to get microphone permission');
            }
        })();

        // Cleanup on unmount
        return () => {
            if (timer) {
                clearInterval(timer);
            }
            stopRecording();
            unloadSound();
        };
    }, []);

    const unloadSound = async () => {
        if (sound) {
            await sound.unloadAsync();
            setSound(null);
        }
    };

    // Start recording animation
    useEffect(() => {
        if (isRecording) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [isRecording]);

    // Max recording time (60 seconds)
    useEffect(() => {
        if (recordingTime >= 60) {
            stopRecording();
        }
    }, [recordingTime]);

    // Load sound after recording
    useEffect(() => {
        if (recordingUri) {
            loadSound();
        }
    }, [recordingUri]);

    // Update playback status
    useEffect(() => {
        if (sound) {
            const intervalId = setInterval(async () => {
                if (isPlaying) {
                    const status = await sound.getStatusAsync();
                    if (status.isLoaded) {
                        setPlaybackPosition(status.positionMillis / 1000);
                        if (status.didJustFinish) {
                            setIsPlaying(false);
                            await sound.setPositionAsync(0);
                            setPlaybackPosition(0);
                        }
                    }
                }
            }, 100);

            return () => clearInterval(intervalId);
        }
    }, [sound, isPlaying]);

    const loadSound = async () => {
        try {
            await unloadSound();

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: recordingUri },
                { shouldPlay: false }
            );

            setSound(newSound);

            // Get duration
            const status = await newSound.getStatusAsync();
            if (status.isLoaded) {
                setPlaybackDuration(status.durationMillis / 1000);
            }
        } catch (error) {
            console.error('Error loading sound', error);
        }
    };

    const playSound = async () => {
        try {
            if (!sound) await loadSound();
            await sound.playFromPositionAsync(playbackPosition * 1000);
            setIsPlaying(true);
        } catch (error) {
            console.error('Error playing sound', error);
        }
    };

    const pauseSound = async () => {
        try {
            if (sound) {
                await sound.pauseAsync();
                setIsPlaying(false);
            }
        } catch (error) {
            console.error('Error pausing sound', error);
        }
    };

    const resetRecording = async () => {
        await unloadSound();
        setRecordingUri(null);
        setPlaybackPosition(0);
        setPlaybackDuration(0);
    };

    // Start recording function
    const startRecording = async () => {
        if (recordingUri) {
            // If we already have a recording, reset it
            await resetRecording();
        }

        if (!hasPermission) {
            Alert.alert('Permission Required', 'Microphone permission is needed to record audio');
            return;
        }

        try {
            // Prepare recording
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
            setIsRecording(true);
            setRecordingTime(0);

            // Start timer
            const interval = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
            setTimer(interval);
        } catch (error) {
            console.error('Failed to start recording', error);
            Alert.alert('Recording Error', 'Failed to start recording');
        }
    };

    // Stop recording function
    const stopRecording = async () => {
        if (!recording) {
            return;
        }

        try {
            setIsRecording(false);

            // Stop timer
            if (timer) {
                clearInterval(timer);
                setTimer(null);
            }

            // Stop and unload recording
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecordingUri(uri);
            setRecording(null);

            console.log('Recording saved to:', uri);
        } catch (error) {
            console.error('Failed to stop recording', error);
        }
    };

    // Format time as mm:ss
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    // Render recording button or playback controls
    const renderControls = () => {
        if (recordingUri) {
            // Render playback controls
            return (
                <View style={styles.playbackContainer}>
                    <TouchableOpacity
                        style={styles.playButton}
                        onPress={isPlaying ? pauseSound : playSound}
                    >
                        <Ionicons
                            name={isPlaying ? "pause" : "play"}
                            size={50}
                            color="white"
                        />
                    </TouchableOpacity>

                    <View style={styles.timerContainer}>
                        <Text style={styles.timerText}>
                            {formatTime(playbackPosition)} / {formatTime(playbackDuration)}
                        </Text>
                        <TouchableOpacity onPress={resetRecording} style={styles.newRecordingButton}>
                            <Text style={styles.newRecordingText}>Record New</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        } else {
            // Render recording button
            return (
                <>
                    <TouchableOpacity
                        style={styles.recordButtonContainer}
                        onPressIn={startRecording}
                        onPressOut={stopRecording}
                        disabled={!hasPermission}
                    >
                        <Animated.View
                            style={[
                                styles.recordButtonOuter,
                                { transform: [{ scale: pulseAnim }] },
                                !hasPermission && styles.disabled
                            ]}
                        >
                            <View style={[
                                styles.recordButton,
                                isRecording ? styles.recordingActive : null,
                                !hasPermission && styles.disabled
                            ]}>
                                <View style={styles.recordButtonInner} />
                            </View>
                        </Animated.View>
                    </TouchableOpacity>

                    <View style={styles.timerContainer}>
                        <Text style={styles.timerText}>
                            {formatTime(recordingTime)} / 01:00
                        </Text>
                        <Text style={styles.recordingInstructions}>
                            {!hasPermission
                                ? 'Microphone permission required'
                                : isRecording
                                    ? 'Release to stop recording'
                                    : 'Hold to record'}
                        </Text>
                    </View>
                </>
            );
        }
    };

    return (
        <View style={styles.voiceContainer}>
            {renderControls()}
        </View>
    );
};

const styles = StyleSheet.create({
    voiceContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    recordButtonOuter: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(224, 46, 46, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordButton: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#e02e2e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordingActive: {
        backgroundColor: '#ff0000',
    },
    recordButtonInner: {
        width: 40,
        height: 40,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    timerContainer: {
        alignItems: 'center',
    },
    timerText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 8,
    },
    recordingInstructions: {
        color: '#999',
        fontSize: 14,
    },
    disabled: {
        opacity: 0.5,
    },
    playbackContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    playButton: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#2e7de0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    newRecordingButton: {
        marginTop: 10,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#e02e2e',
        borderRadius: 20,
    },
    newRecordingText: {
        color: 'white',
        fontWeight: 'bold',
    }
});

export default VoiceInputComponent;