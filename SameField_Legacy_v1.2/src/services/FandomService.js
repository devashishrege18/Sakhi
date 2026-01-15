import { db } from '../firebase/config';
import { doc, getDoc, updateDoc, increment, arrayUnion, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { circles, levels } from './mockData';

class FandomService {
    constructor() {
        this.circles = circles;
        this.levels = levels;
    }

    async getUserStats(userId) {
        if (!userId) return null;
        const userRef = doc(db, 'users', userId);
        const snap = await getDoc(userRef);
        return snap.data();
    }

    getCircles() {
        return this.circles;
    }

    async joinCircle(userId, circleId) {
        if (!userId) return { success: false, msg: 'Login required' };

        const userRef = doc(db, 'users', userId);
        const snap = await getDoc(userRef);
        const userData = snap.data();

        const circle = this.circles.find(c => c.id === circleId);
        if (!circle) return { success: false, msg: 'Circle not found' };

        if ((userData.joinedCircles || []).includes(circleId)) {
            return { success: false, msg: 'Already a member' };
        }

        if (userData.xp < circle.reqReputation) {
            return { success: false, msg: `Reputation too low. Need ${circle.reqReputation}` };
        }

        await updateDoc(userRef, {
            joinedCircles: arrayUnion(circleId),
            xp: increment(50)
        });

        return { success: true, msg: `Joined ${circle.name}!` };
    }

    async makePrediction(userId, isCorrectSimulation = true) {
        if (!userId) return { result: 'ERROR', msg: 'Login required' };

        const userRef = doc(db, 'users', userId);
        const updateData = {
            'predictions.total': increment(1)
        };

        if (isCorrectSimulation) {
            updateData['predictions.correct'] = increment(1);
            updateData.xp = increment(100);
            await updateDoc(userRef, updateData);
            return { result: 'WIN', msg: 'Prediction Correct! +100 XP' };
        } else {
            await updateDoc(userRef, updateData);
            return { result: 'LOSS', msg: 'Better luck next time!' };
        }
    }

    getLevel(xp) {
        for (let i = this.levels.length - 1; i >= 0; i--) {
            if (xp >= this.levels[i].minPoints) {
                return this.levels[i];
            }
        }
        return this.levels[0];
    }

    getNextLevel(xp) {
        for (let i = 0; i < this.levels.length; i++) {
            if (xp < this.levels[i].minPoints) {
                return this.levels[i];
            }
        }
        return this.levels[this.levels.length - 1]; // Max level
    }

    // --- PERSISTENCE METHODS ---

    subscribeToPosts(circleId, callback) {
        const postsRef = collection(db, 'communities', circleId || 'global', 'posts');
        const q = query(postsRef, orderBy('created_at', 'desc'));

        return onSnapshot(q, (snapshot) => {
            const posts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                created_at: doc.data().created_at?.toDate()?.toISOString() || new Date().toISOString()
            }));
            callback(posts);
        });
    }

    async addPost(circleId, postData) {
        const postsRef = collection(db, 'communities', circleId || 'global', 'posts');
        const post = {
            ...postData,
            created_at: serverTimestamp(),
            likes: [],
            comments: []
        };
        const docRef = await addDoc(postsRef, post);
        return { id: docRef.id, ...post };
    }

    async addComment(circleId, postId, commentData) {
        const postRef = doc(db, 'communities', circleId || 'global', 'posts', postId);
        await updateDoc(postRef, {
            comments: arrayUnion({
                ...commentData,
                id: 'c' + Date.now(),
                created_at: new Date().toISOString()
            })
        });
    }

    async likePost(circleId, postId, userId) {
        const postRef = doc(db, 'communities', circleId || 'global', 'posts', postId);
        await updateDoc(postRef, {
            likes: arrayUnion(userId)
        });
    }

    subscribeToChat(circleId, callback) {
        const chatRef = collection(db, 'communities', circleId || 'global', 'chat');
        const q = query(chatRef, orderBy('time', 'asc'));

        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                time: doc.data().time?.toDate()?.toISOString() || new Date().toISOString()
            }));
            callback(messages);
        });
    }

    async sendChatMessage(circleId, msgData) {
        const chatRef = collection(db, 'communities', circleId || 'global', 'chat');
        await addDoc(chatRef, {
            ...msgData,
            time: serverTimestamp()
        });
    }
}

export const fandomService = new FandomService();
