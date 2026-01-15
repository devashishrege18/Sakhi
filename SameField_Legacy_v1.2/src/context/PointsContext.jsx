import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, onSnapshot, setDoc, updateDoc, increment, getDoc } from 'firebase/firestore';

const PointsContext = createContext();

export const usePoints = () => useContext(PointsContext);

export const PointsProvider = ({ children }) => {
    const [points, setPoints] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [userId, setUserId] = useState(() => {
        let sid = localStorage.getItem('samefield_p2p_id');
        if (!sid) {
            sid = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('samefield_p2p_id', sid);
        }
        return sid;
    });

    useEffect(() => {
        if (!userId) return;

        const userRef = doc(db, 'users', userId);

        // Initial check/create
        getDoc(userRef).then(snap => {
            if (!snap.exists()) {
                const name = localStorage.getItem('samefield_username') || 'Guest Fan';
                setDoc(userRef, {
                    name,
                    xp: 9150,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
                    joinedCircles: [],
                    predictions: { total: 0, correct: 0 },
                    lastActive: new Date()
                });
            }
        });

        const unsubscribe = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
                setPoints(doc.data().xp || 0);
            }
        });

        return () => unsubscribe();
    }, [userId]);

    const addPoints = async (amount, reason) => {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            xp: increment(amount),
            lastActive: new Date()
        });

        const id = Date.now();
        const notification = { id, amount, reason };
        setNotifications(prev => [...prev, notification]);

        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    };

    return (
        <PointsContext.Provider value={{ points, addPoints, notifications, userId }}>
            {children}
        </PointsContext.Provider>
    );
};
