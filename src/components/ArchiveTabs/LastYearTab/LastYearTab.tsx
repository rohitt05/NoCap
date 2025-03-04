import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MemoryCard from './MemoryCard';

const { width } = Dimensions.get('window');

const LastYearTab = () => {
    // Get current date
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth();

    // Format date for display (e.g., "March 1")
    const formatDate = (date) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    };

    // Mock data for memories from last year
    const lastYearDate = new Date(today);
    lastYearDate.setFullYear(today.getFullYear() - 1);

    const lastYearMemories = [
        {
            id: '1',
            time: '2:35 PM',
            caption: 'Saturrdayyyy.',
            location: 'Colaba, Mumbai',
            imageUrl: 'https://i.pinimg.com/736x/39/c1/2a/39c12aef2668174df2d5daed9777ed97.jpg'
        },
        {
            id: '2',
            time: '4:15 PM',
            caption: 'Evening at the beach.',
            location: 'Juhu Beach, Mumbai',
            imageUrl: 'https://i.pinimg.com/736x/39/c1/2a/39c12aef2668174df2d5daed9777ed97.jpg'
        },
        {
            id: '3',
            time: '7:30 PM',
            caption: 'Dinner with friends.',
            location: 'Bandra, Mumbai',
            imageUrl: 'https://i.pinimg.com/736x/39/c1/2a/39c12aef2668174df2d5daed9777ed97.jpg'
        }
    ];

    // State for tracking current memory index
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    // Check if there are memories
    const hasMemories = lastYearMemories.length > 0;

    // Handle scroll event
    const handleScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.floor(contentOffsetX / width);
        if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex);
        }
    };

    // Scroll to a specific index
    const scrollToIndex = (index) => {
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({
                index,
                animated: true
            });
            setCurrentIndex(index);
        }
    };

    // Get current memory time
    const getCurrentMemory = () => {
        return lastYearMemories[currentIndex] || { time: '' };
    };

    // Get item layout for optimized FlatList scrolling
    const getItemLayout = (_, index) => ({
        length: width,
        offset: width * index,
        index,
    });

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
        >
            <Text style={styles.title}>Last Year, This Day</Text>
            <Text style={styles.subtitle}>What happened on this day last year</Text>

            {hasMemories ? (
                <View style={styles.memoryContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.dateHeader}>{formatDate(lastYearDate)}</Text>
                        <Text style={styles.memoryTime}>{getCurrentMemory().time}</Text>
                    </View>

                    {/* Memory Carousel */}
                    <FlatList
                        ref={flatListRef}
                        data={lastYearMemories}
                        renderItem={({ item }) => <MemoryCard memory={item} />}
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
                    {lastYearMemories.length > 1 && (
                        <View style={styles.paginationContainer}>
                            {lastYearMemories.map((_, index) => (
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
                    {lastYearMemories.length > 1 && (
                        <View style={styles.navigationContainer}>
                            <TouchableOpacity
                                style={[styles.navButton, { opacity: currentIndex === 0 ? 0.3 : 1 }]}
                                onPress={() => currentIndex > 0 && scrollToIndex(currentIndex - 1)}
                                disabled={currentIndex === 0}
                            >
                                <Ionicons name="chevron-back" size={24} color="#fff" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.navButton, { opacity: currentIndex === lastYearMemories.length - 1 ? 0.3 : 1 }]}
                                onPress={() => currentIndex < lastYearMemories.length - 1 && scrollToIndex(currentIndex + 1)}
                                disabled={currentIndex === lastYearMemories.length - 1}
                            >
                                <Ionicons name="chevron-forward" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    )}


                </View>
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No memories from this day last year</Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 32, // Add extra bottom padding for scroll
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#999',
        marginBottom: 24,
    },
    memoryContainer: {
        width: '100%',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 4,
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
    },

    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 300, // Add a minimum height for the empty state
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
    }
});

export default LastYearTab;