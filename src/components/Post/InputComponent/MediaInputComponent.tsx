import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import CameraScreen from '../../CameraScreen'; // Adjust import path as needed

export default function App() {
    const [mediaPreview, setMediaPreview] = useState<null | {
        uri: string;
        type: 'image' | 'video';
        isFrontFacing: boolean;
    }>(null);

    async function saveMediaToGallery() {
        if (!mediaPreview) return;

        try {
            // Ensure we have media library permissions
            const { status } = await MediaLibrary.requestPermissionsAsync();

            if (status !== 'granted') {
                alert('Sorry, we need media library permissions to save the file.');
                return;
            }

            // Save the file to an album named "Nocap"
            const asset = await MediaLibrary.createAssetAsync(mediaPreview.uri);
            await MediaLibrary.createAlbumAsync("Nocap", asset, false);

            alert('Media saved successfully to Nocap album!');
        } catch (error) {
            console.error('Error saving media:', error);
            alert('Failed to save media.');
        }
    }

    function discardPreview() {
        setMediaPreview(null);
    }

    // If media is captured, show preview
    if (mediaPreview) {
        return (
            <View style={styles.container}>
                <View style={styles.previewContainer}>
                    {mediaPreview.type === 'image' ? (
                        <Image
                            source={{ uri: mediaPreview.uri }}
                            style={[
                                styles.mediaPreview,
                                mediaPreview.isFrontFacing && styles.mirroredMedia
                            ]}
                            resizeMode="cover"
                        />
                    ) : (
                        <Video
                            source={{ uri: mediaPreview.uri }}
                            style={[
                                styles.mediaPreview,
                                mediaPreview.isFrontFacing && styles.mirroredMedia
                            ]}
                            useNativeControls
                            resizeMode={ResizeMode.COVER}
                            isLooping
                            shouldPlay
                        />
                    )}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={discardPreview}
                    >
                        <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={saveMediaToGallery}
                    >
                        <MaterialIcons name="save-alt" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Default view is the camera
    return (
        <View style={styles.container}>
            <CameraScreen
                onMediaCapture={(mediaInfo) => {
                    setMediaPreview(mediaInfo);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    previewContainer: {
        flex: 1,
        position: 'relative',
        backgroundColor: 'black',
        borderRadius: 25,
        overflow: 'hidden',
    },
    mediaPreview: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    mirroredMedia: {
        transform: [{ scaleX: -1 }]
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    saveButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
});