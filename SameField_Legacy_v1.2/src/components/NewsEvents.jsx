import React from 'react';
import { Calendar, Tag, ArrowRight } from 'lucide-react';
import newsTraining from '../assets/news_training.png';
import newsChampionship from '../assets/news_championship.png';
import '../styles/components/NewsEvents.css';

const NewsEvents = () => {
    const news = [
        {
            id: 1,
            title: 'India in WSF Squash World Cup final',
            date: 'Dec 14, 2025',
            image: newsChampionship,
            type: 'News',
            desc: 'India beat Egypt to reach the squash world cup final.',
            link: 'https://timesofindia.indiatimes.com/sports/more-sports/others/wsf-world-cup-india-beat-egypt-to-reach-squash-world-cup-final/articleshow/125958677.cms'
        },
        {
            id: 2,
            title: 'Sansad Khel Mahotsav polo match result',
            date: 'Dec 14, 2025',
            image: newsTraining,
            type: 'News',
            desc: 'Kurukshetra beats Kaithal in a competitive polo fixture.',
            link: 'https://timesofindia.indiatimes.com/city/chandigarh/sansad-khel-mahotsav-kurukshetra-polo-team-beats-kaithal/articleshow/125952436.cms'
        },
        {
            id: 3,
            title: 'Indian cricket team 2025 international schedule',
            date: 'Dec 14, 2025',
            image: newsChampionship,
            type: 'Event',
            desc: 'Upcoming tours and dates for the Indian cricket team.',
            link: 'https://www.olympics.com/en/news/indian-cricket-team-2025-calendar-schedule-dates'
        },
        {
            id: 4,
            title: 'Lionel Messi in India',
            date: 'Dec 14, 2025',
            image: newsTraining,
            type: 'Event',
            desc: 'Live updates from Kolkata & Hyderabad football event.',
            link: 'https://www.amarujala.com/live/sports/football/lionel-messi-in-india-live-updates-kolkata-hyderabad-messi-live-updates'
        },
        {
            id: 5,
            title: 'Tributes to India Women\'s Cricket Team',
            date: 'Nov 3, 2025',
            image: newsChampionship,
            type: 'News',
            desc: 'National reaction after World Cup win.',
            link: 'https://www.aljazeera.com/sports/2025/11/3/narendra-modi-leads-tributes-to-womens-cricket-team-after-world-cup-win'
        },
        {
            id: 6,
            title: 'Women\'s ODI World Cup 2025: India v Pakistan',
            date: 'Dec 14, 2025',
            image: newsTraining,
            type: 'Event',
            desc: 'Live scores and updates during the match.',
            link: 'https://www.abplive.com/sports/cricket/ind-w-vs-pak-w-live-score-women-odi-world-cup-2025-india-vs-pakistan-cricket-match-scorecard-live-updates-harmanpreet-kaur-smriti-mandhana-3023691'
        },
        {
            id: 7,
            title: 'Cricket highlights: India Women v South Africa final',
            date: 'Dec 14, 2025',
            image: newsChampionship,
            type: 'News',
            desc: 'Match highlights and scorecard from the final.',
            link: 'https://hindi.news24online.com/sports-news/cricket/ind-w-vs-sa-w-final-live-cricket-score-and-updates-women-world-cup-2025-india-women-vs-australia-women-match-full-scorecard-dy-patil-mumbai-harmanpreet-kaur-laura-wolvaardt/1374222/'
        },
        {
            id: 8,
            title: 'SAAF Championships',
            date: 'Dec 14, 2025',
            image: newsTraining,
            type: 'News',
            desc: 'India bagged multiple medals at the South Asian Athletics meet.',
            link: 'https://timesofindia.indiatimes.com/sports/more-sports/saaf-championships-india-wins-7-gold-on-day-2/articleshow/124822775.cms'
        },
        {
            id: 9,
            title: 'Junior Women\'s Hockey World Cup',
            date: 'Dec 14, 2025',
            image: newsChampionship,
            type: 'News',
            desc: 'India beat Namibia 13-0 in the tournament.',
            link: 'https://navbharattimes.indiatimes.com/sports/hockey/news/india-beat-namibia-by13-0-in-junior-women-hockey-world-cup-2025-hina-bano-kanika-siwach-scored-hattricks/articleshow/125707233.cms'
        },
        {
            id: 10,
            title: 'India women\'s hockey Asia Cup final',
            date: 'Dec 14, 2025',
            image: newsTraining,
            type: 'News',
            desc: 'Runner-up finish for India in the Asia Cup.',
            link: 'https://www.ibc24.in/sport/womens-hockey-asia-cup-india-womens-team-was-runner-up-in-asia-cup-china-defeated-them-4-1-in-the-final-3252299.html'
        },
        {
            id: 11,
            title: 'India\'s first pro basketball league',
            date: 'Dec 14, 2025',
            image: newsChampionship,
            type: 'Event',
            desc: 'BFI + ACG Sports launch professional league for men and women.',
            link: 'https://www.business-standard.com/sports/other-sports-news/bfi-acg-unveil-india-s-first-pro-basketball-league-for-men-and-women-125060700324_1.html'
        },
        {
            id: 12,
            title: '2025 National Games of India',
            date: 'Dec 14, 2025',
            image: newsTraining,
            type: 'Event',
            desc: 'Multi-sport National Games hosted across Uttarakhand.',
            link: 'https://en.wikipedia.org/wiki/2025_National_Games_of_India'
        },
        {
            id: 13,
            title: 'India Women\'s Cricket Team World Cup Win',
            date: 'Nov 3, 2025',
            image: newsChampionship,
            type: 'News',
            desc: 'Watch the highlights on YouTube.',
            link: 'https://www.youtube.com/watch?v=Up_i0vku1e0'
        }
    ];

    return (
        <div className="news-container">
            <h2 className="section-title">News & Events</h2>

            <div className="news-grid">
                {news.map(item => (
                    <div key={item.id} className="news-card">
                        <div className="news-image">
                            <img src={item.image} alt={item.title} />
                            <span className="news-tag">{item.type}</span>
                        </div>
                        <div className="news-content">
                            <div className="news-date">
                                <Calendar size={14} /> {item.date}
                            </div>
                            <h3 className="news-title">{item.title}</h3>
                            <p className="news-desc">{item.desc}</p>
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="btn-ticket">
                                {item.type === 'Event' ? 'Get Tickets' : 'Read Full Story'} <ArrowRight size={16} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsEvents;
