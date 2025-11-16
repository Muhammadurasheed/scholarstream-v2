import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface User {
  uid: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isOnboardingComplete: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      console.log('🔐 Starting signup process...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { uid, email: userEmail } = userCredential.user;
      
      console.log('✅ User created successfully:', uid);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', uid), {
        uid,
        email: userEmail,
        created_at: new Date(),
        onboarding_completed: false,
        profile: null,
      });
      
      console.log('✅ User document created in Firestore');
      localStorage.removeItem('scholarstream_onboarding_complete');
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      
      // Parse Firebase error codes to user-friendly messages
      const errorMessages: { [key: string]: string } = {
        'auth/email-already-in-use': 'This email is already registered. Please login instead.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/operation-not-allowed': 'Email/password accounts are not enabled. Please contact support.',
        'auth/weak-password': 'Please choose a stronger password (at least 6 characters).',
        'auth/api-key-not-valid': '⚠️ Firebase is not configured correctly. Please check your .env file and ensure all Firebase credentials are set.',
        'auth/configuration-not-found': '⚠️ Firebase configuration is missing. Please set up your .env file with Firebase credentials.',
      };
      
      const userMessage = errorMessages[error.code] || error.message || 'Failed to create account. Please try again.';
      throw new Error(userMessage);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Starting signin process...');
      await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Signed in successfully');
    } catch (error: any) {
      console.error('❌ Signin error:', error);
      
      const errorMessages: { [key: string]: string } = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/user-disabled': 'This account has been disabled.',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
        'auth/api-key-not-valid': '⚠️ Firebase is not configured correctly. Please check your .env file.',
      };
      
      const userMessage = errorMessages[error.code] || error.message || 'Failed to sign in. Please try again.';
      throw new Error(userMessage);
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 Signing out...');
      await firebaseSignOut(auth);
      localStorage.removeItem('scholarstream_onboarding_complete');
      console.log('✅ Signed out successfully');
    } catch (error: any) {
      console.error('❌ Signout error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  };

  const isOnboardingComplete = () => {
    return localStorage.getItem('scholarstream_onboarding_complete') === 'true';
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, isOnboardingComplete }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};