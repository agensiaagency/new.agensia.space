import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import { ArrowLeft, Trash2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function FormDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const record = await pb.collection('intake_submissions').getOne(id, { $autoCancel: false });
        setForm(record);
      } catch (error) {
        console.error('Error fetching form:', error);
        toast({ title: 'Fehler', description: 'Formular konnte nicht geladen werden.', variant: 'destructive' });
        navigate('/dashboard/forms');
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id, navigate, toast]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await pb.collection('intake_submissions').update(id, form, { $autoCancel: false });
      toast({ title: 'Gespeichert', description: 'Die Änderungen wurden erfolgreich gespeichert.' });
    } catch (error) {
      console.error('Error saving form:', error);
      toast({ title: 'Fehler', description: 'Änderungen konnten nicht gespeichert werden.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Möchtest du dieses Formular wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      try {
        await pb.collection('intake_submissions').delete(id, { $autoCancel: false });
        toast({ title: 'Gelöscht', description: 'Das Formular wurde gelöscht.' });
        navigate('/dashboard/forms');
      } catch (error) {
        console.error('Error deleting form:', error);
        toast({ title: 'Fehler', description: 'Formular konnte nicht gelöscht werden.', variant: 'destructive' });
      }
    }
  };

  if (loading) return <div className="text-[#a8b0c5]">Lade Formular Details...</div>;
  if (!form) return null;

  return (
    <div className="max-w-4xl pb-12">
      <button 
        onClick={() => navigate('/dashboard/forms')}
        className="flex items-center gap-2 text-[#a8b0c5] hover:text-[#d4a850] transition-colors mb-8"
      >
        <ArrowLeft size={20} /> Zurück zur Übersicht
      </button>

      <div className="flex justify-between items-center mb-8">
        <h2 className="font-serif text-3xl text-[#edf0f7]">Formular Details</h2>
        <div className="flex gap-3">
          <button 
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-400 rounded-md hover:bg-red-500/10 transition-colors"
          >
            <Trash2 size={18} /> Löschen
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-[#d4a850] text-[#08090d] rounded-md font-medium hover:brightness-110 transition-all disabled:opacity-70"
          >
            <Save size={18} /> {saving ? 'Speichert...' : 'Speichern'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[rgba(12,14,20,0.7)] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-6 space-y-4">
            <h3 className="text-xl font-serif text-[#edf0f7] mb-4">Projekt Infos</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#a8b0c5] mb-1">Firmenname</label>
                <input type="text" value={form.company_name || ''} onChange={e => handleChange('company_name', e.target.value)} className="w-full bg-[#08090d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7] focus:border-[#d4a850] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-[#a8b0c5] mb-1">Website</label>
                <input type="text" value={form.website || ''} onChange={e => handleChange('website', e.target.value)} className="w-full bg-[#08090d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7] focus:border-[#d4a850] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-[#a8b0c5] mb-1">Nische / Kategorie</label>
                <input type="text" value={form.niche || ''} onChange={e => handleChange('niche', e.target.value)} className="w-full bg-[#08090d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7] focus:border-[#d4a850] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-[#a8b0c5] mb-1">Spezialisierung</label>
                <input type="text" value={form.industry || ''} onChange={e => handleChange('industry', e.target.value)} className="w-full bg-[#08090d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7] focus:border-[#d4a850] focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#a8b0c5] mb-1">Ziele</label>
              <textarea value={form.goals || ''} onChange={e => handleChange('goals', e.target.value)} rows={3} className="w-full bg-[#08090d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7] focus:border-[#d4a850] focus:outline-none" />
            </div>
          </div>

          <div className="bg-[rgba(12,14,20,0.7)] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-6 space-y-4">
            <h3 className="text-xl font-serif text-[#edf0f7] mb-4">Design & Stil</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#a8b0c5] mb-1">Farben</label>
                <input type="text" value={form.colors || ''} onChange={e => handleChange('colors', e.target.value)} className="w-full bg-[#08090d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7] focus:border-[#d4a850] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-[#a8b0c5] mb-1">Stil</label>
                <input type="text" value={form.style || ''} onChange={e => handleChange('style', e.target.value)} className="w-full bg-[#08090d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7] focus:border-[#d4a850] focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-[#a8b0c5] mb-1">Referenzen</label>
              <input type="text" value={form.references || ''} onChange={e => handleChange('references', e.target.value)} className="w-full bg-[#08090d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7] focus:border-[#d4a850] focus:outline-none" />
            </div>
          </div>

          <div className="bg-[rgba(12,14,20,0.7)] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-6 space-y-4">
            <h3 className="text-xl font-serif text-[#edf0f7] mb-4">Kontaktdaten</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#a8b0c5] mb-1">Name</label>
                <input type="text" value={form.name || ''} onChange={e => handleChange('name', e.target.value)} className="w-full bg-[#08090d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7] focus:border-[#d4a850] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-[#a8b0c5] mb-1">E-Mail</label>
                <input type="email" value={form.email || ''} onChange={e => handleChange('email', e.target.value)} className="w-full bg-[#08090d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7] focus:border-[#d4a850] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-[#a8b0c5] mb-1">Telefon</label>
                <input type="text" value={form.phone || ''} onChange={e => handleChange('phone', e.target.value)} className="w-full bg-[#08090d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7] focus:border-[#d4a850] focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-[#a8b0c5] mb-1">Nachricht</label>
              <textarea value={form.message || ''} onChange={e => handleChange('message', e.target.value)} rows={3} className="w-full bg-[#08090d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7] focus:border-[#d4a850] focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-[rgba(12,14,20,0.7)] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-6 space-y-4">
            <h3 className="text-xl font-serif text-[#edf0f7] mb-4">Status & Paket</h3>
            
            <div>
              <label className="block text-sm text-[#a8b0c5] mb-1">Status</label>
              <select 
                value={form.status || 'Entwurf'} 
                onChange={e => handleChange('status', e.target.value)}
                className="w-full bg-[#08090d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7] focus:border-[#d4a850] focus:outline-none"
              >
                <option value="Entwurf">Entwurf</option>
                <option value="Eingereicht">Eingereicht</option>
                <option value="Bezahlt">Bezahlt</option>
                <option value="In Bearbeitung">In Bearbeitung</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-[#a8b0c5] mb-1">Paket</label>
              <select 
                value={form.selected_package || form.package || ''} 
                onChange={e => handleChange('selected_package', e.target.value)}
                className="w-full bg-[#08090d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7] focus:border-[#d4a850] focus:outline-none"
              >
                <option value="">Bitte wählen</option>
                <option value="Starter">Starter</option>
                <option value="Professional">Professional</option>
                <option value="Premium">Premium</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-[#a8b0c5] mb-1">Hosting Laufzeit</label>
              <select 
                value={form.hosting_term || '1J'} 
                onChange={e => handleChange('hosting_term', e.target.value)}
                className="w-full bg-[#08090d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7] focus:border-[#d4a850] focus:outline-none"
              >
                <option value="1J">1 Jahr</option>
                <option value="2J">2 Jahre</option>
                <option value="3J">3 Jahre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-[#a8b0c5] mb-1">Budget (bei Custom)</label>
              <input type="text" value={form.budget || ''} onChange={e => handleChange('budget', e.target.value)} className="w-full bg-[#08090d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7] focus:border-[#d4a850] focus:outline-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}