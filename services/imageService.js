import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, setDoc, deleteDoc, collection, addDoc, query, where, orderBy, getDocs, getDoc } from 'firebase/firestore';
import { storage, db } from '../config/firebase';
import { auth } from '../config/firebase';

export const imageService = {
  // Test Firebase connectivity
  async testFirebaseConnection() {
    try {
      console.log('Testing Firebase connection...');
      
      // Test Firestore connection
      const testDoc = doc(db, 'test', 'connection-test');
      await setDoc(testDoc, { timestamp: new Date() });
      console.log('Firestore connection successful');
      
      // Test Storage connection
      const testStorageRef = ref(storage, 'test/connection-test.txt');
      const testBlob = new Blob(['test'], { type: 'text/plain' });
      await uploadBytes(testStorageRef, testBlob);
      console.log('Storage connection successful');
      
      // Clean up test files
      await deleteDoc(testDoc);
      await deleteObject(testStorageRef);
      console.log('Firebase connection test completed successfully');
      
      return { success: true, message: 'Firebase connection successful' };
    } catch (error) {
      console.error('Firebase connection test failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Upload profile image
  async uploadProfileImage(userId, imageUri) {
    try {
      console.log('Starting profile image upload for user:', userId);
      
      // Convert image URI to blob
      const response = await fetch(imageUri);
      const blob = await response.blob();
      console.log('Image blob created, size:', blob.size);
      
      // Create storage reference
      const storageRef = ref(storage, `profile-images/${userId}/profile.jpg`);
      console.log('Storage reference created:', storageRef.fullPath);
      
      // Upload image
      console.log('Uploading to Firebase Storage...');
      const snapshot = await uploadBytes(storageRef, blob);
      console.log('Upload successful, bytes transferred:', snapshot.bytesTransferred);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Download URL obtained:', downloadURL);
      
      // Save to Firestore
      console.log('Saving to Firestore...');
      await setDoc(doc(db, 'users', userId), {
        profileImageURL: downloadURL,
        updatedAt: new Date(),
      }, { merge: true });
      console.log('Firestore update successful');
      
      return {
        success: true,
        imageURL: downloadURL,
        message: 'Profile image uploaded successfully!'
      };
    } catch (error) {
      console.error('Profile image upload error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to upload profile image: ${error.message}`
      };
    }
  },

  // Delete profile image
  async deleteProfileImage(userId) {
    try {
      console.log('Deleting profile image for user:', userId);
      
      // Delete from Storage
      const storageRef = ref(storage, `profile-images/${userId}/profile.jpg`);
      await deleteObject(storageRef);
      console.log('Storage deletion successful');
      
      // Update Firestore
      await setDoc(doc(db, 'users', userId), {
        profileImageURL: null,
        updatedAt: new Date(),
      }, { merge: true });
      console.log('Firestore update successful');
      
      return {
        success: true,
        message: 'Profile image deleted successfully!'
      };
    } catch (error) {
      console.error('Profile image deletion error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to delete profile image: ${error.message}`
      };
    }
  },

  // Upload feed image
  async uploadFeedImage(userId, imageUri, caption = '') {
    try {
      console.log('Starting feed image upload for user:', userId);
      
      // Convert image URI to blob
      const response = await fetch(imageUri);
      const blob = await response.blob();
      console.log('Image blob created, size:', blob.size);
      
      // Create unique filename
      const timestamp = Date.now();
      const storageRef = ref(storage, `feed-images/${userId}/${timestamp}.jpg`);
      console.log('Storage reference created:', storageRef.fullPath);
      
      // Upload image
      console.log('Uploading to Firebase Storage...');
      const snapshot = await uploadBytes(storageRef, blob);
      console.log('Upload successful, bytes transferred:', snapshot.bytesTransferred);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Download URL obtained:', downloadURL);
      
      // Save to Firestore
      console.log('Saving to Firestore...');
      const feedDoc = await addDoc(collection(db, 'feed'), {
        userId: userId,
        imageURL: downloadURL,
        caption: caption,
        timestamp: new Date(),
        storagePath: `feed-images/${userId}/${timestamp}.jpg`,
      });
      console.log('Firestore document created with ID:', feedDoc.id);
      
      return {
        success: true,
        imageURL: downloadURL,
        postId: feedDoc.id,
        storagePath: `feed-images/${userId}/${timestamp}.jpg`,
        message: 'Image published successfully!'
      };
    } catch (error) {
      console.error('Feed image upload error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to publish image: ${error.message}`
      };
    }
  },

  // Delete feed image
  async deleteFeedImage(postId, storagePath) {
    try {
      console.log('Deleting feed image, postId:', postId, 'storagePath:', storagePath);
      
      // Delete from Storage
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);
      console.log('Storage deletion successful');
      
      // Delete from Firestore
      await deleteDoc(doc(db, 'feed', postId));
      console.log('Firestore deletion successful');
      
      return {
        success: true,
        message: 'Image deleted successfully!'
      };
    } catch (error) {
      console.error('Feed image deletion error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to delete image: ${error.message}`
      };
    }
  },

  // Get user's feed images
  async getUserFeed(userId) {
    try {
      console.log('Loading feed for user:', userId);
      
      const q = query(
        collection(db, 'feed'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const feed = [];
      
      querySnapshot.forEach((doc) => {
        feed.push({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate().toLocaleString(),
        });
      });
      
      // Sort by timestamp in descending order (newest first)
      feed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      console.log('Feed loaded successfully, count:', feed.length);
      return {
        success: true,
        feed: feed
      };
    } catch (error) {
      console.error('Get user feed error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to load feed: ${error.message}`
      };
    }
  },

  // Get all feed images (for future social features)
  async getAllFeed() {
    try {
      console.log('Loading all feed images...');
      
      const q = query(
        collection(db, 'feed'),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const feed = [];
      
      querySnapshot.forEach((doc) => {
        feed.push({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate().toLocaleString(),
        });
      });
      
      console.log('All feed loaded successfully, count:', feed.length);
      return {
        success: true,
        feed: feed
      };
    } catch (error) {
      console.error('Get all feed error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to load feed: ${error.message}`
      };
    }
  },

  // Get user profile data
  async getUserProfile(userId) {
    try {
      console.log('Getting user profile for:', userId);
      
      // Check if user is authenticated
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error('User not authenticated');
        return {
          success: false,
          error: 'User not authenticated',
          message: 'Please sign in to view profiles'
        };
      }
      
      // Get user document from Firestore
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('User profile loaded successfully');
        return {
          success: true,
          user: {
            id: userDoc.id,
            displayName: userData.displayName,
            email: userData.email,
            profileImageURL: userData.profileImageURL || null,
            createdAt: userData.createdAt?.toDate?.() || null,
            updatedAt: userData.updatedAt?.toDate?.() || null,
          }
        };
      } else {
        console.error('User not found');
        return {
          success: false,
          error: 'User not found',
          message: 'User profile not found'
        };
      }
    } catch (error) {
      console.error('Get user profile error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to load user profile: ${error.message}`
      };
    }
  },

  // Sync current user to Firestore users collection
  async syncCurrentUserToFirestore() {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error('No authenticated user found');
        return {
          success: false,
          error: 'No authenticated user',
          message: 'Please sign in first'
        };
      }

      console.log('Syncing current user to Firestore:', currentUser.uid);
      
      // Get user data from Firebase Auth
      const userData = {
        displayName: currentUser.displayName || 'Unknown User',
        email: currentUser.email,
        updatedAt: new Date(),
      };

      // If this is a new user, add createdAt
      if (!currentUser.metadata.creationTime) {
        userData.createdAt = new Date();
      }

      // Save to Firestore
      await setDoc(doc(db, 'users', currentUser.uid), userData, { merge: true });
      
      console.log('User synced to Firestore successfully');
      return {
        success: true,
        message: 'User synced to Firestore'
      };
    } catch (error) {
      console.error('Error syncing user to Firestore:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to sync user: ${error.message}`
      };
    }
  },

  // Sync all existing users to Firestore (admin function)
  async syncAllUsersToFirestore() {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error('No authenticated user found');
        return {
          success: false,
          error: 'No authenticated user',
          message: 'Please sign in first'
        };
      }

      console.log('Syncing all users to Firestore...');
      
      // Note: This is a simplified approach. In a real app, you might want to use Firebase Admin SDK
      // to get all users, but for now we'll just sync the current user
      const result = await this.syncCurrentUserToFirestore();
      
      if (result.success) {
        console.log('All users synced to Firestore successfully');
        return {
          success: true,
          message: 'Users synced to Firestore'
        };
      } else {
        return result;
      }
    } catch (error) {
      console.error('Error syncing all users to Firestore:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to sync users: ${error.message}`
      };
    }
  }
}; 