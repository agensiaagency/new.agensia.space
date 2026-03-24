
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';

export default function MyFormsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      if (!user) return;
      try {
        const records = await pb.collection('intake_submissions').getList(1, 50, {
          filter: `user_id = "${user.id}"`,
          sort: '-created',
          $autoCancel: false
        });
        setForms(records.items);
      } catch (error) {
        console.error('Error fetching forms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Entwurf': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'Eingereicht': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Bezahlt': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'In Bearbeitung': return 'bg-[#d4a850]/20 text-[#d4a850] border-[#d4a850]/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-serif text-3xl text-[#edf0f7] mb-2">Meine Formulare</h2>
          <p className="text-[#a8b0c5]">Übersicht deiner eingereichten Projektanfragen.</p>
        </div>
        <Link 
          to="/dashboard/briefing" 
          className="flex items-center gap-2 px-4 py-2 bg-[#d4a850] text-[#08090d] rounded-md font-medium hover:brightness-110 transition-all"
        >
          <Plus size={18} />
          Neues Projekt
        </Link>
      </div>

      {loading ? (
        <div className="text-[#a8b0c5]">Lade Formulare...</div>
      ) : forms.length === 0 ? (
        <div className="bg-[rgba(12,14,20,0.7)] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-12 text-center">
          <p className="text-[#a8b0c5] mb-6">Du hast noch keine Formulare eingereicht.</p>
          <Link 
            to="/dashboard/briefing" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#d4a850] text-[#08090d] rounded-md font-medium hover:brightness-110 transition-all"
          >
            Jetzt starten
          </Link>
        </div>
      ) : (
        <div className="bg-[rgba(12,14,20,0.7)] border border-[rgba(255,255,255,0.08)] rounded-[16px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.08)]">
                <tr>
                  <th className="p-4 text-[#a8b0c5] font-medium text-sm">Datum</th>
                  <th className="p-4 text-[#a8b0c5] font-medium text-sm">Firma / Projekt</th>
                  <th className="p-4 text-[#a8b0c5] font-medium text-sm">Branche</th>
                  <th className="p-4 text-[#a8b0c5] font-medium text-sm">Paket</th>
                  <th className="p-4 text-[#a8b0c5] font-medium text-sm">Status</th>
                  <th className="p-4 text-[#a8b0c5] font-medium text-sm text-right">Aktion</th>
                </tr>
              </thead>
              <tbody>
                {forms.map((form) => (
                  <tr 
                    key={form.id} 
                    className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer"
                    onClick={() => navigate(`/dashboard/forms/${form.id}`)}
                  >
                    <td className="p-4 text-[#edf0f7] text-sm">
                      {new Date(form.created).toLocaleDateString('de-DE')}
                    </td>
                    <td className="p-4 text-[#edf0f7] font-medium">
                      {form.company_name || 'Unbenanntes Projekt'}
                    </td>
                    <td className="p-4 text-[#a8b0c5] text-sm capitalize">
                      {form.niche || form.industry || '-'}
                    </td>
                    <td className="p-4 text-[#a8b0c5] text-sm capitalize">
                      {form.selected_package || form.package || '-'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs border ${getStatusColor(form.status || 'Entwurf')}`}>
                        {form.status || 'Entwurf'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        className="p-2 text-[#a8b0c5] hover:text-[#d4a850] transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/forms/${form.id}`);
                        }}
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
