// ./NotificationList.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NotificationList = () => {
    return (
        <View style={styles.container}>
            {/* Reaction notifications */}
            <View style={styles.notificationItem}>
                <Image
                    source={{ uri: 'https://randomuser.me/api/portraits/women/1.jpg' }}
                    style={styles.avatar}
                />
                <View style={styles.contentContainer}>
                    <View style={styles.nameTimeContainer}>
                        <Text style={styles.username}>Sarah Johnson</Text>
                        <Text style={styles.timestamp}>2h ago</Text>
                    </View>
                    <Text style={styles.notificationText}>
                        reacted with <Text style={styles.emoji}>😚</Text> to your response
                    </Text>
                </View>
            </View>

            <View style={styles.notificationItem}>
                <Image
                    source={{ uri: 'https://randomuser.me/api/portraits/women/2.jpg' }}
                    style={styles.avatar}
                />
                <View style={styles.contentContainer}>
                    <View style={styles.nameTimeContainer}>
                        <Text style={styles.username}>Mike Williams</Text>
                        <Text style={styles.timestamp}>5h ago</Text>
                    </View>
                    <Text style={styles.notificationText}>
                        reacted with <Text style={styles.emoji}>🔥</Text> to your post
                    </Text>
                </View>
            </View>

            {/* Friend request notifications */}
            <View style={styles.notificationItem}>
                <Image
                    source={{ uri: 'https://randomuser.me/api/portraits/women/3.jpg' }}
                    style={styles.avatar}
                />
                <View style={styles.contentContainer}>
                    <View style={styles.nameTimeContainer}>
                        <Text style={styles.username}>Alex Taylor</Text>
                        <Text style={styles.timestamp}>1d ago</Text>
                    </View>
                    <Text style={styles.notificationText}>
                        sent you a friend request
                    </Text>
                </View>
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.acceptButton}>
                        <Text style={styles.acceptButtonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.declineButton}>
                        <Text style={styles.declineButtonText}>Decline</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.notificationItem}>
                <Image
                    source={{ uri: 'https://randomuser.me/api/portraits/women/4.jpg' }}
                    style={styles.avatar}
                />
                <View style={styles.contentContainer}>
                    <View style={styles.nameTimeContainer}>
                        <Text style={styles.username}>Jordan Lee</Text>
                        <Text style={styles.timestamp}>2d ago</Text>
                    </View>
                    <Text style={styles.notificationText}>
                        sent you a friend request
                    </Text>
                </View>
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.acceptButton}>
                        <Text style={styles.acceptButtonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.declineButton}>
                        <Text style={styles.declineButtonText}>Decline</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Activity notification */}
            <View style={styles.notificationItem}>
                <Image
                    source={{ uri: 'https://randomuser.me/api/portraits/women/5.jpg' }}
                    style={styles.avatar}
                />
                <View style={styles.contentContainer}>
                    <View style={styles.nameTimeContainer}>
                        <Text style={styles.username}>Taylor Reed</Text>
                        <Text style={styles.timestamp}>3d ago</Text>
                    </View>
                    <Text style={styles.notificationText}>
                        mentioned you in a comment
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    notificationItem: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: '#333',
        alignItems: 'center',
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        marginRight: 10,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    nameTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
    },
    username: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        marginRight: 6,
    },
    timestamp: {
        color: '#777',
        fontSize: 12,
    },
    notificationText: {
        color: '#ddd',
        fontSize: 14,
    },
    emoji: {
        fontSize: 16,
    },
    actionButtons: {
        flexDirection: 'row',
        marginLeft: 10,
    },
    acceptButton: {
        backgroundColor: '#444',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 25,
        marginRight: 10,
    },
    acceptButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 12,
    },
    declineButton: {
        backgroundColor: 'transparent',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#444',
    },
    declineButtonText: {
        color: 'red',
        fontWeight: '600',
        fontSize: 12,
    },
});

export default NotificationList;