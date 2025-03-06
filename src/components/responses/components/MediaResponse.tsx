import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Alert, TouchableWithoutFeedback } from 'react-native';
import { Video, AVPlaybackStatus, ResizeMode } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Text } from 'react-native';
import { Image } from 'expo-image'; // Changed to use expo-image
import { Ionicons, Entypo, Feather, FontAwesome } from '@expo/vector-icons';
import { fonts } from '../../../utils/Fonts/fonts';
import { ResponseItemProps } from '../types';

// Add this function to format relative time (similar to TextResponse)
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

const MediaResponse: React.FC<ResponseItemProps> = ({ item }) => {
    const [videoPlaying, setVideoPlaying] = useState<boolean>(false);
    const [videoUri, setVideoUri] = useState<string>("");
    const [videoError, setVideoError] = useState<string | null>(null);
    const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
    const videoRef = useRef<Video>(null);

    // Debug tap events
    const [tapCount, setTapCount] = useState<number>(0);

    // Determine media type from response_type and URL
    const mediaType = item.response_type; // 'image', 'video', or 'gif'
    const mediaUrl = item.response_content; // URL is stored in response_content

    // Resolve the correct video URI when component mounts
    useEffect(() => {
        if (mediaType === 'video' && mediaUrl) {
            console.log('Initializing video with media_url:', mediaUrl);
            resolveVideoUri(mediaUrl);
        }
    }, [mediaType, mediaUrl]);

    // Function to resolve local file paths to proper URIs
    const resolveVideoUri = (uri: string): void => {
        console.log('resolveVideoUri called with uri:', uri);
        let resolvedUri = uri;

        // Handle different URI formats based on platform
        if (uri.startsWith('/')) {
            resolvedUri = Platform.OS === 'android'
                ? `file://${uri}`
                : `${FileSystem.documentDirectory}${uri.substring(1)}`;
            console.log('URI starts with /, resolved to:', resolvedUri);
        }
        // For other URI types, keep as is

        setVideoUri(resolvedUri);
        setVideoError(null);
        setVideoLoaded(false);

        // Reset video state when changing URI
        setVideoPlaying(false);

        // Validate local file existence
        if (resolvedUri.startsWith('file://') || resolvedUri.includes(FileSystem.documentDirectory)) {
            console.log('Checking if file exists at path:', resolvedUri.replace('file://', ''));
            FileSystem.getInfoAsync(resolvedUri.replace('file://', ''))
                .then(info => {
                    console.log('File info result:', info);
                    if (!info.exists) {
                        console.log('File does not exist, trying alternate formats');
                        tryAlternateUriFormats(uri);
                    } else {
                        console.log('File exists at path, proceeding with video');
                    }
                })
                .catch((error) => {
                    console.log('Error checking file existence:', error);
                    tryAlternateUriFormats(uri);
                });
        }
    };

    // Try different URI formats as fallbacks
    const tryAlternateUriFormats = (originalUri: string) => {
        console.log('tryAlternateUriFormats called with originalUri:', originalUri);
        const alternateFormats = [
            `asset://${originalUri.replace(/^\//, '')}`,
            originalUri.replace(/^file:\/\//, ''),
            `content://media${originalUri}`,
            Platform.OS === 'ios' ? `asset:/${originalUri}` : null,
            `${FileSystem.cacheDirectory}${originalUri.replace(/^\//, '')}`,
            !originalUri.includes('://') && !originalUri.startsWith('/') ? `https://${originalUri}` : null,
            originalUri // Original as last resort
        ].filter(Boolean) as string[];

        console.log('Trying alternate URI formats:', alternateFormats);
        loadVideoWithFallbacks(alternateFormats, 0);
    };

    // Attempt to load the video with fallback URIs
    const loadVideoWithFallbacks = (uriList: string[], index: number) => {
        console.log(`loadVideoWithFallbacks: trying URI at index ${index}:`, uriList[index]);
        if (index >= uriList.length) {
            console.log('All URI formats failed');
            setVideoError("Could not load video with any URI format");
            return;
        }

        setVideoUri(uriList[index]);
        console.log('Setting video URI to:', uriList[index]);
        // Video component will handle loading and errors
    };

    // Debug function to track taps
    const logTap = () => {
        const newCount = tapCount + 1;
        console.log(`TAP DETECTED (${newCount})`);
        setTapCount(newCount);
    };

    // Video playback toggle function
    const toggleVideoPlayback = async (): Promise<void> => {
        console.log('toggleVideoPlayback called, videoPlaying:', videoPlaying);
        logTap();

        if (!videoRef.current) {
            console.log('Video reference is null');
            Alert.alert("Debug", "Video reference is null");
            return;
        }

        try {
            // Force video to play regardless of current state for testing
            console.log('Forcing video playback attempt...');

            try {
                // Direct approach first
                if (!videoPlaying) {
                    const playResult = await videoRef.current.playAsync();
                    console.log('Direct play result:', playResult);
                    setVideoPlaying(true);
                } else {
                    await videoRef.current.pauseAsync();
                    setVideoPlaying(false);
                }
            } catch (playError) {
                console.log('Direct play failed, attempting alternate approach:', playError);

                // Try to get the current status
                const status = await videoRef.current.getStatusAsync().catch(err => {
                    console.log('getStatusAsync failed:', err);
                    return null;
                });

                console.log('Current video status:', status);

                // Try full reload approach
                console.log('Trying reload approach');
                await videoRef.current.unloadAsync().catch(e => console.log('Unload error:', e));
                await videoRef.current.loadAsync(
                    { uri: videoUri },
                    { shouldPlay: true, positionMillis: 0 },
                    false
                ).catch(e => console.log('Load error:', e));

                // Update state based on force play
                setVideoPlaying(true);
            }

            console.log('Toggle video playback completed');

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error playing video";
            console.error('VIDEO PLAYBACK ERROR:', errorMessage);

            // Alert for debugging
            Alert.alert(
                "Video Debug Info",
                `Tap count: ${tapCount}\nError: ${errorMessage}\nURI: ${videoUri.substring(0, 50)}...`
            );

            setVideoError(errorMessage);
        }
    };

    // Handle video status updates
    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        console.log('onPlaybackStatusUpdate:', status.isLoaded ?
            `isPlaying: ${status.isPlaying}, positionMillis: ${status.positionMillis}` :
            `Error: ${status.error}`);

        if (!status.isLoaded) {
            setVideoError(status.error || "Video failed to load");
            setVideoLoaded(false);
            console.log('Video not loaded, error:', status.error);
            return;
        }

        // Update load state if needed
        if (!videoLoaded) {
            setVideoLoaded(true);
            setVideoError(null);
            console.log('Video loaded successfully');
        }

        // Update playing state based on actual status
        setVideoPlaying(status.isPlaying);

        // Handle video completion
        if (status.didJustFinish) {
            console.log('Video playback finished');
            setVideoPlaying(false);
            videoRef.current?.setPositionAsync(0);
        }
    };

    // Handle video loading errors
    const handleVideoError = (error: string) => {
        console.log('handleVideoError called with error:', error);
        setVideoError(`Error: ${error}`);

        // Try alternate URIs if initial load fails
        if (videoUri === mediaUrl ||
            videoUri === `file://${mediaUrl}` ||
            videoUri.includes(FileSystem.documentDirectory)) {
            console.log('Initial URI failed, trying alternates');
            tryAlternateUriFormats(mediaUrl || "");
        }
    };

    // Render method for different media types
    const renderMedia = () => {
        if (mediaType === 'image' && mediaUrl) {
            return (
                <Image
                    source={{ uri: mediaUrl }}
                    style={styles.mediaContent}
                    contentFit="cover"
                    transition={200}
                />
            );
        } else if (mediaType === 'gif' && mediaUrl) {
            // Use expo-image for GIFs
            return (
                <Image
                    source={{ uri: mediaUrl }}
                    style={styles.mediaContent}
                    contentFit="cover"
                    transition={200}
                    cachePolicy="memory-disk"
                />
            );
        } else if (mediaType === 'video') {
            return (
                <>
                    {/* Video component */}
                    <Video
                        ref={videoRef}
                        source={{ uri: videoUri }}
                        style={styles.mediaContent}
                        resizeMode={ResizeMode.COVER}
                        shouldPlay={false}
                        isLooping={false}
                        useNativeControls={false}
                        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                        onError={(error) => handleVideoError(error)}
                        onLoad={(status) => {
                            console.log('Video onLoad event:', status.isLoaded ? 'loaded' : 'failed');
                            if (status.isLoaded) {
                                setVideoLoaded(true);
                                setVideoError(null);
                            }
                        }}
                        posterSource={{ uri: mediaUrl }} // Use the same URL as poster image
                        usePoster={true}
                        posterStyle={styles.mediaPoster}
                    />

                    {/* Video error message overlay */}
                    {videoError && (
                        <View style={styles.errorOverlay}>
                            <Ionicons name="alert-circle" size={24} color="#FF5252" />
                            <Text style={styles.errorText}>
                                {videoError.includes('Error:') ? 'Failed to load video' : videoError}
                            </Text>
                            <TouchableOpacity
                                style={styles.retryButton}
                                onPress={() => resolveVideoUri(mediaUrl || "")}
                            >
                                <Ionicons name="refresh" size={16} color="white" />
                                <Text style={styles.retryText}>Retry</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </>
            );
        }

        return null;
    };

    return (
        <View style={styles.mediaResponseItem}>
            {/* Media content */}
            <View style={styles.mediaContainer}>
                {renderMedia()}
            </View>

            {/* Gradient overlay for better text visibility */}
            <View style={styles.gradientOverlay} />

            {/* Header overlay */}
            <View style={styles.overlayHeader}>
                {/* Profile Picture */}
                {item.profile_picture_url ? (
                    <Image
                        source={{ uri: item.profile_picture_url }}
                        style={styles.profilePic}
                        contentFit="cover"
                        transition={100}
                    />
                ) : (
                    <View style={styles.placeholderPic} />
                )}

                <View style={styles.headerInfo}>
                    <Text style={styles.overlayUsername}>{item.username || 'Unknown User'}</Text>
                    <Text style={styles.overlayTimestamp}>{getRelativeTime(item.timestamp)}</Text>
                </View>

                {/* Menu dots in top right corner */}
                <TouchableOpacity style={styles.menuDotsContainer}>
                    <Entypo name="dots-two-vertical" size={24} color="white" style={styles.menuDots} />
                </TouchableOpacity>
            </View>

            {/* Bottom bar with caption and reactions on the same line */}
            <View style={styles.bottomBar}>
                {/* Caption or response content summary if needed */}
                <Text style={styles.overlayCaption} numberOfLines={2} ellipsizeMode="tail">
                    {mediaType === 'gif' ? 'GIF Response' : (mediaType === 'video' ? 'Video Response' : 'Image Response')}
                </Text>

                {/* Reactions container on the right */}
                <View style={styles.reactionsGroup}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Feather name="send" size={18} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.reactionButton}>
                        <Entypo name="emoji-flirt" size={18} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.reactionButton}>
                        <Entypo name="emoji-happy" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Play/Pause button with Feather icons */}
            {mediaType === 'video' && (
                <TouchableOpacity
                    style={styles.debugButton}
                    onPress={toggleVideoPlayback}
                >
                    <FontAwesome
                        name={videoPlaying ? "pause" : "play"}
                        size={24}
                        color="white"
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    mediaResponseItem: {
        position: 'relative',
        marginBottom: 16,
        borderRadius: 24,
        overflow: 'hidden',
        height: 480,
    },
    mediaContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#111', // Dark background for loading state
    },
    mediaContent: {
        width: '100%',
        height: '100%',
        borderRadius: 24,
    },
    mediaPoster: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gradientOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 24,
    },
    overlayHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        zIndex: 20,
    },
    profilePic: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    placeholderPic: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#444',
    },
    headerInfo: {
        marginLeft: 10,
        flex: 1,
    },
    overlayUsername: {
        fontWeight: '600',
        fontSize: 16,
        color: '#fff',
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        fontFamily: fonts.extraBold, // Using Figtree Medium font
    },
    overlayTimestamp: {
        fontSize: 12,
        color: '#ddd',
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    // Bottom bar that combines caption and reactions
    bottomBar: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 20,
    },
    // Updated caption style
    overlayCaption: {
        fontSize: 16,
        color: '#fff',
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        flex: 1,
        marginRight: 10,
        fontFamily: fonts.regular, // Using Figtree Regular font
    },
    // Group for reaction buttons
    reactionsGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    // Standard action button (send icon)
    actionButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    // Dashed reaction buttons (emoji icons)
    reactionButton: {
        borderStyle: 'dashed',
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
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
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    errorOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 15,
        padding: 20,
    },
    errorText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#5A6CFF',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    retryText: {
        color: 'white',
        marginLeft: 5,
        fontWeight: '500',
    },
    // Updated debug button to be more circular and icon-focused
    debugButton: {
        position: 'absolute',
        bottom: 80,
        left: 20,
        padding: 12,
        borderRadius: 30,
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 30,
    },
});

export default MediaResponse;