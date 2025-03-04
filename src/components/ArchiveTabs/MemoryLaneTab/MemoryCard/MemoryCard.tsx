import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MemoryCarousel = ({ selectedDate, formatDate }) => {
    const flatListRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const windowWidth = Dimensions.get('window').width;
    const cardWidth = windowWidth - 40; // Card width with margins
    const cardHeight = cardWidth * (5 / 4); // 4:5 aspect ratio

    // Check if date has memory (mock data for demonstration)
    const hasMemory = (date) => {
        // For demonstration, let's say every 3rd day has a memory
        return date && typeof date.getDate === 'function' && date.getDate() % 3 === 0;
    };

    // Sample memory data with added location field
    const getMemories = (date) => {
        if (!hasMemory(date)) return [];

        return [
            {
                id: '1',
                time: '9:41 AM',
                caption: 'Memory caption would appear here...',
                location: 'Central Park, NY',
                imageUrl: 'https://picsum.photos/id/1015/600/750' // Example image URL
            },
            {
                id: '2',
                time: '2:15 PM',
                caption: 'Another memory from this day...',
                location: 'Home Office',
                imageUrl: 'https://picsum.photos/id/1016/600/750'
            },
            {
                id: '3',
                time: '7:30 PM',
                caption: 'Evening memory with friends...',
                location: 'Downtown Cafe',
                imageUrl: 'https://picsum.photos/id/1018/600/750'
            }
        ];
    };

    const memories = getMemories(selectedDate);

    const handleScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.floor(contentOffsetX / windowWidth);
        if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex);
        }
    };

    const scrollToIndex = (index) => {
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({
                index,
                animated: true
            });
            setCurrentIndex(index);
        }
    };

    const renderMemoryCard = ({ item }) => (
        <View style={styles.memoryCardContainer}>
            <ImageBackground
                source={{ uri: item.imageUrl }}
                style={[styles.memoryCard, { height: cardHeight }]}
                imageStyle={{ borderRadius: 16 }}
            >
                {/* Location overlay */}
                <View style={styles.locationContainer}>
                    <View style={styles.locationDot} />
                    <Text style={styles.locationText}>{item.location}</Text>
                </View>
            </ImageBackground>

            {/* Caption below the card */}
            <Text style={styles.captionText}>{item.caption}</Text>
        </View>
    );

    const getItemLayout = (_, index) => ({
        length: windowWidth,
        offset: windowWidth * index,
        index,
    });

    const getCurrentMemory = () => {
        return memories[currentIndex] || { time: '' };
    };

    return (
        <View style={styles.memoryContainer}>
            <View style={styles.headerContainer}>
                <Text style={styles.dateHeader}>
                    {typeof formatDate === 'function' ? formatDate(selectedDate) : 'Feb 24, 2025'}
                </Text>
                <Text style={styles.memoryTime}>{getCurrentMemory().time}</Text>
            </View>

            {memories.length > 0 ? (
                <View>
                    {/* Memory Carousel */}
                    <FlatList
                        ref={flatListRef}
                        data={memories}
                        renderItem={renderMemoryCard}
                        keyExtractor={item => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={handleScroll}
                        pagingEnabled
                        decelerationRate="fast"
                        snapToAlignment="start"
                        getItemLayout={getItemLayout}
                        initialScrollIndex={0}
                    />

                    {/* Pagination Dots */}
                    {memories.length > 1 && (
                        <View style={styles.paginationContainer}>
                            {memories.map((_, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.paginationDot,
                                        index === currentIndex && styles.paginationDotActive
                                    ]}
                                    onPress={() => scrollToIndex(index)}
                                />
                            ))}
                        </View>
                    )}

                    {/* Navigation Arrows */}
                    {memories.length > 1 && (
                        <View style={styles.navigationContainer}>
                            <TouchableOpacity
                                style={[styles.navButton, { opacity: currentIndex === 0 ? 0.3 : 1 }]}
                                onPress={() => currentIndex > 0 && scrollToIndex(currentIndex - 1)}
                                disabled={currentIndex === 0}
                            >
                                <Ionicons name="chevron-back" size={24} color="#fff" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.navButton, { opacity: currentIndex === memories.length - 1 ? 0.3 : 1 }]}
                                onPress={() => currentIndex < memories.length - 1 && scrollToIndex(currentIndex + 1)}
                                disabled={currentIndex === memories.length - 1}
                            >
                                <Ionicons name="chevron-forward" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No memories for this day</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    memoryContainer: {
        width: '100%',

    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 26,
    },
    dateHeader: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    memoryTime: {
        fontSize: 14,
        color: '#999',
    },
    memoryCardContainer: {
        width: Dimensions.get('window').width,
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
    },
    emptyState: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#555',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: '#fff',
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 12,
    },
    navButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(50, 50, 50, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default MemoryCarousel;