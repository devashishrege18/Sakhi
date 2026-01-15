class LiveStreamService {
    constructor() {
        // Master List: Tagged with Gender (F/M) for Algorithm
        // 70% Target = Female, 30% Target = Male
        this.allChannels = [
            // --- WOMEN'S SPORTS (Pool A) ---
            {
                id: 't20_wc_2024_final',
                name: 'T20 WC: NZ vs SA',
                type: 'Cricket',
                gender: 'F',
                url: 'https://www.youtube.com/embed/_LfB2RF5AkM',
                description: 'Women\'s T20 World Cup 2024 Final • Full Highlights',
                thumbnail: 'https://img.youtube.com/vi/_LfB2RF5AkM/maxresdefault.jpg'
            },
            {
                id: 't20_wc_semi',
                name: 'T20 WC: Semi-Final Thriller',
                type: 'Cricket',
                gender: 'F',
                url: 'https://www.youtube.com/embed/_LfB2RF5AkM?start=120',
                description: 'Key Moments & Final Overs',
                thumbnail: 'https://img.youtube.com/vi/_LfB2RF5AkM/mqdefault.jpg'
            },
            {
                id: 'w_football_best',
                name: 'Best Women\'s Goals 2024',
                type: 'Football',
                gender: 'F',
                url: 'https://www.youtube.com/embed/e1v9x_B8q2E',
                description: 'FIFA Puskas Contenders',
                thumbnail: 'https://img.youtube.com/vi/e1v9x_B8q2E/maxresdefault.jpg'
            },
            // --- MEN'S SPORTS (Pool B: ~30%) ---
            {
                id: 'pl_goals_2024',
                name: 'PL Best Goals 24/25',
                type: 'Football',
                gender: 'M',
                url: 'https://www.youtube.com/embed/D-nUfS77i7Y',
                description: 'The BEST Premier League Goals of 2024/25',
                thumbnail: 'https://img.youtube.com/vi/D-nUfS77i7Y/maxresdefault.jpg'
            },
            {
                id: 'pl_last_minute',
                name: 'PL Last Minute Drama',
                type: 'Football',
                gender: 'M',
                url: 'https://www.youtube.com/embed/3-5_f_kK-2U',
                description: 'Last Minute Goals That Stole the Game',
                thumbnail: 'https://img.youtube.com/vi/3-5_f_kK-2U/maxresdefault.jpg'
            }
        ];
    }

    getWeightedStream(currentId = null) {
        // Algorithm: 70% Female, 30% Male
        const roll = Math.random();
        const targetGender = roll < 0.70 ? 'F' : 'M';

        let pool = this.allChannels.filter(c => c.gender === targetGender);

        if (pool.length === 0) {
            pool = this.allChannels.filter(c => c.gender === (targetGender === 'F' ? 'M' : 'F'));
        }

        let candidates = pool.filter(c => c.id !== currentId);
        if (candidates.length === 0) candidates = pool;

        const randomIndex = Math.floor(Math.random() * candidates.length);
        const selected = candidates[randomIndex];

        console.log(`[Algorithm] Roll: ${roll.toFixed(2)} -> Target: ${targetGender} -> Selected: ${selected.name}`);
        return selected;
    }

    getChannels() {
        return this.allChannels;
    }
}

export const liveStreamService = new LiveStreamService();

