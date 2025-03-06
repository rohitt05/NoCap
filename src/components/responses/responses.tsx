import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, ActivityIndicator } from 'react-native';
import ResponseItem from './components/ResponseItem';
import { fonts } from '../../utils/Fonts/fonts';
import { fetchResponses } from '../../api/fetchResponses';

const Responses: React.FC = () => {
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadResponses = async () => {
            const { data, error } = await fetchResponses();

            if (error) {
                console.error('Error fetching responses:', error);
            } else {
                setResponses(data || []);
            }
            setLoading(false);
        };

        loadResponses();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Your Friends' Responses</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
            ) : (
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    {responses.length > 0 ? (
                        responses.map((item) => <ResponseItem key={item.id} item={item} />)
                    ) : (
                        <Text style={styles.noResponsesText}>No responses yet</Text>
                    )}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    headerText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: fonts.semiBold,
        textAlign: 'center',
        marginVertical: 5,
    },
    scrollViewContent: {
        padding: 10,
    },
    noResponsesText: {
        color: '#888',
        fontSize: 16,
        fontFamily: fonts.italic,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default Responses;
