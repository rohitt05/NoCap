import React, { useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableWithoutFeedback,
    PanResponder,
    Animated
} from 'react-native';

const SentModal = ({ visible, onClose }) => {
    const panY = useRef(new Animated.Value(0)).current;

    const resetPositionAnim = Animated.timing(panY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
    });

    const closeAnim = Animated.timing(panY, {
        toValue: 600,
        duration: 500,
        useNativeDriver: true,
    });

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // Only respond to vertical pan gestures
                return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
            },
            onPanResponderMove: (_, gestureState) => {
                // Only allow downward drag
                if (gestureState.dy > 0) {
                    panY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                // If dragged down more than 100 units, close the modal
                if (gestureState.dy > 100) {
                    closeModal();
                } else {
                    resetPositionAnim.start();
                }
            },
        })
    ).current;

    const closeModal = () => {
        closeAnim.start(() => {
            onClose();
            panY.setValue(0);
        });
    };

    const headerDraggableArea = {
        ...panResponder.panHandlers
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={closeModal}>
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={[
                                styles.bottomSheet,
                                { transform: [{ translateY: panY }] }
                            ]}
                        >
                            <View style={styles.handle} />

                            <View
                                style={styles.header}
                                {...headerDraggableArea}
                            >
                                <Text style={styles.headerText}>Sent Requests</Text>
                            </View>

                            <View style={styles.content}>
                                <Text style={styles.contentText}>Your sent requests will appear here</Text>
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    bottomSheet: {
        backgroundColor: '#121212',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 30,
        height: '80%',
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: '#666',
        borderRadius: 3,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15, // Increased for better touch target
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    headerText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },
    content: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentText: {
        color: '#888',
        fontSize: 16,
    },
});

export default SentModal;