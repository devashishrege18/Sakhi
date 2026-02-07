import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, deleteDoc, query, orderBy, limit } from 'firebase/firestore';

// Firebase configuration - ALL values from environment variables
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Generate unique chat ID
export const newChatId = () => {
    return Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
};

// Save chat to Firestore
export const saveChat = async (chatId, title, messages) => {
    try {
        const chatRef = doc(db, 'sakhi_chats', chatId);
        await setDoc(chatRef, {
            id: chatId,
            title: title || 'New Chat',
            messages: messages,
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
        }, { merge: true });
        return true;
    } catch (error) {
        console.error('Error saving chat:', error);
        return false;
    }
};

// Get all chats
export const getChats = async () => {
    try {
        const chatsRef = collection(db, 'sakhi_chats');
        const q = query(chatsRef, orderBy('updatedAt', 'desc'), limit(20));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error('Error getting chats:', error);
        return [];
    }
};

// Delete a chat
export const deleteChat = async (chatId) => {
    try {
        await deleteDoc(doc(db, 'sakhi_chats', chatId));
        return true;
    } catch (error) {
        console.error('Error deleting chat:', error);
        return false;
    }
};

export { db };
