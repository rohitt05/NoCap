import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Dimensions } from 'react-native';
import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';

export default function App() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [flash, setFlash] = useState<string>('off');
    const cameraRef = useRef(null);
    const [permission, requestPermission] = useCameraPermissions();

    // New state variables for media preview
    const [mediaPreview, setMediaPreview] = useState<null | {
        uri: string;
        type: 'image' | 'video';
    }>(null);

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    function toggleFlash() {
        setFlash(current => (current === 'off' ? 'on' : 'off'));
    }

    // Function to discard the preview
    function discardPreview() {
        setMediaPreview(null);
    }

    async function takePicture() {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            console.log(photo);
            // Set the captured photo for preview
            setMediaPreview({
                uri: photo.uri,
                type: 'image'
            });
        }
    }

    async function openPhotoLibrary() {
        // Request permission to access the photo library
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert('Sorry, we need media library permissions to make this work!');
            return;
        }

        // Launch the image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All, // Allow both photos and videos
            allowsEditing: true,
            // aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            console.log(asset);

            // Determine if it's an image or video based on file extension
            const isVideo = asset.uri.endsWith('.mp4') ||
                asset.uri.endsWith('.mov') ||
                asset.uri.endsWith('.avi') ||
                (asset.type && asset.type.startsWith('video'));

            // Set the selected media for preview
            setMediaPreview({
                uri: asset.uri,
                type: isVideo ? 'video' : 'image'
            });
        }
    }

    // If we have a media preview, show that instead of the camera
    if (mediaPreview) {
        return (
            <View style={styles.container}>
                <View style={styles.previewContainer}>
                    {mediaPreview.type === 'image' ? (
                        <Image
                            source={{ uri: mediaPreview.uri }}
                            style={styles.mediaPreview}
                            // In your Image component
                            // For both Image and Video components
                            resizeMode="cover" // Instead of "cover"
                        />
                    ) : (
                        <Video
                            source={{ uri: mediaPreview.uri }}
                            style={styles.mediaPreview}
                            useNativeControls
                            // For both Image and Video components
                            resizeMode="cover"
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
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={facing}
                flash={flash}
                shutterSound={false}
                ref={cameraRef}
            >
                <View style={styles.controlsContainer}>
                    <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
                        <Ionicons
                            name={flash === 'off' ? "flash-off" : "flash"}
                            size={24}
                            color="white"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
                        <Ionicons
                            name="camera-reverse"
                            size={24}
                            color="white"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.captureContainer}>
                    <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                        <View style={styles.captureInner}></View>
                    </TouchableOpacity>
                </View>

                <View style={styles.galleryContainer}>
                    <TouchableOpacity style={styles.controlButton} onPress={openPhotoLibrary}>
                        <Entypo
                            name="folder-images"
                            size={20}
                            color="white"
                        />
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingVertical: 20,
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
        borderRadius: 25,
        overflow: 'hidden',
    },
    controlsContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        flexDirection: 'column',
        alignItems: 'center',
    },
    galleryContainer: {
        position: 'absolute',
        bottom: 1,
        left: 10,
    },
    controlButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 50,
        padding: 12,
        marginVertical: 10,
    },
    captureContainer: {
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    // New styles for media preview
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
    }
});