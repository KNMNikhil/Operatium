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
  const [isSharkTank, setIsSharkTank] = useState(false);
  const [isInvestorLens, setIsInvestorLens] = useState(false);
  const [includeRedTeam, setIncludeRedTeam] = useState(false);
  const [capital, setCapital] = useState('');
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

      let execs = [...selectedExecs];
      if (includeRedTeam) {
        execs.push("Red Team (Devil's Advocate)");
      }

      const types = [];
      if (isSharkTank) types.push('shark_tank');
      if (isInvestorLens) types.push('investor_lens');
      const finalMeetingType = types.length > 0 ? types.join(',') : 'full_board';

      const startup = await api.createStartup({
        name,
        description: `${description}\n\n[CAPITAL: ${capital || 'Unknown'}]`,
        industry: combinedIndustry,
        executives: execs,
      });

      addStartup(startup);
      setIdea(name, description);

      const meeting = await api.createMeeting({
        startup_id: startup.id,
        meeting_type: finalMeetingType,
        executives: execs,
      });

      navigate(`/?meetingId=${meeting.id}&startup_id=${startup.id}&startup_name=${encodeURIComponent(name)}&description=${encodeURIComponent(description)}&industry=${encodeURIComponent(combinedIndustry)}&execs=${encodeURIComponent(execs.join(','))}`);
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



      <motion.div key="step1"
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        style={{
          background: '#FFF4E9', border: '2px solid #000', borderRadius: 16,
          padding: '32px 40px', width: 600, boxShadow: '6px 6px 0 #000',
          transform: 'rotate(-0.5deg)',
        }}
      >
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 4 }}>Your Startup Idea</h1>
        <p style={{ fontSize: 18, color: 'rgba(0,0,0,0.6)', marginBottom: 20 }}>Tell the boardroom what you're building.</p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 18, fontWeight: 700, display: 'block', marginBottom: 4 }}>Startup Name</label>
          <input
            value={name} onChange={e => setName(e.target.value)}
            placeholder="e.g. TravelMind AI"
            style={{
              width: '100%', border: '2px solid #000', borderRadius: 8, padding: '10px 14px',
              fontSize: 18, fontFamily: "'Caveat', cursive", background: 'transparent',
              outline: 'none', boxSizing: 'border-box',
              color: '#000',
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
            <label style={{ fontSize: 18, fontWeight: 700, display: 'block' }}>Description</label>
            <span style={{ fontSize: 14, color: 'rgba(0,0,0,0.5)' }}>Max 10,000 chars</span>
          </div>
          <textarea
            value={description} onChange={e => setDescription(e.target.value)}
            placeholder="e.g. An AI-powered travel planner that builds personalized itineraries..."
            rows={3}
            style={{
              width: '100%', border: '2px solid #000', borderRadius: 8, padding: '10px 14px',
              fontSize: 18, fontFamily: "'Caveat', cursive", background: 'transparent',
              outline: 'none', resize: 'none', boxSizing: 'border-box',
              color: '#000',
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 18, fontWeight: 700, display: 'block', marginBottom: 4 }}>Industry (Select up to 3)</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'nowrap' }}>
            <select
              value={industryPrimary} onChange={e => setIndustryPrimary(e.target.value)}
              style={{
                flex: '1', border: '2px solid #000', borderRadius: 8, padding: '8px 10px',
                fontSize: 16, fontFamily: "'Caveat', cursive", background: 'transparent',
                outline: 'none', color: '#000', cursor: 'pointer', appearance: 'none'
              }}
            >
              <option value="" disabled>Primary (Required)</option>
              {INDUSTRIES.map(ind => <option key={ind} value={ind} disabled={ind === industrySecondary || ind === industryThird}>{ind}</option>)}
            </select>

            <select
              value={industrySecondary} onChange={e => setIndustrySecondary(e.target.value)}
              style={{
                flex: '1', border: '2px solid #000', borderRadius: 8, padding: '8px 10px',
                fontSize: 16, fontFamily: "'Caveat', cursive", background: 'transparent',
                outline: 'none', color: '#000', cursor: 'pointer', appearance: 'none'
              }}
            >
              <option value="" disabled>Secondary (Required)</option>
              {INDUSTRIES.map(ind => <option key={ind} value={ind} disabled={ind === industryPrimary || ind === industryThird}>{ind}</option>)}
            </select>

            <select
              value={industryThird} onChange={e => setIndustryThird(e.target.value)}
              style={{
                flex: '1', border: '2px solid #000', borderRadius: 8, padding: '8px 10px',
                fontSize: 16, fontFamily: "'Caveat', cursive", background: 'transparent',
                outline: 'none', color: '#000', cursor: 'pointer', appearance: 'none'
              }}
            >
              <option value="">Third (Optional)</option>
              {INDUSTRIES.map(ind => <option key={ind} value={ind} disabled={ind === industryPrimary || ind === industrySecondary}>{ind}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 18, fontWeight: 700, display: 'block', marginBottom: 4 }}>Initial Capital / Runway</label>
            <input
              value={capital} onChange={e => setCapital(e.target.value)}
              placeholder="e.g. $50k or 6 months"
              style={{
                width: '100%', border: '2px solid #000', borderRadius: 8, padding: '10px 14px',
                fontSize: 16, fontFamily: "'Caveat', cursive", background: 'transparent',
                outline: 'none', boxSizing: 'border-box', color: '#000',
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 20, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', flex: 1, minWidth: '200px' }}>
            <div style={{ position: 'relative', width: 40, height: 22 }}>
              <input type="checkbox" checked={isSharkTank} onChange={e => setIsSharkTank(e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: isSharkTank ? '#ef4444' : 'rgba(0,0,0,0.2)', transition: '.4s', borderRadius: 34, border: '2px solid #000' }}>
                <span style={{ position: 'absolute', height: 14, width: 14, left: 2, bottom: 2, backgroundColor: 'white', transition: '.4s', borderRadius: '50%', transform: isSharkTank ? 'translateX(18px)' : 'translateX(0)', border: '2px solid #000' }} />
              </span>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: isSharkTank ? '#ef4444' : '#000' }}>🦈 Shark Tank</div>
              <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.6)' }}>Hostile board</div>
            </div>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', flex: 1, minWidth: '200px' }}>
            <div style={{ position: 'relative', width: 40, height: 22 }}>
              <input type="checkbox" checked={isInvestorLens} onChange={e => setIsInvestorLens(e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: isInvestorLens ? '#10b981' : 'rgba(0,0,0,0.2)', transition: '.4s', borderRadius: 34, border: '2px solid #000' }}>
                <span style={{ position: 'absolute', height: 14, width: 14, left: 2, bottom: 2, backgroundColor: 'white', transition: '.4s', borderRadius: '50%', transform: isInvestorLens ? 'translateX(18px)' : 'translateX(0)', border: '2px solid #000' }} />
              </span>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: isInvestorLens ? '#10b981' : '#000' }}>💰 Investor Lens</div>
              <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.6)' }}>VC perspective</div>
            </div>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', flex: 1, minWidth: '200px' }}>
            <div style={{ position: 'relative', width: 40, height: 22 }}>
              <input type="checkbox" checked={includeRedTeam} onChange={e => setIncludeRedTeam(e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: includeRedTeam ? '#8b5cf6' : 'rgba(0,0,0,0.2)', transition: '.4s', borderRadius: 34, border: '2px solid #000' }}>
                <span style={{ position: 'absolute', height: 14, width: 14, left: 2, bottom: 2, backgroundColor: 'white', transition: '.4s', borderRadius: '50%', transform: includeRedTeam ? 'translateX(18px)' : 'translateX(0)', border: '2px solid #000' }} />
              </span>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: includeRedTeam ? '#8b5cf6' : '#000' }}>👹 Red Team</div>
              <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.6)' }}>Devil's Advocate</div>
            </div>
          </label>
        </div>

        {error && <p style={{ color: '#c0392b', fontSize: 16, marginBottom: 12 }}>{error}</p>}

        <button onClick={handleNext} disabled={isLoading} style={{
          width: '100%', padding: '12px', background: '#000', color: '#FFF4E9',
          border: '2px solid #000', borderRadius: 8, fontSize: 20, fontWeight: 700,
          fontFamily: "'Caveat', cursive", cursor: isLoading ? 'wait' : 'pointer',
          boxShadow: '4px 4px 0 rgba(0,0,0,0.3)', transition: 'transform 0.1s',
          opacity: isLoading ? 0.7 : 1,
        }}>
          {isLoading ? 'Calling the board...' : 'Launch Meeting →'}
        </button>
      </motion.div>
    </div>
  );
}
