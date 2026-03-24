import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { ArrowLeft, CheckCircle, Clock, FileText, MessageSquare, ExternalLink } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';

export default function ProjectPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const record = await pb.collection('intake_submissions').getOne(projectId, { $autoCancel: false });
        setProject(record);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };
    if (projectId) fetchProject();
  }, [projectId]);

  if (loading) return <LoadingSpinner />;
  if (!project) return <div className="p-8 text-[#a8b0c5]">Projekt nicht gefunden.</div>;

  const steps = [
    { id: 'briefing', label: 'Briefing', status: 'completed' },
    { id: 'design', label: 'Design', status: project.status === 'In Bearbeitung' ? 'current' : 'pending' },
    { id: 'dev', label: 'Entwicklung', status: 'pending' },
    { id: 'review', label: 'Review', status: 'pending' },
    { id: 'launch', label: 'Launch', status: 'pending' }
  ];

  const tabs = [
    { id: 'overview', label: 'Übersicht', icon: FileText },
    { id: 'tasks', label: 'Aufgaben', icon: CheckCircle },
    { id: 'files', label: 'Dateien', icon: FileText },
    { id: 'messages', label: 'Nachrichten', icon: MessageSquare }
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <button 
        onClick={() => navigate('/dashboard/projects')} 
        className="flex items-center gap-2 text-[#888888] hover:text-[#c4a850] mb-6 md:mb-8 text-sm md:text-base min-h-[44px] transition-colors"
      >
        <ArrowLeft size={20} /> Zurück zu Projekten
      </button>

      <div className="bg-[#141210] border border-[rgba(196,168,80,0.12)] rounded-xl p-4 md:p-6 lg:p-8 mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#e8e4df] mb-2">
              {project.company_name || 'Unbenanntes Projekt'}
            </h1>
            <p className="text-[#a8b0c5] text-sm md:text-base flex items-center gap-2">
              <span className="capitalize">{project.niche}</span> • 
              <span className="text-[#c4a850]">{project.selected_package}</span>
            </p>
          </div>
          <div className="px-4 py-2 rounded-full border border-[rgba(196,168,80,0.3)] bg-[rgba(196,168,80,0.1)] text-[#c4a850] text-sm md:text-base font-medium">
            {project.status || 'Neu'}
          </div>
        </div>

        {/* Responsive Timeline */}
        <div className="relative pt-4 pb-4">
          <div className="hidden md:block absolute top-8 left-0 right-0 h-[2px] bg-[rgba(196,168,80,0.1)] z-0" />
          <div className="md:hidden absolute top-0 bottom-0 left-[15px] w-[2px] bg-[rgba(196,168,80,0.1)] z-0" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8 md:gap-4 lg:gap-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-row md:flex-col items-center gap-4 md:gap-3 md:flex-1">
                <div className={`
                  w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center relative shrink-0
                  ${step.status === 'completed' ? 'bg-[#141210] border-2 border-[#c4a850]' : 
                    step.status === 'current' ? 'bg-[#c4a850]' : 'bg-[#141210] border-2 border-[rgba(196,168,80,0.2)]'}
                `}>
                  {step.status === 'completed' && <CheckCircle size={20} className="text-[#c4a850]" />}
                  {step.status === 'current' && <Clock size={20} className="text-[#0a0f0d]" />}
                </div>
                <span className={`font-sans text-sm md:text-base md:text-center ${step.status === 'current' ? 'text-[#c4a850] font-medium' : step.status === 'completed' ? 'text-[#e8e4df]' : 'text-[#5e6680]'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive Tabs */}
      <div className="flex gap-2 md:gap-4 mb-6 md:mb-8 overflow-x-auto pb-2 scrollbar-hide whitespace-nowrap">
        {tabs.map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)} 
            className={`flex items-center gap-2 px-5 py-2.5 md:py-3 rounded-full text-sm md:text-base font-medium transition-all min-h-[44px] ${
              activeTab === tab.id 
                ? 'bg-[#c4a850] text-[#0a0f0d]' 
                : 'bg-[#141210] text-[#e8e4df] border border-[rgba(196,168,80,0.2)] hover:border-[#c4a850]'
            }`}
          >
            <tab.icon size={20} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-[#141210] rounded-xl border border-[rgba(196,168,80,0.12)] p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-serif text-[#e8e4df] mb-4 md:mb-6">Projektdetails</h3>
              <div className="space-y-4 text-sm md:text-base">
                <div>
                  <span className="text-[#888888] block mb-1">Ziele</span>
                  <p className="text-[#e8e4df]">{project.goals || 'Keine Angabe'}</p>
                </div>
                <div>
                  <span className="text-[#888888] block mb-1">Stil & Farben</span>
                  <p className="text-[#e8e4df]">{project.style || 'Keine Angabe'} • {project.colors || 'Keine Angabe'}</p>
                </div>
                {project.website && (
                  <div>
                    <span className="text-[#888888] block mb-1">Aktuelle Website</span>
                    <a href={project.website} target="_blank" rel="noreferrer" className="text-[#c4a850] flex items-center gap-1 hover:underline">
                      {project.website} <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-[#141210] rounded-xl border border-[rgba(196,168,80,0.12)] p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-serif text-[#e8e4df] mb-4 md:mb-6">Kontakt</h3>
              <div className="space-y-4 text-sm md:text-base">
                <div>
                  <span className="text-[#888888] block mb-1">Name</span>
                  <p className="text-[#e8e4df]">{project.name}</p>
                </div>
                <div>
                  <span className="text-[#888888] block mb-1">E-Mail</span>
                  <p className="text-[#e8e4df]">{project.email}</p>
                </div>
                <div>
                  <span className="text-[#888888] block mb-1">Telefon</span>
                  <p className="text-[#e8e4df]">{project.phone || 'Keine Angabe'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'tasks' && (
          <div className="bg-[#141210] rounded-xl border border-[rgba(196,168,80,0.12)] p-6 md:p-8 text-center text-[#888888]">
            Aufgaben werden geladen...
          </div>
        )}
        {activeTab === 'files' && (
          <div className="bg-[#141210] rounded-xl border border-[rgba(196,168,80,0.12)] p-6 md:p-8 text-center text-[#888888]">
            Dateien werden geladen...
          </div>
        )}
        {activeTab === 'messages' && (
          <div className="bg-[#141210] rounded-xl border border-[rgba(196,168,80,0.12)] p-6 md:p-8 text-center text-[#888888]">
            Nachrichten werden geladen...
          </div>
        )}
      </div>
    </div>
  );
}