import React, { useState } from 'react';
import { X, UploadCloud } from 'lucide-react';

export default function TaskModal({ task, onClose, onSave }) {
  const [formData, setFormData] = useState(task.data || {});

  if (!task) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave({ ...task, data: formData, completed: true });
  };

  const renderFields = () => {
    switch (task.title) {
      case 'Firmeninfos ausfüllen':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#a8b0c5] mb-1">Firmenname</label>
              <input type="text" value={formData.companyName || ''} onChange={e => handleChange('companyName', e.target.value)} className="w-full bg-[#08090d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7]" />
            </div>
            <div>
              <label className="block text-sm text-[#a8b0c5] mb-1">Branche</label>
              <input type="text" value={formData.industry || ''} onChange={e => handleChange('industry', e.target.value)} className="w-full bg-[#08090d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7]" />
            </div>
            <div>
              <label className="block text-sm text-[#a8b0c5] mb-1">Bestehende Website (optional)</label>
              <input type="url" value={formData.website || ''} onChange={e => handleChange('website', e.target.value)} className="w-full bg-[#08090d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7]" />
            </div>
            <div>
              <label className="block text-sm text-[#a8b0c5] mb-1">Kurzbeschreibung</label>
              <textarea value={formData.description || ''} onChange={e => handleChange('description', e.target.value)} rows={4} className="w-full bg-[#08090d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7]" />
            </div>
          </div>
        );
      case 'Logo hochladen':
        return (
          <div className="border-2 border-dashed border-[rgba(255,255,255,0.2)] rounded-xl p-10 flex flex-col items-center justify-center text-center hover:border-[#d4a850] transition-colors cursor-pointer">
            <UploadCloud size={48} className="text-[#a8b0c5] mb-4" />
            <p className="text-[#edf0f7] mb-2">Klicke hier oder ziehe dein Logo in diesen Bereich</p>
            <p className="text-sm text-[#5e6680]">PNG, JPG, SVG (max. 5MB)</p>
            <input type="file" className="hidden" onChange={(e) => handleChange('logo', e.target.files[0]?.name)} />
            {formData.logo && <p className="mt-4 text-[#d4a850]">Ausgewählt: {formData.logo}</p>}
          </div>
        );
      case 'Texte liefern':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#a8b0c5] mb-1">Hauptüberschrift (Hero)</label>
              <input type="text" value={formData.headline || ''} onChange={e => handleChange('headline', e.target.value)} className="w-full bg-[#08090d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7]" />
            </div>
            <div>
              <label className="block text-sm text-[#a8b0c5] mb-1">Unterüberschrift</label>
              <input type="text" value={formData.subtext || ''} onChange={e => handleChange('subtext', e.target.value)} className="w-full bg-[#08090d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7]" />
            </div>
            <div>
              <label className="block text-sm text-[#a8b0c5] mb-1">Über uns / Mich Text</label>
              <textarea value={formData.about || ''} onChange={e => handleChange('about', e.target.value)} rows={6} className="w-full bg-[#08090d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7]" />
            </div>
          </div>
        );
      case 'Farbwünsche angeben':
        return (
          <div>
            <label className="block text-sm text-[#a8b0c5] mb-1">Bevorzugte Farben (Hex-Codes oder Beschreibung)</label>
            <input type="text" value={formData.colors || ''} onChange={e => handleChange('colors', e.target.value)} placeholder="z.B. Dunkelblau und Gold, oder #000080, #FFD700" className="w-full bg-[#08090d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7]" />
          </div>
        );
      case 'Zielgruppe beschreiben':
        return (
          <div>
            <label className="block text-sm text-[#a8b0c5] mb-1">Wer ist deine ideale Zielgruppe?</label>
            <textarea value={formData.targetAudience || ''} onChange={e => handleChange('targetAudience', e.target.value)} rows={5} placeholder="Alter, Interessen, Probleme, die du für sie löst..." className="w-full bg-[#08090d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7]" />
          </div>
        );
      default:
        return <p className="text-[#a8b0c5]">Keine spezifischen Felder für diese Aufgabe definiert.</p>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[rgba(12,14,20,0.95)] border border-[rgba(255,255,255,0.1)] rounded-[20px] p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 text-[#a8b0c5] hover:text-[#edf0f7]">
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-serif text-[#edf0f7] mb-2">{task.title}</h2>
        <p className="text-[#a8b0c5] mb-8">Bitte fülle die folgenden Informationen aus, damit wir mit deinem Projekt fortfahren können.</p>

        <div className="mb-8">
          {renderFields()}
        </div>

        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-2 rounded-md text-[#a8b0c5] hover:text-[#edf0f7] transition-colors">
            Abbrechen
          </button>
          <button onClick={handleSave} className="px-6 py-2 bg-[#d4a850] text-[#08090d] rounded-md font-medium hover:brightness-110 transition-all">
            Speichern & Erledigt
          </button>
        </div>
      </div>
    </div>
  );
}