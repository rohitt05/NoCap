import React from 'react';
import { View, Text, StyleSheet, Dimensions, ImageBackground } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = width - 40; // Card width with margins
const cardHeight = cardWidth * (5 / 4); // 4:5 aspect ratio

const MemoryCard = ({ memory }) => {
    return (
        <View style={styles.memoryCardContainer}>
            <ImageBackground
                source={{ uri: memory.imageUrl }}
                style={[styles.memoryCard, { height: cardHeight }]}
                imageStyle={{ borderRadius: 16 }}
            >
                {/* Location overlay */}
                <View style={styles.locationContainer}>
                    <View style={styles.locationDot} />
                    <Text style={styles.locationText}>{memory.location}</Text>
                </View>
            </ImageBackground>

            {/* Caption below the card */}
            <Text style={styles.captionText}>{memory.caption}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    memoryCardContainer: {
        width: width,
        paddingHorizontal: 20,
    },
    memoryCard: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        justifyContent: 'flex-start',
    },
    locationContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        alignSelf: 'flex-start',
        margin: 12,
    },
    locationDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#3a86ff',
        marginRight: 6,
        top: 5,
    },
    locationText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    captionText: {
        fontSize: 16,
        color: '#fff',
        marginTop: 12,
        marginBottom: 8,
    }
});

export default MemoryCard;