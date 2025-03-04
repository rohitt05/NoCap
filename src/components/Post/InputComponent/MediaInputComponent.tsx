import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Dimensions } from 'react-native';
import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';

export default function App() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [flash, setFlash] = useState<string>('off');
    const cameraRef = useRef<CameraView>(null);
    const [permission, requestPermission] = useCameraPermissions();

    // New state for video mode and recording
    const [isVideoMode, setIsVideoMode] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const [mediaPreview, setMediaPreview] = useState<null | {
        uri: string;
        type: 'image' | 'video';
    }>(null);

    // Timer effect for recording duration
    useEffect(() => {
        if (isRecording) {
            setRecordingDuration(0);
            recordingIntervalRef.current = setInterval(() => {
                setRecordingDuration(prev => prev + 1);
            }, 1000);

            return () => {
                if (recordingIntervalRef.current) {
                    clearInterval(recordingIntervalRef.current);
                }
            };
        } else {
            if (recordingIntervalRef.current) {
                clearInterval(recordingIntervalRef.current);
            }
            setRecordingDuration(0);
        }
    }, [isRecording]);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
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

    // Toggle between photo and video mode
    function toggleVideoMode() {
        setIsVideoMode(!isVideoMode);
    }

    function discardPreview() {
        setMediaPreview(null);
        setIsRecording(false);
    }

    // Format duration to MM:SS
    function formatDuration(seconds: number) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    async function takePictureOrStartRecording() {
        if (isVideoMode) {
            // Video recording logic
            if (cameraRef.current) {
                if (!isRecording) {
                    try {
                        setIsRecording(true);
                        const video = await cameraRef.current.recordAsync();
                        setMediaPreview({
                            uri: video.uri,
                            type: 'video'
                        });
                        setIsRecording(false);
                    } catch (error) {
                        console.error('Recording failed', error);
                        setIsRecording(false);
                    }
                } else {
                    if (cameraRef.current) {
                        cameraRef.current.stopRecording();
                        setIsRecording(false);
                    }
                }
            }
        } else {
            // Existing photo capture logic
            if (cameraRef.current) {
                const photo = await cameraRef.current.takePictureAsync();
                if (photo) {
                    setMediaPreview({
                        uri: photo.uri,
                        type: 'image'
                    });
                } else {
                    console.error('Failed to capture photo');
                }
            }
        }
    }

    async function openPhotoLibrary() {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert('Sorry, we need media library permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            const isVideo = asset.uri.endsWith('.mp4') ||
                asset.uri.endsWith('.mov') ||
                asset.uri.endsWith('.avi') ||
                (asset.type && asset.type.startsWith('video'));

            setMediaPreview({
                uri: asset.uri,
                type: isVideo ? 'video' : 'image'
            });
        }
    }

    if (mediaPreview) {
        return (
            <View style={styles.container}>
                <View style={styles.previewContainer}>
                    {mediaPreview.type === 'image' ? (
                        <Image
                            source={{ uri: mediaPreview.uri }}
                            style={styles.mediaPreview}
                            resizeMode="cover"
                        />
                    ) : (
                        <Video
                            source={{ uri: mediaPreview.uri }}
                            style={styles.mediaPreview}
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
                mode={isVideoMode ? "video" : "picture"}
            >
                {/* Mode Indicator now in top left */}
                {isVideoMode && (
                    <View style={styles.topLeftContainer}>
                        <Text style={[styles.text, styles.videoModeText]}>
                            Video Mode
                        </Text>
                    </View>
                )}

                {/* Recording Duration now horizontally centered */}
                {isVideoMode && isRecording && (
                    <View style={styles.horizontalCenterContainer}>
                        <Text style={[styles.text, styles.recordingDurationText]}>
                            {formatDuration(recordingDuration)}
                        </Text>
                    </View>
                )}

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
                    <TouchableOpacity style={styles.controlButton} onPress={toggleVideoMode}>
                        <MaterialIcons
                            name={isVideoMode ? "videocam-off" : "videocam"}
                            size={24}
                            color="white"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.captureContainer}>
                    <TouchableOpacity
                        style={[
                            styles.captureButton,
                            isRecording && styles.recordingButton
                        ]}
                        onPress={takePictureOrStartRecording}
                    >
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
    topLeftContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
    horizontalCenterContainer: {
        position: 'absolute',
        top: 10,
        left: 0,
        right: 0,
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
    },
    videoModeText: {
        fontSize: 12,
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 25,
    },
    recordingDurationText: {
        fontSize: 12,
        color: 'white',
    },
    recordingButton: {
        borderWidth: 3,
        borderColor: 'red',
    }
});