'use client';
import { useState } from 'react';

const DOCTORS = [
  { id: 1, name: 'Dr. Priya Sharma', specialty: 'Gynecologist', experience: '15 years', rating: 4.8, available: true, image: '👩‍⚕️' },
  { id: 2, name: 'Dr. Anjali Gupta', specialty: 'PCOS Specialist', experience: '12 years', rating: 4.9, available: true, image: '👩‍⚕️' },
  { id: 3, name: 'Dr. Meera Patel', specialty: 'Fertility Expert', experience: '18 years', rating: 4.7, available: false, image: '👩‍⚕️' },
  { id: 4, name: 'Dr. Kavita Reddy', specialty: 'Obstetrician', experience: '10 years', rating: 4.6, available: true, image: '👩‍⚕️' },
];

export default function DoctorsPage() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [inCall, setInCall] = useState(false);

  const startCall = (doctor) => {
    setSelectedDoctor(doctor);
    setInCall(true);
  };

  if (inCall && selectedDoctor) {
    const roomId = `sakhi-consult-${selectedDoctor.id}-${Date.now()}`;
    return (
      <>
        <style jsx global>{`
          .doctors-page { min-height: 100vh; background: linear-gradient(135deg, #f3e8ff, #fce7f3); display: flex; flex-direction: column; }
          .doctors-header { background: linear-gradient(135deg, #6b21a8, #9333ea); padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 10px rgba(107,33,168,0.3); }
          .header-left { display: flex; align-items: center; gap: 12px; }
          .header-left img { height: 40px; }
          .header-left span { color: white; font-size: 20px; font-weight: bold; }
          .back-btn { background: rgba(255,255,255,0.2); color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-size: 14px; }
          .call-container { flex: 1; padding: 16px; }
          .call-frame { width: 100%; height: calc(100vh - 100px); border: none; border-radius: 16px; }
          @media (max-width: 768px) {
            .doctors-header { padding: 12px 16px; }
            .header-left span { font-size: 16px; }
            .header-left img { height: 32px; }
            .back-btn { padding: 6px 12px; font-size: 12px; }
            .call-container { padding: 8px; }
          }
        `}</style>
        <div className="doctors-page">
          <header className="doctors-header">
            <div className="header-left">
              <img src="/sakhi-logo.png" alt="Sakhi" />
              <span>Talk to Doctor</span>
            </div>
            <a href="/" className="back-btn">← Back to Chat</a>
          </header>
          <div className="call-container">
            <iframe
              src={`https://meet.jit.si/${roomId}`}
              className="call-frame"
              allow="camera; microphone; fullscreen; display-capture"
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style jsx global>{`
        .doctors-page { min-height: 100vh; background: linear-gradient(135deg, #f3e8ff, #fce7f3); display: flex; flex-direction: column; }
        .doctors-header { background: linear-gradient(135deg, #6b21a8, #9333ea); padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 10px rgba(107,33,168,0.3); }
        .header-left { display: flex; align-items: center; gap: 12px; }
        .header-left img { height: 40px; }
        .header-left span { color: white; font-size: 20px; font-weight: bold; }
        .back-btn { background: rgba(255,255,255,0.2); color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-size: 14px; }
        .doctors-title { padding: 20px 24px; text-align: center; }
        .doctors-title h1 { font-size: 24px; font-weight: bold; color: #4a1a6b; margin: 0; }
        .doctors-title p { color: #666; font-size: 14px; margin-top: 8px; }
        .doctors-grid { flex: 1; padding: 0 24px 24px; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        .doctor-card { background: rgba(255,248,240,0.95); border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .doctor-top { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .doctor-avatar { font-size: 48px; }
        .doctor-name { margin: 0; font-size: 16px; font-weight: bold; color: #333; }
        .doctor-specialty { margin: 4px 0 0; font-size: 13px; color: #6b21a8; font-weight: 500; }
        .doctor-info { display: flex; justify-content: space-between; font-size: 13px; color: #666; margin-bottom: 12px; }
        .doctor-actions { display: flex; align-items: center; justify-content: space-between; }
        .status-available { font-size: 12px; color: #16a34a; font-weight: 500; }
        .status-busy { font-size: 12px; color: #dc2626; font-weight: 500; }
        .call-btn { background: #6b21a8; color: white; padding: 10px 16px; border-radius: 8px; border: none; font-weight: 600; font-size: 13px; cursor: pointer; }
        .call-btn:disabled { background: #ccc; cursor: not-allowed; }
        .doctors-footer { padding: 16px 24px; text-align: center; }
        .doctors-footer p { font-size: 12px; color: #666; }
        
        @media (max-width: 768px) {
          .doctors-header { padding: 12px 16px; flex-wrap: wrap; gap: 10px; }
          .header-left span { font-size: 16px; }
          .header-left img { height: 32px; }
          .back-btn { padding: 6px 12px; font-size: 12px; }
          .doctors-title { padding: 16px; }
          .doctors-title h1 { font-size: 20px; }
          .doctors-grid { padding: 0 16px 16px; grid-template-columns: 1fr; }
          .doctor-card { padding: 16px; }
          .doctor-avatar { font-size: 40px; }
          .doctor-name { font-size: 15px; }
        }
      `}</style>
      <div className="doctors-page">
        <header className="doctors-header">
          <div className="header-left">
            <img src="/sakhi-logo.png" alt="Sakhi" />
            <span>Talk to Doctor</span>
          </div>
          <a href="/" className="back-btn">← Back to Chat</a>
        </header>

        <div className="doctors-title">
          <h1>👩‍⚕️ Talk to Doctor</h1>
          <p>Consult with women health specialists via video call</p>
        </div>

        <div className="doctors-grid">
          {DOCTORS.map(doc => (
            <div key={doc.id} className="doctor-card">
              <div className="doctor-top">
                <span className="doctor-avatar">{doc.image}</span>
                <div>
                  <h3 className="doctor-name">{doc.name}</h3>
                  <p className="doctor-specialty">{doc.specialty}</p>
                </div>
              </div>
              <div className="doctor-info">
                <span>📅 {doc.experience}</span>
                <span>⭐ {doc.rating}</span>
              </div>
              <div className="doctor-actions">
                <span className={doc.available ? 'status-available' : 'status-busy'}>
                  {doc.available ? '🟢 Available Now' : '🔴 Busy'}
                </span>
                <button
                  onClick={() => startCall(doc)}
                  disabled={!doc.available}
                  className="call-btn"
                >
                  📹 Start Call
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="doctors-footer">
          <p>🔒 Free consultation for Sakhi users. Calls are private and secure.</p>
        </div>
      </div>
    </>
  );
}
