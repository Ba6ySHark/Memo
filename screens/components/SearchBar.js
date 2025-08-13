import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Dimensions,
  Animated,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { imageService } from '../../services/imageService';
import UserSearch from './UserSearch';

const { width, height } = Dimensions.get('window');

export default function SearchBar({ 
  placeholder = 'Search...',
  onSearch = () => {},
  style = {},
  inputStyle = {},
}) {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Animation values
  const [expandAnimation] = useState(new Animated.Value(0));
  const [fadeAnimation] = useState(new Animated.Value(0));

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchText.trim().length > 0) {
        performSearch(searchText.trim());
      } else {
        setSearchResults([]);
        if (showResults) {
          collapseSearch();
        }
        setErrorMessage('');
      }
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  const expandSearch = () => {
    setShowResults(true);
    Animated.parallel([
      Animated.timing(expandAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const collapseSearch = () => {
    Animated.parallel([
      Animated.timing(expandAnimation, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setShowResults(false);
    });
  };

  const performSearch = async (searchTerm) => {
    try {
      setIsSearching(true);
      if (!showResults) {
        expandSearch();
      }
      setErrorMessage('');
      
      const result = await imageService.searchUsers(searchTerm);
      
      if (result.success) {
        setSearchResults(result.users);
      } else {
        console.error('Search failed:', result.message);
        setSearchResults([]);
        setErrorMessage(result.message || 'Search failed. Please try again.');
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    if (searchText.trim()) {
      onSearch(searchText.trim());
    }
  };

  const handleUserSelect = (user) => {
    console.log('Selected user:', user);
    // You can implement user selection logic here
    // For example, navigate to user profile, send message, etc.
    collapseSearch();
    setSearchText('');
  };

  const handleInputFocus = () => {
    if (searchText.trim().length > 0) {
      expandSearch();
    }
  };

  const handleInputBlur = () => {
    // Don't collapse immediately to allow for touch events
  };

  const closeSearchResults = () => {
    collapseSearch();
    setSearchText('');
    setSearchResults([]);
    setErrorMessage('');
  };

  const containerHeight = expandAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [70, 400], // Increased from 60 to 70 to prevent text cutoff at top
  });

  const containerOpacity = fadeAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View style={[style, {
      height: containerHeight,
    }]}>
      <BlurView intensity={20} style={{
        borderRadius: 25,
        overflow: 'hidden',
        flex: 1,
      }}>
        {/* Search Input Row */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 15, // Increased from 12 to 15 for better text visibility
        }}>
          <TextInput
            style={[{
              flex: 1,
              fontSize: 16,
              color: '#ffffff',
              backgroundColor: 'transparent',
            }, inputStyle]}
            placeholder={placeholder}
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          <TouchableOpacity onPress={handleSearch} style={{
            marginLeft: 10,
            paddingHorizontal: 15,
            paddingVertical: 8,
            borderRadius: 15,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Text style={{
              color: '#ffffff',
              fontSize: 14,
              fontWeight: '600',
              marginRight: 5,
            }}>
              🔍
            </Text>
            <Text style={{
              color: '#ffffff',
              fontSize: 14,
              fontWeight: '600',
            }}>
              Search
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Results Section */}
        {showResults && (
          <Animated.View style={{
            flex: 1,
            opacity: fadeAnimation,
          }}>
            {/* Header */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderTopWidth: 1,
              borderTopColor: 'rgba(255, 255, 255, 0.1)',
            }}>
              <Text style={{
                color: '#ffffff',
                fontSize: 16,
                fontWeight: '600',
              }}>
                Search Results
              </Text>
              <TouchableOpacity onPress={closeSearchResults} style={{
                padding: 5,
              }}>
                <Text style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            {/* Results Content */}
            <View style={{
              flex: 1,
              paddingHorizontal: 15,
            }}>
              <UserSearch
                searchResults={searchResults}
                isLoading={isSearching}
                onUserSelect={handleUserSelect}
                errorMessage={errorMessage}
                style={{
                  flex: 1,
                }}
              />
            </View>
          </Animated.View>
        )}
      </BlurView>
    </Animated.View>
  );
} 