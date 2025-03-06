import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ResponseItemProps } from '../types';
import { Entypo, Feather } from '@expo/vector-icons';
import { fonts } from '../../../utils/Fonts/fonts';

// Add this function to format relative time
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

const TextResponse: React.FC<ResponseItemProps> = ({ item }) => {
    return (
        <View style={styles.responseItem}>
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    {/* Profile Picture */}
                    {item.profile_picture_url ? (
                        <Image source={{ uri: item.profile_picture_url }} style={styles.profilePic} />
                    ) : (
                        <View style={styles.placeholderPic} />
                    )}

                    {/* Username & Timestamp */}
                    <View style={styles.headerInfo}>
                        <Text style={styles.username}>{item.username || 'Unknown User'}</Text>
                        <Text style={styles.timestamp}>
                            {getRelativeTime(item.timestamp)}
                        </Text>
                    </View>
                </View>

                {/* Rest of your component remains the same */}
                <TouchableOpacity style={styles.menuDotsContainer}>
                    <Entypo name="dots-two-vertical" size={16} color="#fff" style={styles.menuDots} />
                </TouchableOpacity>

                <View style={styles.textContentContainer}>
                    <Text style={styles.quoteSymbol}>"</Text>
                    <Text style={styles.textContent}>{item.response_content || 'No response'}</Text>
                </View>

                <View style={styles.reactionsContainer}>
                    <Feather name="send" size={18} color="#fff" style={{ top: 8, right: 5 }} />
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
    placeholderPic: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#444',
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
        fontFamily: fonts.semiBold,
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
        borderStyle: 'dashed',
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
