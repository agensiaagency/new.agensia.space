
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ClipboardList, Trash2, Edit, X, Save } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminContentFormsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    form_type: 'texte',
    fields: []
  });

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const data = await api.content_forms.getAll();
      setForms(data);
    } catch (error) {
      console.error('Error fetching forms:', error);
      toast({ title: "Fehler", description: "Formulare konnten nicht geladen werden.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddField = () => {
    setFormData({
      ...formData,
      fields: [
        ...formData.fields,
        { name: `field_${Date.now()}`, label: 'Neues Feld', type: 'text', required: false, options: [] }
      ]
    });
  };

  const handleUpdateField = (index, key, value) => {
    const newFields = [...formData.fields];
    newFields[index][key] = value;
    setFormData({ ...formData, fields: newFields });
  };

  const handleRemoveField = (index) => {
    const newFields = [...formData.fields];
    newFields.splice(index, 1);
    setFormData({ ...formData, fields: newFields });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.fields.length === 0) {
      toast({ title: "Fehler", description: "Bitte füge mindestens ein Feld hinzu.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.content_forms.create({
        ...formData,
        created_by: user.id
      });
      toast({ title: "Formular erstellt", className: "bg-[#10b981] text-white border-none" });
      setIsModalOpen(false);
      setFormData({ title: '', description: '', form_type: 'texte', fields: [] });
      fetchForms();
    } catch (error) {
      toast({ title: "Fehler", description: "Formular konnte nicht erstellt werden.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Formular wirklich löschen?')) return;
    try {
      await api.content_forms.delete(id);
      setForms(forms.filter(f => f.id !== id));
      toast({ title: "Gelöscht", className: "bg-[#10b981] text-white border-none" });
    } catch (error) {
      toast({ title: "Fehler", variant: "destructive" });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-full overflow-x-hidden mx-auto p-8 space-y-8 bg-[#08080a] pb-20">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif text-[#e8e4df] mb-2">Content-Formulare</h1>
            <p className="text-[#888888]">Erstelle und verwalte dynamische Formulare für die Inhaltsabfrage.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#c4a850] text-[#08080a] px-5 py-2.5 rounded-lg font-medium hover:bg-[#d4bc6a] transition-colors"
          >
            <Plus size={18} /> Neues Formular
          </button>
        </div>

        {/* Forms Grid */}
        {forms.length === 0 ? (
          <div className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl p-12 text-center">
            <ClipboardList size={48} className="text-[#888888] mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-[#e8e4df] mb-2">Keine Formulare</h3>
            <p className="text-[#888888]">Erstelle dein erstes Formular, um Inhalte von Kunden abzufragen.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form, index) => (
              <motion.div
                key={form.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl p-6 flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[rgba(255,255,255,0.05)] text-[#a8b0c5]">
                    {form.form_type}
                  </span>
                  <button onClick={() => handleDelete(form.id)} className="text-[#888888] hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <h3 className="text-lg font-medium text-[#e8e4df] mb-2">{form.title}</h3>
                <p className="text-sm text-[#888888] line-clamp-2 mb-4 flex-1">{form.description}</p>
                
                <div className="pt-4 border-t border-[rgba(255,255,255,0.05)] flex justify-between items-center">
                  <span className="text-xs text-[#5e6680]">{form.fields?.length || 0} Felder</span>
                  <span className="text-xs text-[#5e6680]">{new Date(form.created).toLocaleDateString('de-DE')}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Create Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh]"
              >
                <div className="p-6 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center shrink-0 bg-[#08080a]">
                  <h2 className="text-xl font-serif text-[#e8e4df]">Formular Builder</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-[#888888] hover:text-[#e8e4df] transition-colors">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-[#888888] mb-1">Titel</label>
                        <input 
                          type="text" 
                          required 
                          value={formData.title} 
                          onChange={e => setFormData({...formData, title: e.target.value})} 
                          className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#888888] mb-1">Typ</label>
                        <select 
                          value={formData.form_type} 
                          onChange={e => setFormData({...formData, form_type: e.target.value})} 
                          className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none"
                        >
                          <option value="texte">Texte</option>
                          <option value="bilder">Bilder</option>
                          <option value="firmendaten">Firmendaten</option>
                          <option value="sonstiges">Sonstiges</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-[#888888] mb-1">Beschreibung</label>
                      <textarea 
                        rows={2}
                        value={formData.description} 
                        onChange={e => setFormData({...formData, description: e.target.value})} 
                        className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none resize-none" 
                      />
                    </div>

                    <div className="pt-6 border-t border-[rgba(255,255,255,0.05)]">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-[#e8e4df]">Felder</h3>
                        <button 
                          type="button"
                          onClick={handleAddField}
                          className="flex items-center gap-1 text-sm text-[#c4a850] hover:underline"
                        >
                          <Plus size={16} /> Feld hinzufügen
                        </button>
                      </div>

                      <div className="space-y-4">
                        {formData.fields.map((field, index) => (
                          <div key={index} className="bg-[#08080a] border border-[rgba(255,255,255,0.05)] rounded-lg p-4 relative group">
                            <button 
                              type="button"
                              onClick={() => handleRemoveField(index)}
                              className="absolute top-4 right-4 text-[#888888] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={16} />
                            </button>
                            
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pr-8">
                              <div className="md:col-span-5">
                                <label className="block text-xs text-[#888888] mb-1">Label</label>
                                <input 
                                  type="text" 
                                  value={field.label} 
                                  onChange={e => handleUpdateField(index, 'label', e.target.value)} 
                                  className="w-full bg-[#0d0d0f] border border-[rgba(255,255,255,0.1)] rounded-md px-3 py-1.5 text-sm text-[#e8e4df] focus:border-[#c4a850] focus:outline-none" 
                                />
                              </div>
                              <div className="md:col-span-4">
                                <label className="block text-xs text-[#888888] mb-1">Typ</label>
                                <select 
                                  value={field.type} 
                                  onChange={e => handleUpdateField(index, 'type', e.target.value)} 
                                  className="w-full bg-[#0d0d0f] border border-[rgba(255,255,255,0.1)] rounded-md px-3 py-1.5 text-sm text-[#e8e4df] focus:border-[#c4a850] focus:outline-none"
                                >
                                  <option value="text">Kurzer Text</option>
                                  <option value="textarea">Langer Text</option>
                                  <option value="select">Dropdown</option>
                                  <option value="checkbox">Checkbox</option>
                                  <option value="file">Datei-Upload</option>
                                </select>
                              </div>
                              <div className="md:col-span-3 flex items-end pb-1.5">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={field.required} 
                                    onChange={e => handleUpdateField(index, 'required', e.target.checked)} 
                                    className="w-4 h-4 rounded border-[rgba(255,255,255,0.2)] bg-[#0d0d0f] text-[#c4a850] focus:ring-[#c4a850]" 
                                  />
                                  <span className="text-sm text-[#e8e4df]">Pflichtfeld</span>
                                </label>
                              </div>
                            </div>
                            
                            {field.type === 'select' && (
                              <div className="mt-3">
                                <label className="block text-xs text-[#888888] mb-1">Optionen (kommagetrennt)</label>
                                <input 
                                  type="text" 
                                  value={(field.options || []).join(', ')} 
                                  onChange={e => handleUpdateField(index, 'options', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} 
                                  className="w-full bg-[#0d0d0f] border border-[rgba(255,255,255,0.1)] rounded-md px-3 py-1.5 text-sm text-[#e8e4df] focus:border-[#c4a850] focus:outline-none" 
                                  placeholder="Option 1, Option 2, Option 3"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                        {formData.fields.length === 0 && (
                          <div className="text-center py-8 text-[#888888] border-2 border-dashed border-[rgba(255,255,255,0.05)] rounded-lg">
                            Noch keine Felder hinzugefügt.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-[rgba(255,255,255,0.05)] flex justify-end gap-3 shrink-0 bg-[#08080a]">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="px-4 py-2 text-[#888888] hover:text-[#e8e4df] transition-colors text-sm"
                  >
                    Abbrechen
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-[#c4a850] text-[#08080a] px-6 py-2 rounded-md text-sm font-medium hover:bg-[#d4bc6a] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <Save size={16} /> {isSubmitting ? 'Speichert...' : 'Formular speichern'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
