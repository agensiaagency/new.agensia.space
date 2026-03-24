
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import ProjectCard from '@/components/dashboard/ProjectCard.jsx';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function MyProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      try {
        const records = await pb.collection('intake_submissions').getFullList({
          filter: `user_id = "${user.id}"`,
          sort: '-created',
          $autoCancel: false
        });
        setProjects(records);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  return (
    <div>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-serif text-[#e8e4df] mb-2">Meine Projekte</h1>
          <p className="text-[#888888]">Alle deine Anfragen und aktiven Websites.</p>
        </div>
        <Link to="/dashboard/briefing" className="inline-flex items-center gap-2 bg-[#c4a850] text-[#0a0f0d] px-5 py-2.5 rounded-[4px] font-medium hover:bg-[#d4bc6a] transition-colors text-sm">
          <Plus size={18} />
          Neues Projekt
        </Link>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 w-full bg-[hsl(var(--surface))] rounded-[var(--radius)] animate-pulse border border-[hsl(var(--border))]"></div>
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="bg-[hsl(var(--surface))] bg-opacity-90 border border-[hsl(var(--border))] rounded-[var(--radius)] p-12 text-center">
          <p className="text-[#888888] mb-6">Keine Projekte gefunden.</p>
        </div>
      )}
    </div>
  );
}
