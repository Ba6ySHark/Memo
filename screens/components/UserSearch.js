import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { BlurView } from 'expo-blur';

export default function UserSearch({ 
  searchResults = [], 
  isLoading = false, 
  onUserSelect = () => {},
  style = {},
  errorMessage = ''
}) {
  if (isLoading) {
    return (
      <View style={[{
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }, style]}>
        <ActivityIndicator color="#ffffff" size="small" />
        <Text style={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: 14,
          marginTop: 10,
          fontWeight: '500',
        }}>
          Searching...
        </Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={[{
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }, style]}>
        <Text style={{
          color: '#ff6b6b',
          fontSize: 14,
          textAlign: 'center',
          fontWeight: '500',
          lineHeight: 20,
        }}>
          {errorMessage}
        </Text>
      </View>
    );
  }

  if (searchResults.length === 0) {
    return (
      <View style={[{
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }, style]}>
        <Text style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: 14,
          textAlign: 'center',
          fontWeight: '500',
        }}>
          No users found
        </Text>
        <Text style={{
          color: 'rgba(255, 255, 255, 0.4)',
          fontSize: 12,
          textAlign: 'center',
          marginTop: 6,
        }}>
          Try searching with a different term
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[{
        flex: 1,
      }, style]}
      contentContainerStyle={{
        paddingVertical: 10,
      }}
      showsVerticalScrollIndicator={false}
    >
      {searchResults.map((user) => (
        <TouchableOpacity
          key={user.id}
          onPress={() => onUserSelect(user)}
          style={{
            marginBottom: 8,
          }}
        >
          <BlurView intensity={15} style={{
            borderRadius: 12,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.15)',
            overflow: 'hidden',
            padding: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            {/* User Profile Picture */}
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginRight: 12,
              overflow: 'hidden',
            }}>
              {user.profileImageURL ? (
                <Image
                  source={{ uri: user.profileImageURL }}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              ) : (
                <View style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Text style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                    {user.displayName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>

            {/* User Info */}
            <View style={{
              flex: 1,
            }}>
              <Text style={{
                color: '#ffffff',
                fontSize: 14,
                fontWeight: '600',
                marginBottom: 2,
              }}>
                {user.displayName}
              </Text>
              <Text style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: 12,
              }}>
                {user.email}
              </Text>
            </View>

            {/* Selection Indicator */}
            <View style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              borderWidth: 1.5,
              borderColor: 'rgba(255, 255, 255, 0.3)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: 12,
                lineHeight: 12,
                textAlign: 'center',
                includeFontPadding: false,
                marginTop: -1, // Fine-tune vertical position
              }}>
                ›
              </Text>
            </View>
          </BlurView>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
} 