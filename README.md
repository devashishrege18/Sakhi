# Sakhi - AI Health Companion 🌸

**Sakhi** (meaning "Friends" or "Companion") is an intelligent, voice-first health assistant designed specifically for women's wellness in India. It breaks language barriers by offering seamless support in **10+ Indian languages**, making healthcare information accessible to everyone.

## ✨ Key Features

- **🗣️ Multilingual Voice Interface**: Speak naturally in Hindi, Tamil, Marathi, Bengali, Telugu, and more. Sakhi understands and replies in your language.
- **🩸 PCOS & Period Tracking**: Smart tools to manage menstrual health and track symptoms.
- **🏥 Hospital Finder**: Instantly locate nearby hospitals and clinics based on your location.
- **🧠 Intelligent AI Chat**: Powered by advanced LLMs (Groq/Llama) to answer health queries with empathy and accuracy.
- **🔒 Privacy First**: Secure and confidential interactions.

## 🛠️ Tech Stack

- **Framework**: [Next.js 13](https://nextjs.org/) (App Router)
- **Styling**: Modern CSS / Glassmorphism UI
- **AI Integration**: Groq API (Llama-3.3-70b-versatile)
- **Voice Stack**: 
  - **STT**: Web Speech API (Browser Native) with Phonetic Mapping
  - **TTS**: ElevenLabs API for natural voice synthesis
- **Backend**: Next.js API Routes (Edge Functions)
- **Database**: Firebase (Firestore) for secure chat history

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- API Keys for **Groq** and **ElevenLabs**
- Firebase Configuration

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/sakhi.git
    cd sakhi
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    Create a `.env.local` file in the root directory:
    ```env
    GROQ_API_KEY=your_groq_api_key
    ELEVENLABS_API_KEY=your_elevenlabs_api_key
    ```
    *(Note: Firebase config is located in `src/lib/firebase.js`)*

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📱 How to Use

1.  **Select Language**: On your first visit, chose your preferred native language (e.g., Hindi, Tamil).
2.  **Tap & Speak**: Click the simplistic Mic button and ask anything (e.g., *"Pet dukh raha hai"*, *"Nearby gynecologist"*).
3.  **Listen**: Sakhi will respond with voice and text in your chosen language.

## 🤝 Contribution

Contributions are welcome! Please feel free to submit a Pull Request.

---
*Built with ❤️ for Women's Health.*
