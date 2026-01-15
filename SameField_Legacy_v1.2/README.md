# 🏆 SameField | The Ultimate Fan Experience

SameField is a cutting-edge, hybrid social platform designed to revolutionize the way sports fans connect. By combining the persistence of **Firebase** with the low-latency power of **P2P Mesh Networking**, we've built a "hall of fame" experience that scales.

## 🚀 Key Features

- **Hall of Fandom (Global Leaderboard)**: Compete with fans worldwide. Earn XP by participating in forums, winning predictions, and engaging with the community.
- **Infinite Real-time Forums**: Cloud-synced discussions that update instantly as fans post, powered by Firestore.
- **Live Fan Circles**: Low-latency voice and video watch parties for the ultimate match-day synergy.
- **Persistent Fan Profiles**: Your XP, level, and reputation are saved globally across sessions.

## 💻 Tech Stack

- **Frontend**: React.js, Tailwind CSS, Lucide Icons
- **Real-time Persistence**: Firebase (Firestore & Auth)
- **P2P Signaling**: Trystero (Nostr-based)
- **Branding**: Custom SVG Design System

## 🛠️ Deployment Instructions

### 1. Vercel (Recommended)
SameField is pre-configured for **Vercel**. 
1. Push your code to a GitHub repository.
2. Connect the repository to Vercel.
3. **Environment Variables**: Make sure to add any production API keys in the Vercel dashboard.
4. Click **Deploy**.

### 2. Manual Build
If you wish to host it yourself:
```bash
npm install
npm run build
```
The production-ready files will be in the `/dist` directory.

---
*Built with ❤️ for the Hackathon. May the best fans win!*
