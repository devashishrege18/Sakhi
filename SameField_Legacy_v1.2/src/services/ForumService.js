import { db } from '../firebase/config';
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    updateDoc,
    doc,
    increment,
    serverTimestamp,
    getDocs,
    where,
    setDoc,
    deleteDoc
} from 'firebase/firestore';

class ForumService {
    constructor() {
        this.threads = [];
        this.syncCallbacks = [];
        this.init();
    }

    async init() {
        const q = query(collection(db, 'threads'), orderBy('votes', 'desc'));
        onSnapshot(q, (snapshot) => {
            this.threads = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString()
            }));
            this.syncCallbacks.forEach(cb => cb());
        });

        // Initialize with seed data if too few threads remain
        const snapshot = await getDocs(collection(db, 'threads'));
        if (snapshot.size < 5) {
            await this.seedData();
        }

        // ONE-TIME CLEANUP: Remove duplicates with random IDs
        await this.cleanupLegacyThreads(snapshot);
    }

    async seedData() {
        const initialThreads = {
            'thread_1': {
                title: "Why split-captaincy is the future of Mixed Cricket",
                author: 'TacticalGenius',
                category: 'Tactical Analysis',
                votes: 342,
                comments: 5,
                content: "I've been analyzing the win rates of teams with dual leadership. The split in workload between batting and bowling specialists as captains shows a 12% improvement in decision-making speed.",
                timestamp: serverTimestamp(),
                aiSummary: "Analysis suggests 12% boost in strategic speed via dual leadership.",
                aiTags: ["Strategy", "Metrics"]
            },
            'thread_2': {
                title: "India vs Australia - Match Thread",
                author: 'System Bot',
                category: 'Live Match Reactions',
                votes: 156,
                comments: 12,
                isLive: true,
                content: `Official live discussion thread for the heavyweight clash. Keep it civil and focus on the game!`,
                timestamp: serverTimestamp(),
                aiSummary: "Live tracking of IND vs AUS game events.",
                aiTags: ["Live", "Trending"]
            },
            'thread_3': {
                title: "Caitlin Clark: Redefining the Guard Position",
                author: 'HoopsMaster',
                category: 'Player Performance Talk',
                votes: 890,
                comments: 45,
                content: "The way she scans the floor is reminiscent of prime Bird. Her range is just the tip of the iceberg.",
                timestamp: serverTimestamp(),
                aiSummary: "Deep dive into Clark's playmaking and court vision.",
                aiTags: ["WNBA", "GOAT-Talk"]
            },
            'thread_4': {
                title: "RCB Women: The Unstoppable Momentum",
                author: 'WPL_Fanatic',
                category: 'Live Match Reactions',
                votes: 620,
                comments: 31,
                content: "Is this the strongest lineup in league history? The balance between Perry and Mandhana is perfect.",
                timestamp: serverTimestamp(),
                aiSummary: "Fans debating if RCB W is the most balanced team ever.",
                aiTags: ["WPL", "RCB"]
            },
            'thread_5': {
                title: "AI in Sports: Prediction or Spoilers?",
                author: 'DataSciFan',
                category: 'Fan Predictions',
                votes: 215,
                comments: 18,
                content: "With LLMs predicting player moves, are we losing the magic of the unexpected?",
                timestamp: serverTimestamp(),
                aiSummary: "Community debate on AI's role in sports anticipation.",
                aiTags: ["AI", "Ethics"]
            },
            'thread_6': {
                title: "The Rise of Mixed Sports Leagues",
                author: 'SportsFuturist',
                category: 'Tactical Analysis',
                votes: 430,
                comments: 24,
                content: "Watching men and women compete on the same pitch is changing the dynamics of teamwork. Is this the future of the Olympics?",
                timestamp: serverTimestamp(),
                aiSummary: "Discussion on the societal and athletic impact of mixed leagues.",
                aiTags: ["Future", "Equality"]
            },
            'thread_7': {
                title: "Predictions: MVP of WPL 2025?",
                author: 'StatWatcher',
                category: 'Fan Predictions',
                votes: 95,
                comments: 150,
                content: "Based on current strike rates, it's a three-way race. Who's your pick?",
                timestamp: serverTimestamp(),
                aiSummary: "Community voting on WPL season MVP favorites.",
                aiTags: ["Stats", "MVP"]
            }
        };

        for (const [id, thread] of Object.entries(initialThreads)) {
            await setDoc(doc(db, 'threads', id), thread);
        }
    }

    async cleanupLegacyThreads(snapshot) {
        // Find threads that have titles matching our fixed seed data but are NOT the fixed IDs
        const seedTitles = [
            "Why split-captaincy is the future of Mixed Cricket",
            "India vs Australia - Match Thread",
            "Caitlin Clark: Redefining the Guard Position",
            "RCB Women: The Unstoppable Momentum",
            "AI in Sports: Prediction or Spoilers?",
            "The Rise of Mixed Sports Leagues",
            "Predictions: MVP of WPL 2025?"
        ];

        const fixedIds = ['thread_1', 'thread_2', 'thread_3', 'thread_4', 'thread_5', 'thread_6', 'thread_7'];

        const toDelete = snapshot.docs.filter(doc => {
            const data = doc.data();
            return seedTitles.includes(data.title) && !fixedIds.includes(doc.id);
        });

        for (const docSnap of toDelete) {
            await deleteDoc(doc(db, 'threads', docSnap.id));
            console.log(`Cleaned up legacy thread duplicate: ${docSnap.id}`);
        }
    }

    async broadcastComment(threadId, comment) {
        // Alias for addComment to fix UI crash
        return this.addComment(threadId, comment);
    }

    onSync(callback) {
        this.syncCallbacks.push(callback);
        return () => this.syncCallbacks = this.syncCallbacks.filter(c => c !== callback);
    }

    async createThread(data) {
        const thread = {
            ...data,
            timestamp: serverTimestamp(),
            votes: data.votes || 0,
            comments: 0
        };
        const docRef = await addDoc(collection(db, 'threads'), thread);
        return { id: docRef.id, ...thread };
    }

    async upvoteThread(threadId) {
        const threadRef = doc(db, 'threads', threadId);
        await updateDoc(threadRef, {
            votes: increment(1)
        });
    }

    async addComment(threadId, comment) {
        // Adding comment to a subcollection
        const commentsRef = collection(db, 'threads', threadId, 'comments');
        await addDoc(commentsRef, {
            ...comment,
            timestamp: serverTimestamp()
        });

        // Increment comment count on thread
        const threadRef = doc(db, 'threads', threadId);
        await updateDoc(threadRef, {
            comments: increment(1)
        });
    }

    getThreads(filter = 'All') {
        let list = [...this.threads];
        if (filter !== 'All') list = list.filter(t => t.category === filter);
        return list;
    }

    subscribeToComments(threadId, callback) {
        const q = query(collection(db, 'threads', threadId, 'comments'), orderBy('timestamp', 'asc'));
        return onSnapshot(q, (snapshot) => {
            const comments = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString()
            }));
            callback(comments);
        });
    }

    simulateLiveActivity(callback) {
        // Placeholder for legacy support to prevent crashes
        console.log("Forum simulation active (LEGACY)");
        return () => { };
    }
}

export const forumService = new ForumService();
