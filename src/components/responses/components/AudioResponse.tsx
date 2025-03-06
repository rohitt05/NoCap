import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { ResponseItemProps } from '../types';
import Svg, { Path } from 'react-native-svg';
import { Entypo, Ionicons, FontAwesome, Feather } from '@expo/vector-icons';
import { fonts } from '../../../utils/Fonts/fonts';

const { width } = Dimensions.get('window');

// Add this function to format relative time (similar to the TextResponse component)
const getRelativeTime = (timestamp: string | number | Date) => {
    if (!timestamp) return 'Just now';

    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();

    // Convert to seconds
    const diffSec = Math.floor(diffMs / 1000);

    // Less than a minute
    if (diffSec < 60) {
        return diffSec <= 5 ? 'Just now' : `${diffSec} secs ago`;
    }

    // Less than an hour
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) {
        return diffMin === 1 ? '1 min ago' : `${diffMin} mins ago`;
    }

    // Less than a day
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) {
        return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`;
    }

    // Less than a week
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 7) {
        return diffDay === 1 ? 'Yesterday' : `${diffDay} days ago`;
    }

    // Less than a month
    const diffWeek = Math.floor(diffDay / 7);
    if (diffWeek < 4) {
        return diffWeek === 1 ? '1 week ago' : `${diffWeek} weeks ago`;
    }

    // Format as date for older posts
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return past.toLocaleDateString('en-US', options);
};

const AudioResponse: React.FC<ResponseItemProps> = ({ item }) => {
    const [playing, setPlaying] = useState<boolean>(false);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [position, setPosition] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    // Animation values for the waveform
    const waveAnim1 = useRef(new Animated.Value(0)).current;
    const waveAnim2 = useRef(new Animated.Value(0)).current;
    const waveAnim3 = useRef(new Animated.Value(0)).current;

    // Start animations when component mounts
    useEffect(() => {
        const animateWaves = () => {
            Animated.loop(
                Animated.timing(waveAnim1, {
                    toValue: 1,
                    duration: 8000,
                    useNativeDriver: false,
                })
            ).start();

            Animated.loop(
                Animated.timing(waveAnim2, {
                    toValue: 1,
                    duration: 12000,
                    useNativeDriver: false,
                })
            ).start();

            Animated.loop(
                Animated.timing(waveAnim3, {
                    toValue: 1,
                    duration: 10000,
                    useNativeDriver: false,
                })
            ).start();
        };

        animateWaves();
    }, []);

    // Initialize audio when component mounts - updated to use response_content
    useEffect(() => {
        const initializeAudio = async () => {
            try {
                // Use response_content as the audio URL
                const audioUrl = item.response_content;

                if (audioUrl) {
                    // Make sure to unload any previous sound
                    if (sound) {
                        await sound.unloadAsync();
                    }

                    // Pre-load the audio file but don't play it yet
                    const { sound: newSound } = await Audio.Sound.createAsync(
                        { uri: audioUrl },
                        { shouldPlay: false },
                        onPlaybackStatusUpdate
                    );

                    setSound(newSound);

                    // Get initial status to set duration
                    const status = await newSound.getStatusAsync();
                    if (status.isLoaded) {
                        setDuration(status.durationMillis || 0);
                    }
                }
            } catch (error) {
                console.error("Error initializing audio:", error);
            }
        };

        initializeAudio();
    }, [item.response_content]);

    // Callback for audio playback status updates
    const onPlaybackStatusUpdate = (status: any) => {
        if (status.isLoaded) {
            setPosition(status.positionMillis);
            setPlaying(status.isPlaying);

            if (status.didJustFinish) {
                setPlaying(false);
            }
        }
    };

    // Function to handle audio playback - updated to use response_content
    const playAudio = async (): Promise<void> => {
        try {
            if (!sound) {
                // If sound is not loaded yet, initialize it
                const audioUrl = item.response_content;
                if (audioUrl) {
                    const { sound: newSound } = await Audio.Sound.createAsync(
                        { uri: audioUrl },
                        { shouldPlay: true },
                        onPlaybackStatusUpdate
                    );
                    setSound(newSound);
                    setPlaying(true);
                }
            } else {
                // Sound is already loaded, toggle play/pause
                if (playing) {
                    await sound.pauseAsync();
                } else {
                    // If we reached the end, reset position
                    if (position >= duration && duration > 0) {
                        await sound.setPositionAsync(0);
                    }
                    await sound.playAsync();
                }
            }
        } catch (error) {
            console.error("Error playing audio:", error);
        }
    };

    // Format time for display (mm:ss)
    const formatTime = (milliseconds: number) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Clean up audio resources when component unmounts
    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    // Animated values for the waves
    const wave1Offset = waveAnim1.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%']
    });

    const wave2Offset = waveAnim2.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%']
    });

    const wave3Offset = waveAnim3.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%']
    });

    const wave1Opacity = playing ? 0.8 : 0.4;
    const wave2Opacity = playing ? 0.7 : 0.3;
    const wave3Opacity = playing ? 0.9 : 0.5;

    return (
        <View style={styles.responseItem}>
            {/* Dark gradient background */}
            <LinearGradient
                colors={['#000', '#000033', '#000066']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.backgroundGradient}
            />

            {/* Menu dots in top right corner */}
            <TouchableOpacity style={styles.menuDotsContainer}>
                <Entypo name="dots-two-vertical" size={24} color="white" style={styles.menuDots} />
            </TouchableOpacity>

            {/* Animated Waveform */}
            <View style={styles.waveformContainer}>
                <Animated.View style={[styles.waveWrapper, { left: wave1Offset }]}>
                    <Svg height="80" width={width * 2} style={{ opacity: wave1Opacity }}>
                        <Path
                            d={`M0,40 Q${width * 0.25},10 ${width * 0.5},40 T${width},40 T${width * 1.5},40 T${width * 2},40`}
                            fill="none"
                            stroke="rgba(255, 50, 100, 0.6)"
                            strokeWidth="2"
                        />
                    </Svg>
                </Animated.View>

                <Animated.View style={[styles.waveWrapper, { left: wave2Offset }]}>
                    <Svg height="80" width={width * 2} style={{ opacity: wave2Opacity }}>
                        <Path
                            d={`M0,40 Q${width * 0.25},70 ${width * 0.5},40 T${width},40 T${width * 1.5},40 T${width * 2},40`}
                            fill="none"
                            stroke="rgba(80, 200, 255, 0.6)"
                            strokeWidth="2"
                        />
                    </Svg>
                </Animated.View>

                <Animated.View style={[styles.waveWrapper, { left: wave3Offset }]}>
                    <Svg height="80" width={width * 2} style={{ opacity: wave3Opacity }}>
                        <Path
                            d={`M0,40 Q${width * 0.25},20 ${width * 0.5},60 T${width},40 T${width * 1.5},20 T${width * 2},40`}
                            fill="none"
                            stroke="rgba(200, 80, 255, 0.6)"
                            strokeWidth="2"
                        />
                    </Svg>
                </Animated.View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.header}>
                    {/* Use placeholder profile pic if none provided */}
                    {item.profile_picture_url ? (
                        <Image
                            source={{ uri: item.profile_picture_url }}
                            style={styles.profilePic}
                        />
                    ) : (
                        <View style={styles.placeholderPic} />
                    )}
                    <View style={styles.headerInfo}>
                        <Text style={styles.username}>{item.username || 'Unknown User'}</Text>
                        <Text style={styles.timestamp}>{getRelativeTime(item.timestamp)}</Text>
                    </View>
                </View>
            </View>

            {/* Audio controls at the bottom left */}
            <TouchableOpacity
                style={styles.audioControls}
                onPress={playAudio}
                activeOpacity={0.7}
            >
                <View style={styles.playIconContainer}>
                    {playing ? (
                        <Ionicons name="pause" size={22} color="white" />
                    ) : (
                        <Ionicons name="play" size={22} color="white" />
                    )}
                </View>
                <Text style={styles.audioDuration}>
                    {formatTime(position)} / {formatTime(duration)}
                </Text>
            </TouchableOpacity>

            {/* Reactions Container - At the bottom right */}
            <View style={styles.reactionsContainer}>
                <TouchableOpacity style={styles.actionButton}>
                    <Feather name="send" size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.reactionIcon}>
                    <Entypo name="emoji-flirt" size={18} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.reactionIcon}>
                    <Entypo name="emoji-happy" size={18} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    responseItem: {
        marginBottom: 16,
        borderRadius: 20,
        overflow: 'hidden',
        height: 250,
        position: 'relative',
    },
    backgroundGradient: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.5,
    },
    menuDotsContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 25,
        padding: 8,
    },
    menuDots: {
        flex: 1,
    },
    waveformContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    waveWrapper: {
        position: 'absolute',
        width: width * 2,
        height: 80,
    },
    content: {
        padding: 16,
        flex: 1,
        zIndex: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    profilePic: {
        width: 42,
        height: 42,
        borderRadius: 25,
    },
    placeholderPic: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#444',
    },
    headerInfo: {
        marginLeft: 12,
    },
    username: {
        fontFamily: fonts.extraBold,
        fontWeight: '700',
        fontSize: 16,
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    timestamp: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    audioControls: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 15,
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    playIconContainer: {
        marginRight: 8,
    },
    audioDuration: {
        color: 'white',
        fontSize: 13,
    },
    reactionsContainer: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        flexDirection: 'row',
        zIndex: 15,
    },
    actionButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        // backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    reactionIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        borderStyle: "dashed",
    }
});

export default AudioResponse;