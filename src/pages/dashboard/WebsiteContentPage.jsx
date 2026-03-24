
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { api } from '@/lib/api.js';
import { useToast } from '@/hooks/use-toast';
import { 
  Circle, PenTool, CheckCircle, ChevronLeft, ChevronRight, 
  Save, Loader2, FileText
} from 'lucide-react';

export default function WebsiteContentPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [project, setProject] = useState(null);
  const [sections, setSections] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Local state for the active section to allow fast typing
  const [localContent, setLocalContent] = useState('');
  const [localNotes, setLocalNotes] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (user) fetchProjectAndSections();
  }, [user]);

  const fetchProjectAndSections = async () => {
    setLoading(true);
    try {
      let proj = await api.projects.getProject(user.id);
      
      if (!proj) {
        try {
          proj = await api.projects.createProject({
            userId: user.id,
            title: `Website für ${user.company_name || user.name || 'Neues Projekt'}`,
            nicheId: user.niche || 'custom',
            packageId: user.selected_package || 'starter',
            status: 'planning'
          });
        } catch (e) {
          console.warn('Failed to auto-create project:', e);
          proj = null;
        }
      }
      
      setProject(proj);
      
      let secs = [];
      if (proj) {
        secs = await api.website_content.initializeSections(user.id, proj.id);
      } else {
        // Fallback sections if project creation failed
        secs = [
          { id: 'temp-1', section_key: 'hero', section_label: 'Startseite / Hero', content: '', notes: '', status: 'leer' },
          { id: 'temp-2', section_key: 'ueber-uns', section_label: 'Über uns', content: '', notes: '', status: 'leer' },
          { id: 'temp-3', section_key: 'leistungen', section_label: 'Leistungen', content: '', notes: '', status: 'leer' },
          { id: 'temp-4', section_key: 'team', section_label: 'Team', content: '', notes: '', status: 'leer' },
          { id: 'temp-5', section_key: 'referenzen', section_label: 'Referenzen', content: '', notes: '', status: 'leer' },
          { id: 'temp-6', section_key: 'faq', section_label: 'FAQ', content: '', notes: '', status: 'leer' },
          { id: 'temp-7', section_key: 'kontakt', section_label: 'Kontakt', content: '', notes: '', status: 'leer' },
          { id: 'temp-8', section_key: 'impressum', section_label: 'Impressum / Datenschutz', content: '', notes: '', status: 'leer' }
        ];
      }
      
      setSections(secs);
      
      if (secs.length > 0) {
        setLocalContent(secs[0].content || '');
        setLocalNotes(secs[0].notes || '');
      }
    } catch (error) {
      console.error('Error fetching content sections:', error);
      toast({ title: "Fehler beim Laden", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Handle section change
  const handleSectionChange = async (newIndex) => {
    if (isDirty) await handleSave();
    
    setActiveIndex(newIndex);
    setLocalContent(sections[newIndex].content || '');
    setLocalNotes(sections[newIndex].notes || '');
    setIsDirty(false);
  };

  // Auto-save debounce
  useEffect(() => {
    if (!isDirty) return;
    
    const timer = setTimeout(() => {
      handleSave();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [localContent, localNotes, isDirty]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSave();
      } else if (e.ctrlKey && e.key === 'ArrowRight') {
        e.preventDefault();
        if (activeIndex < sections.length - 1) handleSectionChange(activeIndex + 1);
      } else if (e.ctrlKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        if (activeIndex > 0) handleSectionChange(activeIndex - 1);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, sections.length, isDirty, localContent, localNotes]);

  const handleSave = async () => {
    if (!sections[activeIndex] || !isDirty) return;
    
    const currentSection = sections[activeIndex];
    
    // Prevent saving if it's a temporary section (no project)
    if (currentSection.id.startsWith('temp-')) {
      console.warn('Cannot save temporary section without a project.');
      setSections(prev => prev.map((s, i) => i === activeIndex ? { ...s, content: localContent, notes: localNotes } : s));
      setIsDirty(false);
      return;
    }
    
    setIsSaving(true);
    try {
      let newStatus = currentSection.status;
      
      // Auto-update status to 'entwurf' if it was 'leer' and content was added
      if (newStatus === 'leer' && (localContent.trim() || localNotes.trim())) {
        newStatus = 'entwurf';
      }
      
      const updated = await api.website_content.update(currentSection.id, {
        content: localContent,
        notes: localNotes,
        status: newStatus,
        last_edited_by: user.id
      });
      
      setSections(prev => prev.map((s, i) => i === activeIndex ? updated : s));
      setIsDirty(false);
    } catch (error) {
      toast({ title: "Fehler beim Speichern", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStatus = async () => {
    const currentSection = sections[activeIndex];
    
    if (currentSection.id.startsWith('temp-')) {
      toast({ title: "Projekt fehlt", description: "Status kann ohne Projekt nicht gespeichert werden.", variant: "destructive" });
      return;
    }
    
    const newStatus = currentSection.status === 'fertig' ? 'entwurf' : 'fertig';
    
    setIsSaving(true);
    try {
      const updated = await api.website_content.update(currentSection.id, {
        status: newStatus,
        content: localContent,
        notes: localNotes,
        last_edited_by: user.id
      });
      
      setSections(prev => prev.map((s, i) => i === activeIndex ? updated : s));
      setIsDirty(false);
      toast({ title: newStatus === 'fertig' ? "Als fertig markiert" : "Als Entwurf markiert", className: "bg-[#10b981] text-white border-none" });
    } catch (error) {
      toast({ title: "Fehler beim Aktualisieren", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-[#888888]"><Loader2 className="animate-spin mr-2" /> Lade Inhalte...</div>;
  }

  const activeSection = sections[activeIndex];
  const finishedCount = sections.filter(s => s.status === 'fertig' || s.status === 'geprüft').length;
  const progressPercent = sections.length > 0 ? (finishedCount / sections.length) * 100 : 0;

  const getStatusIcon = (status) => {
    switch(status) {
      case 'fertig':
      case 'geprüft': return <CheckCircle size={16} className="text-green-500" />;
      case 'entwurf': return <PenTool size={16} className="text-blue-500" />;
      default: return <Circle size={16} className="text-[#5e6680]" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-24">
      
      {/* Header & Progress */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif text-[#e8e4df] mb-4">Website-Inhalte</h1>
        <div className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl p-5 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 w-full">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[#888888]">Fortschritt</span>
              <span className="text-[#c4a850] font-medium">{finishedCount} von {sections.length} fertig</span>
            </div>
            <div className="w-full h-2 bg-[#141210] rounded-full overflow-hidden border border-[rgba(255,255,255,0.05)]">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className="h-full bg-gradient-to-r from-[#c4a850] to-[#d4a860]"
              />
            </div>
          </div>
          <div className="text-xs text-[#888888] flex items-center gap-4 shrink-0">
            <span className="flex items-center gap-1.5"><Circle size={12} /> Leer</span>
            <span className="flex items-center gap-1.5"><PenTool size={12} className="text-blue-500" /> Entwurf</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green-500" /> Fertig</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl overflow-hidden sticky top-24">
            {sections.map((sec, idx) => (
              <button
                key={sec.id}
                onClick={() => handleSectionChange(idx)}
                className={`w-full flex items-center justify-between p-4 text-left transition-all duration-200 border-l-2 min-h-[44px]
                  ${activeIndex === idx 
                    ? 'bg-[rgba(196,168,80,0.08)] border-[#c4a850] text-[#c4a850]' 
                    : 'border-transparent text-[#a8b0c5] hover:bg-[rgba(255,255,255,0.02)] hover:text-[#e8e4df]'
                  }
                  ${idx !== sections.length - 1 ? 'border-b border-[rgba(255,255,255,0.05)]' : ''}
                `}
              >
                <span className="font-medium text-sm truncate pr-3">{sec.section_label}</span>
                {getStatusIcon(sec.status)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 flex flex-col min-h-[600px]">
          {activeSection && (
            <motion.div 
              key={activeSection.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl p-6 md:p-8 flex-1 flex flex-col"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-[rgba(255,255,255,0.05)]">
                <div>
                  <h2 className="text-2xl font-serif text-[#e8e4df]">{activeSection.section_label}</h2>
                  <p className="text-sm text-[#888888] mt-1">
                    Status: <span className="capitalize">{activeSection.status}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleSave}
                    disabled={!isDirty || isSaving || activeSection.id.startsWith('temp-')}
                    className="flex items-center gap-2 px-4 py-2 bg-[#141210] border border-[rgba(196,168,80,0.3)] text-[#e8e4df] rounded-lg text-sm font-medium hover:border-[#c4a850] transition-colors disabled:opacity-50 min-h-[44px]"
                  >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Speichern
                  </button>
                  <button 
                    onClick={toggleStatus}
                    disabled={activeSection.id.startsWith('temp-')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] disabled:opacity-50
                      ${activeSection.status === 'fertig' || activeSection.status === 'geprüft'
                        ? 'bg-[#141210] border border-[rgba(255,255,255,0.1)] text-[#888888] hover:text-[#e8e4df]'
                        : 'bg-[#c4a850] text-[#08080a] hover:bg-[#d4bc6a]'
                      }`}
                  >
                    <CheckCircle size={16} />
                    {activeSection.status === 'fertig' || activeSection.status === 'geprüft' ? 'Als Entwurf' : 'Fertig'}
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-6">
                <div className="flex-1 flex flex-col">
                  <label className="text-sm font-medium text-[#e8e4df] mb-2">Inhalt (Texte, Überschriften)</label>
                  <textarea
                    value={localContent}
                    onChange={(e) => { setLocalContent(e.target.value); setIsDirty(true); }}
                    placeholder="Schreibe hier die Texte für diesen Bereich..."
                    className="flex-1 w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-xl p-4 text-[#e8e4df] focus:outline-none focus:border-[#c4a850] resize-none min-h-[300px] font-sans leading-relaxed"
                  />
                  <div className="text-right text-xs text-[#5e6680] mt-2">
                    {localContent.length} Zeichen • {localContent.split(/\s+/).filter(w => w.length > 0).length} Wörter
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#e8e4df] mb-2">Notizen & Anmerkungen (Optional)</label>
                  <textarea
                    value={localNotes}
                    onChange={(e) => { setLocalNotes(e.target.value); setIsDirty(true); }}
                    placeholder="Zusätzliche Infos, Bildwünsche oder Layout-Ideen..."
                    className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-xl p-4 text-[#e8e4df] focus:outline-none focus:border-[#c4a850] resize-none h-32 font-sans"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Bottom Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button 
              onClick={() => handleSectionChange(activeIndex - 1)}
              disabled={activeIndex === 0}
              className="flex items-center gap-2 px-4 py-2 text-[#888888] hover:text-[#c4a850] disabled:opacity-30 transition-colors min-h-[44px]"
            >
              <ChevronLeft size={20} /> Zurück
            </button>
            
            <div className="flex gap-2">
              {sections.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-2 h-2 rounded-full transition-colors ${idx === activeIndex ? 'bg-[#c4a850]' : 'bg-[rgba(255,255,255,0.1)]'}`}
                />
              ))}
            </div>

            <button 
              onClick={() => handleSectionChange(activeIndex + 1)}
              disabled={activeIndex === sections.length - 1}
              className="flex items-center gap-2 px-4 py-2 text-[#888888] hover:text-[#c4a850] disabled:opacity-30 transition-colors min-h-[44px]"
            >
              Weiter <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="text-center text-xs text-[#5e6680] mt-4">
            Tipp: Strg+S zum Speichern, Strg+Pfeiltasten zum Navigieren
          </div>
        </div>
      </div>
    </div>
  );
}
