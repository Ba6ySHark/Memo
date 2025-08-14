import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const authService = {
  // Sign up with email and password
  async signUp(email, password, fullName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with full name
      await updateProfile(userCredential.user, {
        displayName: fullName
      });
      
      // Save user data to Firestore for search functionality
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        displayName: fullName,
        email: email,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      return {
        success: true,
        user: userCredential.user,
        message: 'Account created successfully!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: this.getErrorMessage(error.code)
      };
    }
  },

  // Sign in with email and password
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Sync user to Firestore to ensure they are searchable
      try {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          displayName: userCredential.user.displayName || 'Unknown User',
          email: userCredential.user.email,
          updatedAt: new Date(),
        }, { merge: true });
        console.log('User synced to Firestore during sign in');
      } catch (syncError) {
        console.error('Failed to sync user to Firestore during sign in:', syncError);
        // Don't fail the sign in if Firestore sync fails
      }
      
      return {
        success: true,
        user: userCredential.user,
        message: 'Signed in successfully!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: this.getErrorMessage(error.code)
      };
    }
  },

  // Sign out
  async signOut() {
    try {
      await signOut(auth);
      return {
        success: true,
        message: 'Signed out successfully!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to sign out'
      };
    }
  },

  // Reset password
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: 'Password reset email sent!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: this.getErrorMessage(error.code)
      };
    }
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
  },

  // Convert Firebase error codes to user-friendly messages
  getErrorMessage(errorCode) {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/user-not-found':
        return 'Invalid email or password. Please check your credentials and try again.';
      case 'auth/wrong-password':
        return 'Invalid email or password. Please check your credentials and try again.';
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please check your credentials and try again.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.';
      case 'auth/operation-not-allowed':
        return 'Email/password sign in is not enabled. Please contact support.';
      case 'auth/requires-recent-login':
        return 'Please sign in again to complete this action.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}; 