'use client';
import { useState } from 'react';
import Link from 'next/link';

const TOPICS = ['All', 'PCOS', 'Pregnancy', 'Menopause', 'Wellness'];

export default function ForumPage() {
  const [filter, setFilter] = useState('All');
  const [threads, setThreads] = useState([
    { id: 1, title: 'PCOS diet tips that actually worked', content: 'After 2 years of trying everything, I finally found what works for me. Low carb + walking 30 mins daily changed my life...', category: 'PCOS', votes: 42, replies: 8, time: '2h' },
    { id: 2, title: 'First trimester - feeling scared', content: 'Just found out Im pregnant. Mixed emotions - excited but terrified. Any advice from experienced moms?', category: 'Pregnancy', votes: 28, replies: 15, time: '4h' },
    { id: 3, title: 'Hot flashes at night - need help!', content: 'Im 48 and these hot flashes are ruining my sleep. Tried everything. What worked for you ladies?', category: 'Menopause', votes: 35, replies: 12, time: '1d' },
    { id: 4, title: 'Balancing work and new baby', content: 'Going back to work after maternity leave. Feeling guilty and overwhelmed. How do you cope?', category: 'Wellness', votes: 56, replies: 23, time: '5h' }
  ]);
  const [selected, setSelected] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const filtered = filter === 'All' ? threads : threads.filter(t => t.category === filter);

  const upvote = (id) => setThreads(p => p.map(t => t.id === id ? { ...t, votes: t.votes + 1 } : t));

  const submit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setThreads(p => [{ id: Date.now(), title: newTitle, content: newContent, category: 'PCOS', votes: 1, replies: 0, time: 'now' }, ...p]);
    setNewTitle(''); setNewContent(''); setShowNew(false);
  };

  return (
    <>
      <style jsx global>{`
        .forum-page { min-height: 100vh; background: #FDF2F8; }
        .forum-nav { background: linear-gradient(135deg, #6B21A8, #9333EA); padding: 16px 24px; display: flex; justify-content: space-between; align-items: center;  }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .logo-img { width: 36px; height: 36px; }
        .logo-text { font-size: 24px; font-weight: 800; color: white; font-family: Georgia, serif; }
        .page-title { font-size: 24px; font-weight: 700; color: white; }
        .new-btn { background: white; color: #9333EA; border: none; padding: 10px 20px; border-radius: 25px; font-weight: 600; font-size: 14px; cursor: pointer; }
        .forum-content { padding: 20px 24px; }
        .forum-banner { background: linear-gradient(135deg, #6B21A8, #9333EA); padding: 25px 30px; border-radius: 16px; color: white; margin-bottom: 20px; }
        .forum-banner h2 { font-size: 22px; font-weight: 700; margin-bottom: 5px; }
        .forum-banner p { opacity: 0.85; font-size: 14px; }
        .topic-row { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 15px; margin-bottom: 20px; }
        .topic-btn { padding: 10px 20px; border-radius: 25px; border: 1px solid #E5E7EB; background: white; font-size: 14px; font-weight: 500; cursor: pointer; white-space: nowrap; color: #6B7280; }
        .topic-btn.active { background: #9333EA; color: white; border-color: #9333EA; }
        .thread-list { display: flex; flex-direction: column; gap: 14px; }
        .thread-card { background: white; border-radius: 14px; padding: 18px; border: 1px solid #F3E8FF; display: flex; gap: 14px; cursor: pointer; transition: box-shadow 0.2s; }
        .thread-card:hover { box-shadow: 0 4px 15px rgba(147, 51, 234, 0.1); }
        .vote-box { display: flex; flex-direction: column; align-items: center; gap: 5px; min-width: 50px; }
        .vote-btn { background: #F3E8FF; border: none; padding: 8px 12px; border-radius: 10px; cursor: pointer; color: #9333EA; font-weight: 600; font-size: 14px; }
        .vote-btn:hover { background: #9333EA; color: white; }
        .vote-num { font-weight: 700; color: #9333EA; font-size: 16px; }
        .thread-body { flex: 1; min-width: 0; }
        .thread-meta { display: flex; gap: 10px; font-size: 12px; color: #9CA3AF; margin-bottom: 8px; align-items: center; }
        .thread-cat { background: #F3E8FF; color: #9333EA; padding: 3px 10px; border-radius: 12px; font-weight: 600; font-size: 11px; }
        .thread-title { font-weight: 600; color: #1F2937; margin-bottom: 8px; font-size: 16px; }
        .thread-preview { color: #6B7280; font-size: 14px; line-height: 1.6; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .thread-stats { font-size: 13px; color: #9CA3AF; }
        .new-form { background: white; border-radius: 14px; padding: 18px; margin-bottom: 18px; border: 1px solid #F3E8FF; }
        .new-input { width: 100%; padding: 12px 16px; border: 1px solid #E5E7EB; border-radius: 10px; margin-bottom: 12px; font-size: 15px; }
        .new-input:focus { outline: none; border-color: #9333EA; }
        .new-textarea { width: 100%; padding: 12px 16px; border: 1px solid #E5E7EB; border-radius: 10px; margin-bottom: 12px; height: 100px; font-size: 15px; resize: vertical; }
        .submit-btn { background: #9333EA; color: white; border: none; padding: 12px 24px; border-radius: 25px; font-weight: 600; cursor: pointer; font-size: 14px; }
        .modal { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
        .modal-box { background: white; width: 100%; max-width: 600px; border-radius: 18px; max-height: 85vh; overflow: hidden; display: flex; flex-direction: column; }
        .modal-head { padding: 18px 20px; border-bottom: 1px solid #F3E8FF; display: flex; justify-content: space-between; align-items: center; }
        .modal-body { padding: 24px; overflow-y: auto; flex: 1; }
        .modal-title { font-size: 20px; font-weight: 700; color: #1F2937; margin-bottom: 14px; }
        .modal-content { color: #4B5563; line-height: 1.8; background: #FAFAFA; padding: 18px; border-radius: 12px; border-left: 4px solid #9333EA; }
        .modal-foot { padding: 14px 20px; border-top: 1px solid #F3E8FF; display: flex; gap: 12px; }
        .reply-input { flex: 1; padding: 12px 16px; border: 1px solid #E5E7EB; border-radius: 25px; font-size: 14px; }
        .reply-btn { background: #9333EA; color: white; border: none; padding: 12px 22px; border-radius: 25px; font-weight: 600; cursor: pointer; }
        .close-x { background: none; border: none; font-size: 24px; color: #9CA3AF; cursor: pointer; }
        
        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .forum-nav { padding: 12px 16px; flex-wrap: wrap; gap: 10px; }
          .page-title { font-size: 18px; }
          .logo-text { font-size: 20px; }
          .new-btn { padding: 8px 14px; font-size: 12px; }
          .forum-content { padding: 16px; }
          .forum-banner { padding: 18px 20px; }
          .forum-banner h2 { font-size: 18px; }
          .thread-card { padding: 14px; flex-direction: column; gap: 10px; }
          .vote-box { flex-direction: row; gap: 10px; }
          .thread-title { font-size: 14px; }
          .thread-preview { font-size: 13px; }
          .modal-box { max-width: 95%; border-radius: 14px; }
          .reply-input { padding: 10px 14px; font-size: 13px; }
          .reply-btn { padding: 10px 16px; font-size: 13px; }
        }
      `}</style>

      <div className="forum-page">
        <nav className="forum-nav">
          <Link href="/" className="nav-logo">
            <img src="/sakhi-logo.png" alt="Sakhi" className="logo-img" onError={(e) => e.target.style.display = 'none'} />
            <span className="logo-text">Sakhi</span>
          </Link>
          <span className="page-title">Community</span>
          <button className="new-btn" onClick={() => setShowNew(!showNew)}>+ New Post</button>
        </nav>

        <div className="forum-content">
          <div className="forum-banner">
            <h2> Welcome, Sister!</h2>
            <p>Anonymous  Safe space  Support each other</p>
          </div>

          <div className="topic-row">
            {TOPICS.map(t => <button key={t} className={`topic-btn ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>{t}</button>)}
          </div>

          {showNew && (
            <form className="new-form" onSubmit={submit}>
              <input className="new-input" placeholder="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
              <textarea className="new-textarea" placeholder="Share your experience..." value={newContent} onChange={e => setNewContent(e.target.value)} />
              <button type="submit" className="submit-btn">Post Anonymously </button>
            </form>
          )}

          <div className="thread-list">
            {filtered.map(t => (
              <div key={t.id} className="thread-card" onClick={() => setSelected(t)}>
                <div className="vote-box">
                  <button className="vote-btn" onClick={e => { e.stopPropagation(); upvote(t.id); }}>⬆️</button>
                  <span className="vote-num">{t.votes}</span>
                </div>
                <div className="thread-body">
                  <div className="thread-meta"><span className="thread-cat">{t.category}</span><span>{t.time}</span></div>
                  <div className="thread-title">{t.title}</div>
                  <div className="thread-preview">{t.content}</div>
                  <div className="thread-stats"> {t.replies} replies</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selected && (
          <div className="modal" onClick={() => setSelected(null)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <div className="modal-head"><span className="thread-cat">{selected.category}</span><button className="close-x" onClick={() => setSelected(null)}></button></div>
              <div className="modal-body">
                <h2 className="modal-title">{selected.title}</h2>
                <div className="modal-content">{selected.content}</div>
                <p style={{ marginTop: '14px', fontSize: '13px', color: '#9CA3AF' }}>Posted {selected.time} ago  {selected.replies} replies</p>
              </div>
              <div className="modal-foot">
                <input className="reply-input" placeholder="Share support..." />
                <button className="reply-btn">Reply</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}