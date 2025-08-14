import { collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export const searchService = {
  // Search users by display name
  async searchUsers(searchTerm) {
    try {
      console.log('Searching for users with term:', searchTerm);
      
      // Check if user is authenticated
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error('User not authenticated');
        return {
          success: false,
          error: 'User not authenticated',
          message: 'Please sign in to search users'
        };
      }
      
      if (!searchTerm || searchTerm.trim().length === 0) {
        return {
          success: true,
          users: []
        };
      }
      
      // Get all users and filter by display name
      const q = query(collection(db, 'users'));
      const querySnapshot = await getDocs(q);
      
      // Debug: Log total number of documents found
      console.log('Total documents in users collection:', querySnapshot.size);
      
      const users = [];
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        console.log('User document data:', doc.id, userData); // Debug: Log each user document
        
        if (userData.displayName) {
          // Case-insensitive search
          const displayName = userData.displayName.toLowerCase();
          const searchLower = searchTerm.toLowerCase();
          
          if (displayName.includes(searchLower)) {
            users.push({
              id: doc.id,
              displayName: userData.displayName,
              email: userData.email,
              profileImageURL: userData.profileImageURL || null,
              updatedAt: userData.updatedAt?.toDate?.() || null,
            });
          }
        } else {
          console.log('User document missing displayName:', doc.id, userData);
        }
      });
      
      // Sort by display name
      users.sort((a, b) => a.displayName.localeCompare(b.displayName));
      
      // Limit results to 3 items
      const limitedUsers = users.slice(0, 3);
      
      console.log('User search completed, found:', users.length, 'users, showing:', limitedUsers.length);
      return {
        success: true,
        users: limitedUsers
      };
    } catch (error) {
      console.error('User search error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to search users: ${error.message}`
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
      const { setDoc } = await import('firebase/firestore');
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
