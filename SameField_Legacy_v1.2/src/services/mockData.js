export const matches = [
    { id: 'm1', team1: 'Mumbai Indians (W)', team2: 'Delhi Capitals (W)', status: 'LIVE', score: '145/3 (15.2)', league: 'WPL' },
    { id: 'm2', team1: 'Chelsea Women', team2: 'Arsenal Women', status: 'Upcoming', time: '20:00 IST', league: 'WSL' },
    { id: 'm3', team1: 'India Women', team2: 'Australia Women', status: 'LIVE', score: '220/5 (45.0)', league: 'Test Match' },
    { id: 'm4', team1: 'Lakers', team2: 'Warriors', status: 'Finished', score: '110-108', league: 'NBA' },
    { id: 'm5', team1: 'Iga Swiatek', team2: 'Sabalenka', status: 'Upcoming', time: 'Tomorrow', league: 'WTA Final' },
    { id: 'm6', team1: 'Las Vegas Aces', team2: 'New York Liberty', status: 'LIVE', score: '89-85 (Q4)', league: 'WNBA' }
];

export const players = [
    { id: 'p1', name: 'Smriti Mandhana', team: 'RCB (W)', role: 'Batsman' },
    { id: 'p2', name: 'Harmanpreet Kaur', team: 'Mumbai Indians', role: 'All-rounder' },
    { id: 'p3', name: 'Ellyse Perry', team: 'RCB (W)', role: 'All-rounder' },
    { id: 'p4', name: 'Caitlin Clark', team: 'Indiana Fever', role: 'Guard' },
    { id: 'p5', name: 'Alexia Putellas', team: 'Barcelona', role: 'Midfielder' },
    { id: 'p6', name: 'Virat Kohli', team: 'RCB', role: 'Batsman' }
];

export const users = [
    { id: 'u1', name: 'WPL_Queen', avatar: 'WQ' },
    { id: 'u2', name: 'SheBaller', avatar: 'SB' },
    { id: 'u3', name: 'CricketFan99', avatar: 'CF' }
];

export const threadTemplates = [
    { title: "Live Match Discussion: {team1} vs {team2}", category: "Live Match Reactions", type: "match" },
    { title: "Queen of the Pitch: {player} Highlights", category: "Player Performance Talk", type: "player" },
    { title: "Tactical Masterclass: {team1}'s strategy", category: "Tactical Analysis", type: "match" },
    { title: "WPL Auction: Who goes where?", category: "Rumor Mill", type: "player" }
];

export const circles = [
    { id: 'c1', name: 'Smriti Mandhana FC', type: 'Player', refId: 'p1', members: 45000, reqReputation: 50, icon: '🏏' },
    { id: 'c2', name: 'MI Paltan (W)', type: 'Team', refId: 't_miw', members: 38000, reqReputation: 10, icon: '💙' },
    { id: 'c3', name: 'Caitlin Clark Hype', type: 'Player', refId: 'p4', members: 62000, reqReputation: 80, icon: '🏀' },
    { id: 'c4', name: 'Lionesses', type: 'Team', refId: 't_eng', members: 55000, reqReputation: 100, icon: '🦁' },
    { id: 'c5', name: 'Viratians', type: 'Player', refId: 'p6', members: 15400, reqReputation: 50, icon: '👑' },
    { id: 'c6', name: 'Serena Legacy', type: 'Player', refId: 'p_serena', members: 30000, reqReputation: 150, icon: '🎾' }
];

export const predictionQuestions = [
    { id: 1, q: "Will Smriti score 50+ today?", sport: "Cricket", multiplier: 2.0 },
    { id: 2, q: "Will Caitlin Clark hit 5+ threes?", sport: "Basketball", multiplier: 1.8 },
    { id: 3, q: "Who wins the WPL Final?", sport: "Cricket", multiplier: 2.5 },
    { id: 4, q: "Total goals over 2.5 in WSL match?", sport: "Football", multiplier: 1.6 },
    { id: 5, q: "Will Harmanpreet hit a six?", sport: "Cricket", multiplier: 1.5 },
    { id: 6, q: "Swiatek to win in straight sets?", sport: "Tennis", multiplier: 1.7 }
];

export const levels = [
    { name: 'New Fan', minPoints: 0, perks: ['Join Circles'] },
    { name: 'Core Fan', minPoints: 500, perks: ['Post Polls', 'Badge'] },
    { name: 'Super Fan', minPoints: 1500, perks: ['Early Access', 'Meet Priority'] },
    { name: 'Captain', minPoints: 5000, perks: ['Moderator Status', 'Direct AMA'] }
];

export const userStats = {
    points: 350,
    level: 'New Fan',
    reputation: 85,
    joinedCircles: ['c1'],
    predictions: { total: 10, correct: 6 }
};

export const circleMedia = {
    'c1': [
        { id: 'm1', type: 'image', url: '/assets/talent_gully_cricket_1765787655210.png', title: 'Smriti in Action' },
        { id: 'm2', type: 'video', vidId: '_Hlq_TaPoYw', title: 'Match Highlight' },
        { id: 'm3', type: 'image', url: '/assets/store_vk18_fitness_1765787964441.png', title: 'Training Session' }
    ],
    'c5': [
        { id: 'm4', type: 'image', url: '/assets/store_vk18_fitness_1765787964441.png', title: 'King Kohli' },
        { id: 'm5', type: 'video', vidId: 'NsZ-BiPzmOw', title: 'Haaland vs Neymar' },
        { id: 'm6', type: 'image', url: '/assets/product_leather_gloves_1765788007746.png', title: 'Equipments' }
    ],
    'default': [
        { id: 'd1', type: 'image', url: '/assets/talent_street_football_1765787693394.png', title: 'Community Spirit' },
        { id: 'd2', type: 'image', url: '/assets/talent_boxing_training_1765787719934.png', title: 'The Grind' }
    ]
};
