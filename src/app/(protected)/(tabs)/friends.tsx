import React from 'react';
import { View, Text, ScrollView, TextInput, Image, TouchableOpacity, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

export default function Friends() {
    // Sample friends data - replace with your actual data
    const friends = [
        { id: '1', username: 'sarah_jones', profileImage: 'https://randomuser.me/api/portraits/women/1.jpg' },
        { id: '2', username: 'mike_smith', profileImage: 'https://randomuser.me/api/portraits/men/1.jpg' },
    ];

    // Render each friend item
    const renderFriend = ({ item }) => (
        <View style={styles.friendItem}>
            <View style={styles.friendInfo}>
                <Image
                    source={{ uri: item.profileImage }}
                    style={styles.friendImage}
                    defaultSource={require('../../../../assets/hattori.webp')}
                />
                <Text style={styles.friendUsername}>{item.username}</Text>
            </View>
            <TouchableOpacity style={styles.closeButton}>
                <Feather name="x" size={18} color="#666" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Navigation Bar */}
            <View style={styles.navbar}>
                <View style={styles.navbarLeft}>
                    {/* Empty view for layout balance */}
                    <View style={{ width: 30 }} />
                </View>
                <View style={styles.navbarCenter}>
                    <Text style={styles.navbarTitle}>Friends</Text>
                </View>
                <View style={styles.navbarRight}>
                    {/* Updated Link component with proper path */}
                    <Link href="/Screens/Notifications/notificationsNewFriends" asChild>
                        <TouchableOpacity style={styles.notificationButton}>
                            <Ionicons name="notifications-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>

            {/* Main Content in ScrollView */}
            <ScrollView style={styles.scrollView}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search friends"
                        placeholderTextColor="#666"
                    />
                </View>

                {/* Invite Bar */}
                <View style={styles.inviteBar}>
                    <View style={styles.inviteLeft}>
                        <Image
                            source={require('../../../../assets/hattori.webp')}
                            style={styles.userImage}
                        />
                        <View style={styles.inviteTextContainer}>
                            <Text style={styles.inviteText}>Invite your closest one's on NoCap</Text>
                            <Text style={styles.inviteLinkText}>Invite now</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.inviteButton}>
                        <Feather name="user-plus" size={24} color="#ffffff" />
                    </TouchableOpacity>
                </View>

                {/* Friends List Header */}
                <Text style={styles.friendsHeader}>My Friends (2)</Text>

                {/* Friends List */}
                <FlatList
                    data={friends}
                    renderItem={renderFriend}
                    keyExtractor={item => item.id}
                    scrollEnabled={false} // Disable scrolling since it's inside ScrollView
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    navbar: {
        height: 50,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    navbarLeft: {
        width: 30,
    },
    navbarCenter: {
        flex: 1,
        alignItems: 'center',
    },
    navbarRight: {
        width: 30,
        alignItems: 'center',
    },
    navbarTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    notificationButton: {
        padding: 3,
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#222',
        borderRadius: 18,
        paddingHorizontal: 12,
        marginBottom: 16,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 50,
        color: '#fff',
    },
    inviteBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#222',
        borderRadius: 18,
        padding: 10,
        marginBottom: 24,
    },
    inviteLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    inviteTextContainer: {
        flexDirection: 'column',
    },
    inviteText: {
        color: '#fff',
        fontWeight: '500',
    },
    inviteLinkText: {
        color: '#3897f0', // Instagram-like blue
        marginTop: 4,
    },
    inviteButton: {
        borderRadius: 8,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    friendsHeader: {
        color: '#e0e0e0',
        fontSize: 18,
        marginBottom: 16,
    },
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Added to position the close button
        paddingVertical: 12,
        borderBottomWidth: 0.3,
        borderBottomColor: '#333',
    },
    friendInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    friendImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    friendUsername: {
        color: '#fff',
        fontSize: 16,
    },
    closeButton: {
        padding: 5,
    },
});