import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

const GIPHY_API_KEY = '2xMFIZQe6dKrdxU0Sz2c6Y3iQIYGbcmq';

const GifInputComponent = ({ onGifSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [gifs, setGifs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedGif, setSelectedGif] = useState(null);

    // Fetch trending GIFs when component mounts
    useEffect(() => {
        fetchTrendingGifs();
    }, []);

    // Fetch trending GIFs from Giphy API
    const fetchTrendingGifs = async () => {
        if (selectedGif) return; // Don't fetch if we're in selection mode

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=20&rating=g`
            );
            const data = await response.json();
            setGifs(data.data || []);
        } catch (err) {
            console.error('Error fetching trending gifs:', err);
            setError('Failed to load trending GIFs');
        } finally {
            setLoading(false);
        }
    };

    // Search for GIFs using the Giphy API
    const searchGifs = async (query) => {
        if (!query.trim()) {
            fetchTrendingGifs();
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=20&rating=g`
            );
            const data = await response.json();
            setGifs(data.data || []);
        } catch (err) {
            console.error('Error searching for gifs:', err);
            setError('Failed to search for GIFs');
        } finally {
            setLoading(false);
        }
    };

    // Debounce search to avoid making too many API calls
    useEffect(() => {
        if (selectedGif) return; // Don't search if we're in selection mode

        const delayDebounceFn = setTimeout(() => {
            if (searchQuery) {
                searchGifs(searchQuery);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Handle text input changes
    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    // Handle GIF selection
    const handleGifSelect = (gif) => {
        setSelectedGif(gif);
        if (onGifSelect) {
            onGifSelect(gif);
        }
    };

    // Handle closing the selected GIF view
    const handleCloseSelected = () => {
        setSelectedGif(null);
    };

    // Render an empty state
    const renderEmptyState = () => {
        if (loading) {
            return (
                <View style={styles.emptyState}>
                    <ActivityIndicator size="large" color="#666" />
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.emptyState}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={fetchTrendingGifs} style={styles.retryButton}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (gifs.length === 0) {
            return (
                <View style={styles.emptyState}>
                    <Text style={styles.placeholderText}>
                        {searchQuery ? 'No GIFs found' : 'Search for a GIF to share'}
                    </Text>
                </View>
            );
        }

        return null;
    };

    // Render a GIF item
    const renderGifItem = ({ item }) => (
        <TouchableOpacity
            style={styles.gifItem}
            onPress={() => handleGifSelect(item)}
        >
            <Image
                source={{ uri: item.images.fixed_height.url }}
                style={styles.gifImage}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
            />
        </TouchableOpacity>
    );

    // Render the selected GIF view
    const renderSelectedGifView = () => {
        if (!selectedGif) return null;

        return (
            <View style={styles.selectedGifContainer}>
                <Image
                    source={{ uri: selectedGif.images.original.url }}
                    style={styles.selectedGifImage}
                    contentFit="cover"
                    transition={300}
                    cachePolicy="memory-disk"
                />
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleCloseSelected}
                >
                    <Ionicons name="close-circle" size={32} color="white" />
                </TouchableOpacity>
            </View>
        );
    };

    // If a GIF is selected, show only that GIF
    if (selectedGif) {
        return renderSelectedGifView();
    }

    // Otherwise show the search interface
    return (
        <View style={styles.gifContainer}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.gifSearchInput}
                    placeholder="Search for a GIF..."
                    placeholderTextColor="#666"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>

            {gifs.length > 0 ? (
                <FlatList
                    data={gifs}
                    renderItem={renderGifItem}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.gifGrid}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={loading ? <ActivityIndicator size="small" color="#666" /> : null}
                    ListEmptyComponent={renderEmptyState}
                />
            ) : (
                renderEmptyState()
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    gifContainer: {
        flex: 1,
        backgroundColor: '#000',
        borderRadius: 12,
        maxHeight: 400,
    },
    searchContainer: {
        padding: 10,
    },
    gifSearchInput: {
        backgroundColor: '#222',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        color: 'white',
        fontSize: 14,
    },
    gifGrid: {
        padding: 8,
    },
    gifItem: {
        flex: 1,
        margin: 4,
        height: 120,
        borderRadius: 8,
        overflow: 'hidden',
    },
    gifImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#333',
    },
    emptyState: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#444',
        margin: 10,
        borderRadius: 8,
        backgroundColor: '#222',
    },
    placeholderText: {
        color: '#666',
        textAlign: 'center',
    },
    errorText: {
        color: '#ff6b6b',
        textAlign: 'center',
        marginBottom: 10,
    },
    retryButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        backgroundColor: '#444',
        borderRadius: 4,
        marginTop: 10,
    },
    retryButtonText: {
        color: 'white',
    },
    // Styles for selected GIF view
    selectedGifContainer: {
        flex: 1,
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        position: 'relative',
    },
    selectedGifImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 16,
        padding: 2,
    }
});

export default GifInputComponent;