import { View, Text, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons, MaterialIcons, Feather, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import userData from '../../../../assets/userProfile/userData.json';
import { Link, router } from 'expo-router';
import { handleShareNoCap } from '../../../utils/ShareUtils';
import timeZoneState from '../../../utils/TimeUntils'; // Adjust path as needed
import { useAuth } from '@clerk/clerk-expo';

const SettingsScreen = () => {
    const { signOut } = useAuth();
    // Use the shared state
    const [currentTimeZone] = timeZoneState.useTimeZone();

    // Handle logout with navigation
    const handleLogout = async () => {
        try {
            await signOut();
            // Navigate to login screen or initial screen
            router.replace('/');  // Adjust this path to your auth/login screen
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>

            <ScrollView style={styles.scrollView}>
                {/* Profile Section */}
                <TouchableOpacity style={styles.profileCard}>
                    <View style={styles.profileIconContainer}>
                        <Text style={styles.profileIconText}>
                            {userData.name ? userData.name.charAt(0).toUpperCase() : 'M'}
                        </Text>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{userData.name || 'Rohit'}</Text>
                        <Text style={styles.profileUsername}>{userData.username || 'mainninjahathori'}</Text>
                    </View>
                </TouchableOpacity>

                {/* Features Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>FEATURES</Text>

                    <View style={styles.menuContainer}>
                        <Link href='(tabs)/archives' asChild>
                            <TouchableOpacity style={styles.menuItem}>
                                <MaterialIcons name="event" size={24} color="white" style={styles.menuIcon} />
                                <Text style={styles.menuText}>Memories</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>

                {/* Settings Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>SETTINGS</Text>

                    <View style={styles.menuContainer}>
                        <Link href='/Screens/SettingsScreen/Notifications' asChild>
                            <TouchableOpacity style={styles.menuItem}>
                                <Ionicons name="notifications" size={24} color="white" style={styles.menuIcon} />
                                <Text style={styles.menuText}>Notifications</Text>
                            </TouchableOpacity>
                        </Link>
                        <Link href='/Screens/SettingsScreen/Privacy' asChild>
                            <TouchableOpacity style={styles.menuItem}>
                                <MaterialIcons name="privacy-tip" size={24} color="white" style={styles.menuIcon} />
                                <Text style={styles.menuText}>Privacy</Text>
                            </TouchableOpacity>
                        </Link>
                        <Link href='/Screens/SettingsScreen/TimeZone' asChild>
                            <TouchableOpacity style={styles.menuItem}>
                                <Ionicons name="time" size={24} color="white" style={styles.menuIcon} />
                                <Text style={styles.menuText}>Time Zone</Text>
                                <View style={styles.rightContainer}>
                                    <Text style={styles.rightText}>{currentTimeZone}</Text>
                                    <Feather name="globe" size={24} color="white" style={styles.rightIcon} />
                                </View>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>

                {/* Rest of the component remains unchanged */}
                {/* About Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ABOUT</Text>

                    <View style={styles.menuContainer}>
                        {/* Using imported share function */}
                        <TouchableOpacity style={styles.menuItem} onPress={handleShareNoCap}>
                            <Feather name="share-2" size={24} color="white" style={styles.menuIcon} />
                            <Text style={styles.menuText}>Share NoCap.</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem}>
                            <FontAwesome name="star" size={24} color="white" style={styles.menuIcon} />
                            <Text style={styles.menuText}>Rate NoCap.</Text>
                        </TouchableOpacity>
                        <Link href='/Screens/SettingsScreen/Help' asChild>
                            <TouchableOpacity style={styles.menuItem}>
                                <MaterialCommunityIcons name="help-circle" size={24} color="white" style={styles.menuIcon} />
                                <Text style={styles.menuText}>Help</Text>
                            </TouchableOpacity>
                        </Link>
                        <Link href='/Screens/SettingsScreen/About' asChild>
                            <TouchableOpacity style={styles.menuItem}>
                                <Ionicons name="information-circle" size={24} color="white" style={styles.menuIcon} />
                                <Text style={styles.menuText}>About</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Log out</Text>
                </TouchableOpacity>

                {/* Version */}
                <Text style={styles.versionText}>Version 0.0.1 (000)</Text>

                {/* Bottom Spacer */}
                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
    );
};

// Styles remain unchanged
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#121212',
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 15,
        borderRadius: 12,
    },
    profileIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#B8860B', // Dark goldenrod color as in image
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    profileIconText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    profileUsername: {
        color: 'white',
        fontSize: 14,
        opacity: 0.8,
    },
    section: {
        marginTop: 25,
    },
    sectionTitle: {
        color: 'white',
        fontSize: 14,
        marginLeft: 25,
        marginBottom: 10,
        opacity: 0.8,
    },
    menuContainer: {
        backgroundColor: '#121212',
        marginHorizontal: 20,
        borderRadius: 12,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    menuIcon: {
        marginRight: 15,
    },
    menuText: {
        color: 'white',
        fontSize: 16,
        flex: 1,
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightText: {
        color: '#888',
        marginRight: 10,
    },
    rightIcon: {
        marginLeft: 5,
    },
    logoutButton: {
        backgroundColor: '#121212',
        marginHorizontal: 20,
        marginTop: 25,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    logoutText: {
        color: '#FF3B30', // Red color for logout
        fontSize: 16,
        fontWeight: '500',
    },
    versionText: {
        color: '#666',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 15,
    },
    bottomSpacer: {
        height: 50,
    },
});

export default SettingsScreen;