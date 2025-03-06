import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchPrompt } from '../../../api/fetchPrompt'; // Adjust path if needed
import { fonts } from '../../../utils/Fonts/fonts';

const PromptCard = () => {
    const [prompt, setPrompt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getPrompt = async () => {
            const { data, error } = await fetchPrompt();
            if (error) {
                setError(error);
            } else {
                setPrompt(data);
            }
            setLoading(false);
        };

        getPrompt();
    }, []);

    // Format the date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#fff" />;
    }

    if (error) {
        return <Text style={styles.errorText}>Error loading prompt: {error}</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.promptTextContainer}>
                <Text style={styles.promptLabel}>Today's Prompt *</Text>
                <Text style={styles.promptText}>{prompt?.text}</Text>
            </View>

            <View style={styles.dateTimeContainer}>
                <Text style={styles.promptDateTime}>
                    {formatDate(new Date())} • {prompt?.time}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        bottom: 10,
        paddingHorizontal: 16,
        width: '100%',
    },
    promptTextContainer: {
        marginBottom: 10,
    },
    promptLabel: {
        fontSize: 14,
        color: '#888888',
        marginBottom: 8,
        textAlign: 'left',
        fontFamily: fonts.italic,
    },
    promptText: {
        fontSize: 28,
        fontFamily: fonts.bold,
        color: '#fff',
        textAlign: 'center',
        lineHeight: 36,
    },
    dateTimeContainer: {
        width: '100%',
        alignItems: 'center',
    },
    promptDateTime: {
        color: '#777777',
        fontSize: 14,
        fontFamily: fonts.semiBold,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default PromptCard;
