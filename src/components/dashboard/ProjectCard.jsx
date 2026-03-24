import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  // Map category/niche to color
  const getColor = (colorGroup) => {
    switch (colorGroup?.toLowerCase()) {
      case '#3d6145': return '#3d6145'; // Green
      case '#9b2020': return '#9b2020'; // Red
      case '#7040a0': return '#7040a0'; // Purple
      case '#c4a850': return '#c4a850'; // Gold
      case '#2a6db5': return '#2a6db5'; // Blue
      default: return '#c4a850'; // Default Gold
    }
  };

  const nicheColor = getColor(project.colorGroup || project.colors);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'live':
      case 'abgeschlossen':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#c4a850] text-[#0a0f0d]">Live</span>;
      case 'in_bearbeitung':
      case 'in-progress':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-[rgba(196,168,80,0.2)] text-[#c4a850] border border-[rgba(196,168,80,0.3)]">In Bearbeitung</span>;
      case 'entwurf':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-[rgba(255,255,255,0.1)] text-[#e8e4df]">Entwurf</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-[rgba(255,255,255,0.05)] text-[#888888] border border-[rgba(255,255,255,0.1)]">Neu</span>;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={() => navigate(`/dashboard/projects/${project.id}`)}
      className="relative cursor-pointer bg-[hsl(var(--surface))] bg-opacity-90 rounded-[var(--radius)] p-6 border border-[hsl(var(--border))] overflow-hidden group transition-all duration-300 hover:border-[rgba(196,168,80,0.4)]"
    >
      {/* Left Border Accent */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:w-[4px]"
        style={{ backgroundColor: nicheColor }}
      />
      
      {/* Hover Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
           style={{ background: `radial-gradient(circle at center, ${nicheColor} 0%, transparent 70%)` }} />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="text-sm text-[#888888]">{new Date(project.created).toLocaleDateString('de-DE')}</div>
        {getStatusBadge(project.status)}
      </div>

      <h3 className="text-2xl font-serif text-[#e8e4df] mb-2 relative z-10 group-hover:text-white transition-colors">
        {project.company_name || project.companyName || 'Neues Projekt'}
      </h3>
      
      <p className="text-sm text-[#888888] relative z-10">
        {project.categoryTitle || project.niche || 'Webdesign Projekt'}
      </p>
    </motion.div>
  );
}