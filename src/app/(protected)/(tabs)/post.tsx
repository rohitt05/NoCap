import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import promptsData from '../../../../assets/prompt/prompt.json';
import Timer from '../../../components/Post/Timer';
import PromptCard from '../../../components/Post/PromptCard';
import TabsComponent from '../../../components/Post/TabsComponent';
import InputComponent from '../../../components/Post/InputComponent';

const Post = () => {
    // Get the first prompt from the imported data
    const prompt = promptsData;

    // State to track active tab
    const [activeTab, setActiveTab] = useState('TEXT');

    // State for input text
    const [inputText, setInputText] = useState('');

    return (
        <View style={styles.container}>
            {/* Navbar */}
            <View style={styles.navbar}>
                {/* Left space for balance */}
                <View style={styles.navSide} />

                {/* NoCap Text - replacing the logo */}
                <Text style={styles.logoText}>NoCap</Text>

                {/* Post button - right aligned */}
                <View style={styles.navSide}>
                    <TouchableOpacity style={styles.postButton} onPress={() => console.log('Post button pressed')}>
                        <Text style={styles.postButtonText}>Post</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Post Content */}
            <View style={styles.content}>
                {/* Timer Component */}
                <Timer promptDate={prompt.date} promptTime={prompt.time} />

                {/* Prompt Card Component */}
                <PromptCard
                    promptText={prompt.text}
                    promptDate={prompt.date}
                    promptTime={prompt.time}
                />

                {/* Input Component */}
                <InputComponent
                    activeTab={activeTab}
                    inputText={inputText}
                    setInputText={setInputText}
                />

                {/* Tabs Component */}
                <TabsComponent
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    navbar: {
        height: 50,
        backgroundColor: 'black',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingHorizontal: 15,
    },
    navSide: {
        width: 60,
        alignItems: 'flex-end',
    },
    logoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 0.5,
    },
    postButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 25,
        backgroundColor: '#333',
    },
    postButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 16,
    },
});

export default Post;