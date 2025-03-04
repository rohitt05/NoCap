import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ResponseItemProps } from '../types';
import { Entypo, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts } from '../../../utils/Fonts/fonts'; // Update with the correct path

const TextResponse: React.FC<ResponseItemProps> = ({ item }) => {
    return (
        <View style={styles.responseItem}>
            {/* <LinearGradient
                colors={['#000', '#000033', '#000066']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.backgroundGradient}
            /> */}

            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <Image
                        source={{ uri: item.profile_picture_url }}
                        style={styles.profilePic}
                    />
                    <View style={styles.headerInfo}>
                        <Text style={styles.username}>{item.user}</Text>
                        <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
                    </View>
                </View>

                {/* Menu dots in top right corner */}
                <TouchableOpacity style={styles.menuDotsContainer}>
                    <Entypo name="dots-two-vertical" size={16} color="#fff" style={styles.menuDots} />
                </TouchableOpacity>

                {/* Text content with quote */}
                <View style={styles.textContentContainer}>
                    <Text style={styles.quoteSymbol}>"</Text>
                    <Text style={styles.textContent}>{item.text}</Text>
                </View>

                {/* BeReal-style emoji reactions container */}
                <View style={styles.reactionsContainer}>
                    {/* Feather icon */}
                    <Feather name="send" size={18} color="#fff" style={{
                        top: 8,
                        right: 5,
                    }} />
                    {/* Emoji icons */}
                    <TouchableOpacity style={styles.reactionButton}>
                        <Entypo name="emoji-flirt" size={18} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.reactionButton}>
                        <Entypo name="emoji-happy" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    responseItem: {
        borderWidth: 0.3,
        borderColor: '#333',
        borderRadius: 25,
        marginBottom: 16,
        height: 200,
        overflow: 'hidden',
        position: 'relative',
    },
    backgroundGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    contentContainer: {
        padding: 12,
        flex: 1,
        position: 'relative',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    profilePic: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    headerInfo: {
        marginLeft: 10,
    },
    username: {
        fontFamily: fonts.extraBold,
        fontWeight: '600',
        fontSize: 16,
        color: '#fff',
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
    },
    textContentContainer: {
        flexDirection: 'row',
        marginTop: 30,
        paddingHorizontal: 10,
    },
    quoteSymbol: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#e0e0e0',
        marginTop: -12,
        marginRight: 4,
    },
    textContent: {
        fontSize: 18,
        lineHeight: 22,
        color: '#e0e0e0',
        flex: 1,
        fontFamily: fonts.semiBold, // Using Figtree Regular font
    },
    reactionsContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 10,
        right: 12,
        zIndex: 10,
    },
    reactionButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        marginLeft: 6,
        borderStyle: "dashed",
        justifyContent: 'center',
        alignItems: 'center',
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
        alignSelf: 'center',
    },
});

export default TextResponse;