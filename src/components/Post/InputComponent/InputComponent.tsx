import React from 'react';
import { View, StyleSheet } from 'react-native';
import TextInputComponent from './TextInputComponent';
import GifInputComponent from './GifInputComponent';
import VoiceInputComponent from './VoiceInputComponent';
import MediaInputComponent from './MediaInputComponent';

const InputComponent = ({ activeTab = 'TEXT', inputText, setInputText }) => {
    // Render input based on active tab
    const renderInput = () => {
        switch (activeTab) {
            case 'TEXT':
                return <TextInputComponent inputText={inputText} setInputText={setInputText} />;
            case 'GIF':
                return <GifInputComponent onGifSelect={undefined} />;
            case 'VOICE':
                return <VoiceInputComponent />;
            case 'MEDIA':
                return <MediaInputComponent />;
            default:
                return <TextInputComponent inputText={inputText} setInputText={setInputText} />;
        }
    };

    return (
        <View style={styles.responseArea}>
            {renderInput()}
        </View>
    );
};

const styles = StyleSheet.create({
    responseArea: {
        height: 200,
        flex: 1,
        marginBottom: 10,
        overflow: 'hidden',
    },
});

export default InputComponent;