// components/responses/Responses.tsx
import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import ResponseItem from './components/ResponseItem';
import { ResponseItemData, ResponsesData } from './types';
import { fonts } from '../../utils/Fonts/fonts';

// Accept data as a prop instead of importing directly
const Responses: React.FC<{ responsesData: ResponsesData }> = ({ responsesData }) => {
    const { responses_received } = responsesData;

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Your Friends' Responses</Text>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {responses_received.map((item: ResponseItemData) => (
                    <ResponseItem key={item.id} item={item} />
                ))}
            </ScrollView>
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
});

export default Responses;