import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { useStartupStore } from '../store/useStartupStore';
import { useMeetingStore } from '../store/useMeetingStore';

const ALL_EXECUTIVES = [
  { id: 'CEO', desc: 'Vision & Strategy' },
  { id: 'CTO', desc: 'Tech & Architecture' },
  { id: 'Product Manager', desc: 'Roadmap & MVP' },
  { id: 'Product Designer', desc: 'UX & Flows' },
  { id: 'Growth & Marketing', desc: 'Launch & Growth' },
  { id: 'Finance & Operations', desc: 'Costs & Revenue' },
  { id: 'Investor & Risk Advisor', desc: 'Risk & Investment' },
];

const INDUSTRIES = [
  'SaaS', 'Marketplace', 'Consumer App', 'FinTech', 'HealthTech',
  'EdTech', 'AI / ML', 'E-commerce', 'Social Network', 'Developer Tools',
  'Climate Tech', 'Enterprise Software', 'Gaming', 'Media & Entertainment',
  'BioTech', 'Hardware', 'Robotics', 'SpaceTech', 'Web3 / Crypto', 'Cybersecurity',
  'Logistics', 'PropTech', 'Other',
];

type Step = 1 | 2 | 3;

export function NewStartupPage() {
  const navigate = useNavigate();
  const { addStartup } = useStartupStore();
  const { setIdea } = useMeetingStore();

  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [industryPrimary, setIndustryPrimary] = useState('');
  const [industrySecondary, setIndustrySecondary] = useState('');
  const [industryThird, setIndustryThird] = useState('');
  const [meetingType, setMeetingType] = useState<'full_board' | 'custom'>('full_board');
  const [selectedExecs, setSelectedExecs] = useState<string[]>(ALL_EXECUTIVES.map(e => e.id));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleExec = (id: string) => {
    setSelectedExecs(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleNext = async () => {
    if (!name.trim() || !description.trim() || !industryPrimary || !industrySecondary) {
      setError('Please fill in all required fields (Name, Description, Primary, and Secondary Industry).');
      return;
    }
    setError('');
    await handleLaunch();
  };

  const handleLaunch = async () => {
    if (selectedExecs.length < 1) {
      setError('Select at least one executive.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const combinedIndustry = [industryPrimary, industrySecondary, industryThird].filter(Boolean).join(', ');

      const startup = await api.createStartup({
        name,
        description,
        industry: combinedIndustry,
        executives: selectedExecs,
      });

      addStartup(startup);
      setIdea(name, description);

      const meeting = await api.createMeeting({
        startup_id: startup.id,
        meeting_type: meetingType,
        executives: selectedExecs,
      });

      navigate(`/?meetingId=${meeting.id}&startup_id=${startup.id}&startup_name=${encodeURIComponent(name)}&description=${encodeURIComponent(description)}&industry=${encodeURIComponent(combinedIndustry)}&execs=${encodeURIComponent(selectedExecs.join(','))}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create startup. Check if the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', boxSizing: 'border-box', overflowX: 'hidden',
      background: '#FFF4E9',
      backgroundImage: `linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)`,
      backgroundSize: '40px 40px',
      fontFamily: "'Caveat', cursive",
      color: '#000',
    }}>

      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute', top: 24, left: 24,
          background: 'transparent', border: '2px solid #000', borderRadius: 8,
          padding: '6px 16px', cursor: 'pointer', fontSize: 18,
          fontFamily: "'Caveat', cursive", fontWeight: 600,
          boxShadow: '3px 3px 0 #000',
          transform: 'rotate(-1deg)',
          color: '#000',
        }}
      >
        ← Back
      </button>



      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1"
            initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35 }}
            style={{
              background: '#FFF4E9', border: '2px solid #000', borderRadius: 16,
              padding: '48px 56px', width: 560, boxShadow: '6px 6px 0 #000',
              transform: 'rotate(-0.5deg)', maxHeight: '85vh', overflowY: 'auto',
            }}
          >
            <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>Your Startup Idea</h1>
            <p style={{ fontSize: 20, color: 'rgba(0,0,0,0.6)', marginBottom: 32 }}>Tell the boardroom what you're building.</p>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 20, fontWeight: 700, display: 'block', marginBottom: 8 }}>Startup Name</label>
              <input
                value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. TravelMind AI"
                style={{
                  width: '100%', border: '2px solid #000', borderRadius: 8, padding: '12px 16px',
                  fontSize: 22, fontFamily: "'Caveat', cursive", background: 'transparent',
                  outline: 'none', boxSizing: 'border-box',
                  color: '#000',
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <label style={{ fontSize: 20, fontWeight: 700, display: 'block' }}>Description</label>
                <span style={{ fontSize: 14, color: 'rgba(0,0,0,0.5)' }}>Max 10,000 chars (~1,500 words)</span>
              </div>
              <textarea
                value={description} onChange={e => setDescription(e.target.value)}
                placeholder="e.g. An AI-powered travel planner that builds personalized itineraries based on your budget, preferences, and travel style."
                rows={4}
                style={{
                  width: '100%', border: '2px solid #000', borderRadius: 8, padding: '12px 16px',
                  fontSize: 20, fontFamily: "'Caveat', cursive", background: 'transparent',
                  outline: 'none', resize: 'none', boxSizing: 'border-box',
                  color: '#000',
                }}
              />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 20, fontWeight: 700, display: 'block', marginBottom: 8 }}>Industry (Select up to 3)</label>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <select
                  value={industryPrimary} onChange={e => setIndustryPrimary(e.target.value)}
                  style={{
                    flex: '1 1 140px', border: '2px solid #000', borderRadius: 8, padding: '12px 16px',
                    fontSize: 20, fontFamily: "'Caveat', cursive", background: 'transparent',
                    outline: 'none', color: '#000', cursor: 'pointer', appearance: 'none', minWidth: '140px'
                  }}
                >
                  <option value="" disabled>Primary (Required)</option>
                  {INDUSTRIES.map(ind => <option key={ind} value={ind} disabled={ind === industrySecondary || ind === industryThird}>{ind}</option>)}
                </select>

                <select
                  value={industrySecondary} onChange={e => setIndustrySecondary(e.target.value)}
                  style={{
                    flex: '1 1 140px', border: '2px solid #000', borderRadius: 8, padding: '12px 16px',
                    fontSize: 20, fontFamily: "'Caveat', cursive", background: 'transparent',
                    outline: 'none', color: '#000', cursor: 'pointer', appearance: 'none', minWidth: '140px'
                  }}
                >
                  <option value="" disabled>Secondary (Required)</option>
                  {INDUSTRIES.map(ind => <option key={ind} value={ind} disabled={ind === industryPrimary || ind === industryThird}>{ind}</option>)}
                </select>

                <select
                  value={industryThird} onChange={e => setIndustryThird(e.target.value)}
                  style={{
                    flex: '1 1 140px', border: '2px solid #000', borderRadius: 8, padding: '12px 16px',
                    fontSize: 20, fontFamily: "'Caveat', cursive", background: 'transparent',
                    outline: 'none', color: '#000', cursor: 'pointer', appearance: 'none', minWidth: '140px'
                  }}
                >
                  <option value="">Third (Optional)</option>
                  {INDUSTRIES.map(ind => <option key={ind} value={ind} disabled={ind === industryPrimary || ind === industrySecondary}>{ind}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                <div style={{ position: 'relative', width: 50, height: 28 }}>
                  <input 
                    type="checkbox" 
                    checked={meetingType === 'shark_tank'} 
                    onChange={e => setMeetingType(e.target.checked ? 'shark_tank' : 'full_board')} 
                    style={{ opacity: 0, width: 0, height: 0 }} 
                  />
                  <span style={{
                    position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: meetingType === 'shark_tank' ? '#ef4444' : 'rgba(0,0,0,0.2)',
                    transition: '.4s', borderRadius: 34,
                    border: '2px solid #000',
                  }}>
                    <span style={{
                      position: 'absolute', height: 20, width: 20, left: 2, bottom: 2,
                      backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                      transform: meetingType === 'shark_tank' ? 'translateX(22px)' : 'translateX(0)',
                      border: '2px solid #000'
                    }} />
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: meetingType === 'shark_tank' ? '#ef4444' : '#000' }}>
                    🦈 Shark Tank Mode
                  </div>
                  <div style={{ fontSize: 16, color: 'rgba(0,0,0,0.6)' }}>
                    Warning: Executives will be extremely hostile, skeptical, and demanding.
                  </div>
                </div>
              </label>
            </div>

            {error && <p style={{ color: '#c0392b', fontSize: 18, marginBottom: 12 }}>{error}</p>}

            <button onClick={handleNext} disabled={isLoading} style={{
              width: '100%', padding: '14px', background: '#000', color: '#FFF4E9',
              border: '2px solid #000', borderRadius: 8, fontSize: 22, fontWeight: 700,
              fontFamily: "'Caveat', cursive", cursor: isLoading ? 'wait' : 'pointer',
              boxShadow: '4px 4px 0 rgba(0,0,0,0.3)', transition: 'transform 0.1s',
              opacity: isLoading ? 0.7 : 1,
            }}>
              {isLoading ? 'Calling the board...' : 'Launch Meeting →'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
