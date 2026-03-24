import React, { useState, useEffect } from 'react';
import { Play, Square, Clock, Download, Plus } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';

export default function TimeTrackingPage() {
  const [isTracking, setIsTracking] = useState(false);
  const [time, setTime] = useState(0);
  const [entries, setEntries] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    let interval;
    if (isTracking) {
      interval = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const data = await apiServerClient.fetch('/time-tracking/entries', {
        method: 'POST',
        body: JSON.stringify({ admin_id: 'admin', date_range: {} })
      }).then(r => r.json());
      setEntries(data.entries || []);
    } catch (error) {
      console.error('Error fetching time entries:', error);
      // Mock data
      setEntries([
        { id: 1, date: new Date().toISOString(), project: 'Website Relaunch', duration_minutes: 120, notes: 'Design Review' },
        { id: 2, date: new Date(Date.now() - 86400000).toISOString(), project: 'SEO Optimierung', duration_minutes: 45, notes: 'Keyword Analyse' }
      ]);
    }
  };

  const toggleTimer = async () => {
    if (!isTracking) {
      try {
        const res = await apiServerClient.fetch('/time-tracking/start', {
          method: 'POST',
          body: JSON.stringify({ project_id: 'general', activity_description: description || 'Arbeit' })
        }).then(r => r.json());
        setSessionId(res.session_id);
        setIsTracking(true);
      } catch (e) {
        console.error(e);
        setIsTracking(true); // Fallback for UI
      }
    } else {
      try {
        if (sessionId) {
          await apiServerClient.fetch('/time-tracking/stop', {
            method: 'POST',
            body: JSON.stringify({ session_id: sessionId })
          });
        }
        setIsTracking(false);
        setTime(0);
        setDescription('');
        fetchEntries();
      } catch (e) {
        console.error(e);
        setIsTracking(false);
        setTime(0);
      }
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-serif text-[#e8e4df] mb-2 flex items-center gap-3">
            <Clock className="text-[#c4a850]" /> Zeiterfassung
          </h1>
          <p className="text-[#a8b0c5] font-sans text-sm">Projektzeiten tracken und auswerten.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#141210] border border-[rgba(196,168,80,0.2)] text-[#e8e4df] rounded-md hover:border-[#c4a850] transition-colors text-sm">
          <Download size={16} /> Export
        </button>
      </div>

      {/* Timer Widget */}
      <div className="bg-[#141210] border border-[rgba(196,168,80,0.12)] rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
        <input 
          type="text" 
          placeholder="Woran arbeitest du gerade?" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="flex-1 bg-[#0a0f0d] border border-[rgba(196,168,80,0.2)] rounded-md px-4 py-3 text-[#e8e4df] focus:outline-none focus:border-[#c4a850] w-full"
        />
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
          <div className="text-3xl font-mono text-[#e8e4df] tracking-wider">
            {formatTime(time)}
          </div>
          <button 
            onClick={toggleTimer}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isTracking ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-[#c4a850] text-[#0a0f0d] hover:brightness-110'
            }`}
          >
            {isTracking ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>
        </div>
      </div>

      {/* Entries List */}
      <div className="bg-[#141210] border border-[rgba(196,168,80,0.12)] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[rgba(196,168,80,0.12)] flex justify-between items-center bg-[rgba(255,255,255,0.02)]">
          <h3 className="font-serif text-lg text-[#e8e4df]">Letzte Einträge</h3>
          <button className="text-[#c4a850] hover:underline text-sm flex items-center gap-1">
            <Plus size={14} /> Manueller Eintrag
          </button>
        </div>
        <div className="divide-y divide-[rgba(196,168,80,0.05)]">
          {entries.map((entry, i) => (
            <div key={i} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-[rgba(196,168,80,0.02)] transition-colors">
              <div>
                <p className="text-[#e8e4df] font-medium text-sm">{entry.notes || 'Keine Beschreibung'}</p>
                <p className="text-[#888888] text-xs mt-1">{entry.project} • {new Date(entry.date).toLocaleDateString()}</p>
              </div>
              <div className="text-[#c4a850] font-mono text-lg">
                {formatTime(entry.duration_minutes * 60)}
              </div>
            </div>
          ))}
          {entries.length === 0 && (
            <div className="p-8 text-center text-[#888888]">Keine Zeiteinträge vorhanden.</div>
          )}
        </div>
      </div>
    </div>
  );
}