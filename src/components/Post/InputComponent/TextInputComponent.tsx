import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

const TextInputComponent = ({ inputText, setInputText }) => {
    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.textInput}
                placeholder="Add your respone and post it"
                placeholderTextColor="#666"
                multiline={true}
                value={inputText}
                onChangeText={setInputText}
                numberOfLines={5}
                textAlignVertical="top"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        width: '100%',
        height: 120, // Enough height for 4-5 lines
        justifyContent: 'center', // Vertical centering of the input field
        alignItems: 'center', // Horizontal centering of the input field
    },
    textInput: {
        color: 'white',
        fontSize: 14,
        padding: 12,
        width: '100%',
        height: 110, // Fixed height for 4-5 lines
        textAlignVertical: 'top', // Text aligned to top
        backgroundColor: '#1A1A1A',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#333',
        textAlign: 'left', // Text aligned to left
    },
});

export default TextInputComponent;