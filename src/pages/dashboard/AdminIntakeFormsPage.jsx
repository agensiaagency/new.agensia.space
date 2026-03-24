
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import pb from '@/lib/pocketbaseClient';
import { categories, colorGroups } from '@/lib/categories';
import { 
  Search, Filter, Plus, Edit2, Trash2, FileText, 
  CheckCircle, Clock, ChevronRight, ChevronLeft, 
  Save, Send, User, Building, Mail, Phone, X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// --- Subcomponents ---

const StatsCards = ({ intakes }) => {
  const stats = [
    { label: 'Gesamt', value: intakes.length, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Eingereicht', value: intakes.filter(i => i.status === 'Eingereicht').length, icon: Send, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { label: 'In Bearbeitung', value: intakes.filter(i => i.status === 'In Bearbeitung').length, icon: Clock, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Erledigt', value: intakes.filter(i => i.status === 'Bezahlt' || i.status === 'Erledigt').length, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: i * 0.1 }} 
          className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl p-6 flex items-center justify-between"
        >
          <div>
            <p className="text-[#888888] text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-serif text-[#e8e4df]">{stat.value}</p>
          </div>
          <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
            <stat.icon size={24} />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const CategorySelection = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const groupedCategories = useMemo(() => {
    const groups = Object.entries(colorGroups).map(([key, color]) => ({
      color,
      categories: categories.filter(c => 
        c.color === color && 
        (c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
         c.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }));
    return groups.filter(g => g.categories.length > 0);
  }, [searchTerm]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif text-[#e8e4df]">Branche wählen</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5e6680]" size={18} />
          <input 
            type="text" 
            placeholder="Suchen..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-lg py-2 pl-10 pr-4 text-sm text-[#e8e4df] focus:outline-none focus:border-[#c4a850]"
          />
        </div>
      </div>

      {groupedCategories.map((group, idx) => (
        <div key={idx} className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: group.color }} />
            <div className="h-px flex-1 bg-[rgba(255,255,255,0.05)]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {group.categories.map(cat => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(cat)}
                className="text-left p-6 rounded-xl border border-[rgba(255,255,255,0.05)] bg-[#0d0d0f] hover:border-opacity-50 transition-colors relative overflow-hidden group"
                style={{ '--hover-color': cat.color }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300" style={{ backgroundColor: cat.color }} />
                <h3 className="text-xl font-serif font-normal text-[#e8e4df] mb-2">{cat.title}</h3>
                <p className="text-sm text-[#888888] line-clamp-2">{cat.description}</p>
              </motion.button>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
};

const FormSteps = ({ step, category, formData, updateFormData, users }) => {
  const toggleArrayItem = (path, item) => {
    const keys = path.split('.');
    const currentArray = keys.reduce((obj, key) => obj?.[key], formData) || [];
    const newArray = currentArray.includes(item) 
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    
    updateFormData(path, newArray);
  };

  if (!category) return null;

  switch (step) {
    case 1: // Angebot
      return (
        <div className="space-y-8">
          <h3 className="text-2xl font-serif text-[#e8e4df]">Angebot & Zielgruppe</h3>
          {category.step2?.chipGroups?.map((group, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-[#a8b0c5] mb-3">{group.label}</label>
              <div className="flex flex-wrap gap-2">
                {group.options.map(opt => {
                  const isActive = (formData.form_data?.step1?.[group.key] || []).includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleArrayItem(`form_data.step1.${group.key}`, opt)}
                      className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                        isActive ? 'bg-[rgba(196,168,80,0.1)] border-[#c4a850] text-[#c4a850]' : 'bg-[#08080a] border-[rgba(255,255,255,0.1)] text-[#888888] hover:border-[rgba(255,255,255,0.3)]'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-[#a8b0c5] mb-3">{category.step2?.textareaLabel || 'Zusätzliche Infos'}</label>
            <textarea
              value={formData.form_data?.step1?.notes || ''}
              onChange={(e) => updateFormData('form_data.step1.notes', e.target.value)}
              rows={4}
              className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-xl p-4 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none resize-none"
              placeholder="Weitere Details..."
            />
          </div>
        </div>
      );
    case 2: // Design
      return (
        <div className="space-y-8">
          <h3 className="text-2xl font-serif text-[#e8e4df]">Design & Stil</h3>
          <div>
            <label className="block text-sm font-medium text-[#a8b0c5] mb-3">Visuelle Richtung</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {category.step3?.styles?.map(style => {
                const isActive = formData.form_data?.step2?.styleId === style.id;
                return (
                  <button
                    key={style.id}
                    onClick={() => updateFormData('form_data.step2.styleId', style.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isActive ? 'border-[#c4a850] bg-[rgba(196,168,80,0.05)]' : 'border-[rgba(255,255,255,0.1)] bg-[#08080a] hover:border-[rgba(255,255,255,0.3)]'
                    }`}
                  >
                    <div className="w-full h-16 rounded-lg mb-3" style={{ background: style.gradient }} />
                    <div className={`text-sm font-medium ${isActive ? 'text-[#c4a850]' : 'text-[#888888]'}`}>{style.name}</div>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#a8b0c5] mb-3">Atmosphäre</label>
            <div className="flex flex-wrap gap-2">
              {category.step3?.atmosphere?.map(opt => {
                const isActive = (formData.form_data?.step2?.atmosphere || []).includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => toggleArrayItem('form_data.step2.atmosphere', opt)}
                    className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                      isActive ? 'bg-[rgba(196,168,80,0.1)] border-[#c4a850] text-[#c4a850]' : 'bg-[#08080a] border-[rgba(255,255,255,0.1)] text-[#888888] hover:border-[rgba(255,255,255,0.3)]'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    case 3: // Ziele
      return (
        <div className="space-y-8">
          <h3 className="text-2xl font-serif text-[#e8e4df]">Ziele & Struktur</h3>
          <div>
            <label className="block text-sm font-medium text-[#a8b0c5] mb-3">{category.step4?.goalLabel || 'Ziele'}</label>
            <div className="flex flex-wrap gap-2">
              {category.step4?.goals?.map(opt => {
                const isActive = (formData.form_data?.step3?.goals || []).includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => toggleArrayItem('form_data.step3.goals', opt)}
                    className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                      isActive ? 'bg-[rgba(196,168,80,0.1)] border-[#c4a850] text-[#c4a850]' : 'bg-[#08080a] border-[rgba(255,255,255,0.1)] text-[#888888] hover:border-[rgba(255,255,255,0.3)]'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#a8b0c5] mb-3">{category.step4?.contentLabel || 'Inhalte'}</label>
            <div className="flex flex-wrap gap-2">
              {category.step4?.contents?.map(opt => {
                const isActive = (formData.form_data?.step3?.contents || []).includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => toggleArrayItem('form_data.step3.contents', opt)}
                    className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                      isActive ? 'bg-[rgba(196,168,80,0.1)] border-[#c4a850] text-[#c4a850]' : 'bg-[#08080a] border-[rgba(255,255,255,0.1)] text-[#888888] hover:border-[rgba(255,255,255,0.3)]'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
          {category.step4?.selects?.map((sel, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-[#a8b0c5] mb-3">{sel.label}</label>
              <select
                value={formData.form_data?.step3?.[sel.key] || ''}
                onChange={(e) => updateFormData(`form_data.step3.${sel.key}`, e.target.value)}
                className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-xl p-3 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none"
              >
                <option value="">Bitte wählen...</option>
                {sel.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          ))}
        </div>
      );
    case 4: // Material
      return (
        <div className="space-y-8">
          <h3 className="text-2xl font-serif text-[#e8e4df]">Material & Timeline</h3>
          <div>
            <label className="block text-sm font-medium text-[#a8b0c5] mb-3">Vorhandenes Material</label>
            <div className="flex flex-wrap gap-2">
              {category.step5?.assets?.map(opt => {
                const isActive = (formData.form_data?.step4?.assets || []).includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => toggleArrayItem('form_data.step4.assets', opt)}
                    className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                      isActive ? 'bg-[rgba(196,168,80,0.1)] border-[#c4a850] text-[#c4a850]' : 'bg-[#08080a] border-[rgba(255,255,255,0.1)] text-[#888888] hover:border-[rgba(255,255,255,0.3)]'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#a8b0c5] mb-3">Anmerkungen / Timeline</label>
            <textarea
              value={formData.form_data?.step4?.notes || ''}
              onChange={(e) => updateFormData('form_data.step4.notes', e.target.value)}
              rows={4}
              className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-xl p-4 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none resize-none"
              placeholder="Wunschtermin, Besonderheiten..."
            />
          </div>
        </div>
      );
    case 5: // Kontakt
      return (
        <div className="space-y-6">
          <h3 className="text-2xl font-serif text-[#e8e4df]">Kontaktdaten</h3>
          
          <div>
            <label className="block text-sm font-medium text-[#a8b0c5] mb-2">Kunde verknüpfen (Optional)</label>
            <select
              value={formData.user_id || ''}
              onChange={(e) => {
                const uid = e.target.value;
                updateFormData('user_id', uid);
                if (uid) {
                  const user = users.find(u => u.id === uid);
                  if (user) {
                    updateFormData('name', user.name || '');
                    updateFormData('email', user.email || '');
                    updateFormData('company_name', user.company_name || '');
                    updateFormData('phone', user.phone || '');
                  }
                }
              }}
              className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-xl p-3 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none"
            >
              <option value="">Kein Account verknüpft</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name || u.email} {u.company_name ? `(${u.company_name})` : ''}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#a8b0c5] mb-2">Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5e6680]" size={18} />
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 pl-10 pr-4 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#a8b0c5] mb-2">E-Mail *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5e6680]" size={18} />
                <input
                  type="email"
                  required
                  value={formData.email || ''}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 pl-10 pr-4 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#a8b0c5] mb-2">Firma</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5e6680]" size={18} />
                <input
                  type="text"
                  value={formData.company_name || ''}
                  onChange={(e) => updateFormData('company_name', e.target.value)}
                  className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 pl-10 pr-4 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#a8b0c5] mb-2">Telefon</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5e6680]" size={18} />
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 pl-10 pr-4 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
};

const FormView = ({ category, initialData, onCancel, onSave, users }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialData || {
    user_id: '', company_name: '', name: '', email: '', phone: '',
    niche: category?.id || '', status: 'Entwurf', form_data: {}
  });
  const [isSaving, setIsSaving] = useState(false);

  const updateFormData = (path, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleSave = async (status) => {
    if (status === 'Eingereicht' && (!formData.name || !formData.email)) {
      alert('Name und E-Mail sind Pflichtfelder für die Einreichung.');
      return;
    }
    setIsSaving(true);
    await onSave({ ...formData, status });
    setIsSaving(false);
  };

  return (
    <div className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-2xl overflow-hidden flex flex-col min-h-[600px]">
      {/* Header */}
      <div className="p-6 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center bg-[#08080a]">
        <div>
          <h2 className="text-xl font-serif text-[#e8e4df] flex items-center gap-3">
            {initialData?.id ? 'Briefing bearbeiten' : 'Neues Briefing'}
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[rgba(196,168,80,0.1)] text-[#c4a850] border border-[rgba(196,168,80,0.2)]">
              {category?.title}
            </span>
          </h2>
        </div>
        <button onClick={onCancel} className="p-2 text-[#888888] hover:text-[#e8e4df] transition-colors rounded-full hover:bg-[rgba(255,255,255,0.05)]">
          <X size={20} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="flex h-1 bg-[#08080a]">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className={`flex-1 transition-colors duration-300 ${i <= step ? 'bg-[#c4a850]' : 'bg-transparent'}`} />
        ))}
      </div>

      {/* Content */}
      <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <FormSteps step={step} category={category} formData={formData} updateFormData={updateFormData} users={users} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-[rgba(255,255,255,0.05)] bg-[#08080a] flex justify-between items-center">
        <div className="flex gap-3">
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 px-4 py-2 text-[#888888] hover:text-[#e8e4df] transition-colors">
              <ChevronLeft size={16} /> Zurück
            </button>
          ) : (
            <button onClick={onCancel} className="px-4 py-2 text-[#888888] hover:text-[#e8e4df] transition-colors text-sm">
              Abbrechen
            </button>
          )}
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => handleSave('Entwurf')} 
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.1)] text-[#a8b0c5] hover:text-[#e8e4df] hover:bg-[rgba(255,255,255,0.05)] transition-colors disabled:opacity-50"
          >
            <Save size={16} /> Entwurf speichern
          </button>
          
          {step < 5 ? (
            <button onClick={() => setStep(s => s + 1)} className="flex items-center gap-2 bg-[#c4a850] text-[#08080a] px-6 py-2 rounded-lg font-medium hover:bg-[#d4bc6a] transition-all active:scale-[0.98]">
              Weiter <ChevronRight size={16} />
            </button>
          ) : (
            <button 
              onClick={() => handleSave('Eingereicht')} 
              disabled={isSaving}
              className="flex items-center gap-2 bg-[#10b981] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#0ea5e9] transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isSaving ? 'Speichert...' : 'Einreichen'} <Send size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

export default function AdminIntakeFormsPage() {
  const [activeTab, setActiveTab] = useState('submitted'); // submitted, new, drafts
  const [intakes, setIntakes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  // Form State
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingIntake, setEditingIntake] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [intakesData, usersData] = await Promise.all([
        pb.collection('intake_submissions').getFullList({ expand: 'user_id', sort: '-created', $autoCancel: false }),
        pb.collection('users').getFullList({ filter: 'role="user"', $autoCancel: false })
      ]);
      setIntakes(intakesData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({ title: "Fehler", description: "Daten konnten nicht geladen werden.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveForm = async (data) => {
    try {
      if (data.id) {
        await pb.collection('intake_submissions').update(data.id, data, { $autoCancel: false });
        toast({ title: "Gespeichert", description: "Briefing wurde aktualisiert." });
      } else {
        await pb.collection('intake_submissions').create(data, { $autoCancel: false });
        toast({ title: "Erstellt", description: "Neues Briefing wurde angelegt." });
      }
      await fetchData();
      setSelectedCategory(null);
      setEditingIntake(null);
      setActiveTab(data.status === 'Entwurf' ? 'drafts' : 'submitted');
    } catch (error) {
      console.error('Save error:', error);
      toast({ title: "Fehler", description: "Speichern fehlgeschlagen.", variant: "destructive" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Briefing wirklich löschen?')) return;
    try {
      await pb.collection('intake_submissions').delete(id, { $autoCancel: false });
      setIntakes(intakes.filter(i => i.id !== id));
      toast({ title: "Gelöscht", description: "Briefing wurde entfernt." });
    } catch (error) {
      console.error('Delete error:', error);
      toast({ title: "Fehler", description: "Löschen fehlgeschlagen.", variant: "destructive" });
    }
  };

  const startEdit = (intake) => {
    const cat = categories.find(c => c.id === intake.niche);
    setSelectedCategory(cat || categories[0]);
    setEditingIntake(intake);
    setActiveTab('new');
  };

  const filteredIntakes = intakes.filter(i => {
    const matchesTab = activeTab === 'drafts' ? i.status === 'Entwurf' : i.status !== 'Entwurf';
    if (!matchesTab && activeTab !== 'new') return false;
    
    const matchesSearch = (i.company_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (i.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (i.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#c4a850] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-x-hidden mx-auto p-8 space-y-8 bg-[#08080a] pb-20">
      <div className="max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-serif text-[#e8e4df] mb-2">Formulare & Briefings</h1>
          <p className="text-[#888888]">Verwalte eingehende Projektanfragen oder erstelle neue Briefings für Kunden.</p>
        </div>

        <StatsCards intakes={intakes} />

        {/* Tabs */}
        <div className="flex gap-2 border-b border-[rgba(255,255,255,0.05)] pb-px">
          {[
            { id: 'submitted', label: 'Eingereichte Briefings' },
            { id: 'drafts', label: 'Entwürfe' },
            { id: 'new', label: 'Neues Briefing', icon: Plus }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id !== 'new') {
                  setSelectedCategory(null);
                  setEditingIntake(null);
                }
              }}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all relative ${
                activeTab === tab.id ? 'text-[#c4a850]' : 'text-[#888888] hover:text-[#e8e4df]'
              }`}
            >
              {tab.icon && <tab.icon size={16} />}
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c4a850]" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="pt-4">
          {activeTab === 'new' ? (
            selectedCategory ? (
              <FormView 
                category={selectedCategory} 
                initialData={editingIntake} 
                users={users}
                onCancel={() => {
                  setSelectedCategory(null);
                  setEditingIntake(null);
                  setActiveTab('submitted');
                }}
                onSave={handleSaveForm}
              />
            ) : (
              <CategorySelection onSelect={setSelectedCategory} />
            )
          ) : (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5e6680]" size={18} />
                  <input 
                    type="text" 
                    placeholder="Suchen nach Name, Firma, Email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#0d0d0f] border border-[rgba(255,255,255,0.1)] rounded-lg py-2.5 pl-10 pr-4 text-sm text-[#e8e4df] focus:outline-none focus:border-[#c4a850]"
                  />
                </div>
                {activeTab === 'submitted' && (
                  <div className="flex items-center gap-2">
                    <Filter size={18} className="text-[#5e6680]" />
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-[#0d0d0f] border border-[rgba(255,255,255,0.1)] rounded-lg py-2.5 px-4 text-sm text-[#e8e4df] focus:outline-none focus:border-[#c4a850]"
                    >
                      <option value="all">Alle Status</option>
                      <option value="Eingereicht">Eingereicht</option>
                      <option value="In Bearbeitung">In Bearbeitung</option>
                      <option value="Bezahlt">Bezahlt</option>
                    </select>
                  </div>
                )}
              </div>

              {/* List */}
              <div className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl overflow-hidden">
                {filteredIntakes.length === 0 ? (
                  <div className="p-12 text-center text-[#888888]">
                    Keine Briefings gefunden.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#08080a] border-b border-[rgba(255,255,255,0.05)] text-[#a8b0c5]">
                        <tr>
                          <th className="px-6 py-4 font-medium">Kunde / Firma</th>
                          <th className="px-6 py-4 font-medium">Branche</th>
                          <th className="px-6 py-4 font-medium">Status</th>
                          <th className="px-6 py-4 font-medium">Datum</th>
                          <th className="px-6 py-4 font-medium text-right">Aktionen</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
                        {filteredIntakes.map(intake => (
                          <tr key={intake.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-medium text-[#e8e4df]">{intake.company_name || intake.name}</div>
                              <div className="text-xs text-[#888888]">{intake.email}</div>
                            </td>
                            <td className="px-6 py-4 text-[#a8b0c5] capitalize">{intake.niche || '-'}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                intake.status === 'Entwurf' ? 'bg-[rgba(255,255,255,0.05)] text-[#888888] border-[rgba(255,255,255,0.1)]' :
                                intake.status === 'Eingereicht' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                intake.status === 'In Bearbeitung' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                'bg-green-500/10 text-green-500 border-green-500/20'
                              }`}>
                                {intake.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-[#888888]">
                              {new Date(intake.created).toLocaleDateString('de-DE')}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => startEdit(intake)}
                                  className="p-2 text-[#888888] hover:text-[#c4a850] hover:bg-[rgba(196,168,80,0.1)] rounded-lg transition-colors"
                                  title="Bearbeiten"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button 
                                  onClick={() => handleDelete(intake.id)}
                                  className="p-2 text-[#888888] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                  title="Löschen"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
