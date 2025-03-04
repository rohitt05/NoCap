import { View, Text, Image, StyleSheet, StatusBar, TouchableOpacity, Modal, ScrollView } from 'react-native';
import React, { useState } from 'react';
import userData from '../../../../assets/userProfile/userData.json';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { EditProfileModal } from './EditProfileModal'; // Import the modal component
import { Link } from 'expo-router';
import YourResponses from './YourResponses'; // Import the YourResponses component

const Profile = () => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleEditPress = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Navbar */}
            <View style={styles.navbar}>
                <TouchableOpacity style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                <Text style={styles.navbarTitle}>{userData.username}</Text>
                <Link href="Screens/SettingsScreen/SettingsScreen" style={{ zIndex: 10 }}>
                    <TouchableOpacity style={styles.menuButton}>
                        <View style={styles.menuButtonContainer}>
                            <Ionicons name="ellipsis-vertical" size={24} color="white" />
                        </View>
                    </TouchableOpacity>
                </Link>
            </View>

            {/* ScrollView for main content */}
            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Image Container */}
                <View style={styles.profileImageContainer}>
                    <Image
                        source={{ uri: userData.profilePicture }}
                        style={styles.profileImage}
                        resizeMode="cover"
                    />

                    {/* Username container with gradient overlay at the bottom */}
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.9)']}
                        style={styles.usernameContainer}>
                        <View style={styles.userInfoContainer}>
                            <View style={styles.userTextContainer}>
                                <Text style={styles.username}>{userData.name}</Text>
                                <Text style={styles.userBio}>{userData.bio}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={handleEditPress}
                            >
                                <View style={styles.editButtonContainer}>
                                    <Feather name="edit-3" size={24} color="white" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </View>

                {/* Your Responses Component */}
                <YourResponses />
            </ScrollView>

            {/* Edit Profile Modal */}
            <EditProfileModal
                visible={modalVisible}
                onClose={handleCloseModal}
                userData={userData}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollContainer: {
        flex: 1,
        marginTop: 60, // Added to account for the fixed navbar
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        paddingHorizontal: 15,
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    backButton: {
        padding: 8,
    },
    navbarTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    menuButton: {
        padding: 8,
    },
    menuButtonContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 25,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImageContainer: {
        position: 'relative',
        height: 450,
        width: '100%',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 25
    },
    usernameContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 20,
        paddingHorizontal: 15,
        justifyContent: 'flex-end',
        height: 120, // This controls how high the gradient extends
    },
    userInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userTextContainer: {
        width: '80%', // As requested, give 80% width to text content
    },
    username: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    userBio: {
        color: 'white',
        fontSize: 14,
        fontWeight: '400',
    },
    editButton: {
        width: '20%', // As requested, give 20% width to the edit button area
        alignItems: 'center',
    },
    editButtonContainer: {
        borderRadius: 25,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        left: 10,
    },
});

export default Profile;