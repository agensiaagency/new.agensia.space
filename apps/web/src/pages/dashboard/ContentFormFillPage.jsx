
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Send, CheckCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ContentFormFillPage() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState(null);
  const [response, setResponse] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [formId]);

  const fetchData = async () => {
    try {
      const formDoc = await api.content_forms.getOne(formId);
      setForm(formDoc);

      const responses = await api.content_form_responses.getByForm(formId);
      const userResponse = responses.find(r => r.user_id === user.id);
      
      if (userResponse) {
        setResponse(userResponse);
        setFormData(userResponse.field_data || {});
      } else {
        // Initialize empty form data
        const initialData = {};
        (formDoc.fields || []).forEach(f => {
          initialData[f.name] = f.type === 'checkbox' ? false : '';
        });
        setFormData(initialData);
      }
    } catch (error) {
      console.error('Error fetching form:', error);
      toast({ title: "Fehler", description: "Formular nicht gefunden.", variant: "destructive" });
      navigate('/dashboard/forms');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (status = 'entwurf') => {
    setIsSaving(true);
    try {
      const dataToSave = {
        form_id: formId,
        user_id: user.id,
        field_data: formData,
        status: status
      };

      if (status === 'eingereicht') {
        dataToSave.submitted_at = new Date().toISOString();
      }

      if (response) {
        await api.content_form_responses.update(response.id, dataToSave);
      } else {
        const newRes = await api.content_form_responses.create(dataToSave);
        setResponse(newRes);
      }

      toast({ 
        title: status === 'eingereicht' ? "Erfolgreich eingereicht" : "Entwurf gespeichert", 
        className: "bg-[#10b981] text-white border-none" 
      });
      
      if (status === 'eingereicht') {
        navigate('/dashboard/forms');
      }
    } catch (error) {
      toast({ title: "Fehler", description: "Konnte nicht gespeichert werden.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!form) return null;

  const fields = form.fields || [];
  const requiredFields = fields.filter(f => f.required);
  const completedRequired = requiredFields.filter(f => {
    const val = formData[f.name];
    return val !== undefined && val !== null && val !== '' && val !== false;
  }).length;
  const progress = requiredFields.length > 0 ? (completedRequired / requiredFields.length) * 100 : 100;

  const isSubmitted = response?.status === 'eingereicht' || response?.status === 'geprüft';

  return (
    <div className="max-w-full overflow-x-hidden mx-auto p-8 space-y-8 bg-[#08080a] pb-20">
      <DashboardHeader />
      
      <div className="max-w-4xl mx-auto space-y-8">
        <button 
          onClick={() => navigate('/dashboard/forms')} 
          className="flex items-center gap-2 text-[#888888] hover:text-[#c4a850] transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Zurück zur Übersicht
        </button>

        <div className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl overflow-hidden">
          <div className="p-8 border-b border-[rgba(255,255,255,0.05)] bg-[#08080a] relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-[rgba(255,255,255,0.05)]">
              <div className="h-full bg-[#c4a850] transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <h1 className="text-2xl font-serif text-[#e8e4df] mb-2">{form.title}</h1>
            <p className="text-[#888888]">{form.description}</p>
            
            {isSubmitted && (
              <div className="mt-4 inline-flex items-center gap-2 bg-green-500/10 text-green-500 px-3 py-1.5 rounded-md text-sm font-medium border border-green-500/20">
                <CheckCircle size={16} /> Formular wurde eingereicht
              </div>
            )}
          </div>

          <div className="p-8 space-y-8">
            {fields.map((field, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <label className="block text-sm font-medium text-[#e8e4df] mb-2">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                
                {field.type === 'textarea' ? (
                  <textarea
                    disabled={isSubmitted}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    rows={5}
                    className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-[#e8e4df] focus:outline-none focus:border-[#c4a850] resize-y disabled:opacity-50"
                  />
                ) : field.type === 'select' ? (
                  <select
                    disabled={isSubmitted}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-[#e8e4df] focus:outline-none focus:border-[#c4a850] disabled:opacity-50"
                  >
                    <option value="">Bitte wählen...</option>
                    {(field.options || []).map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : field.type === 'checkbox' ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      disabled={isSubmitted}
                      checked={formData[field.name] || false}
                      onChange={(e) => handleInputChange(field.name, e.target.checked)}
                      className="w-5 h-5 rounded border-[rgba(255,255,255,0.2)] bg-[#08080a] text-[#c4a850] focus:ring-[#c4a850] disabled:opacity-50"
                    />
                    <span className="text-sm text-[#888888]">Ja, ich stimme zu</span>
                  </div>
                ) : field.type === 'file' ? (
                  <div className="border-2 border-dashed border-[rgba(255,255,255,0.1)] rounded-lg p-6 text-center bg-[#08080a]">
                    <input type="file" disabled={isSubmitted} className="text-sm text-[#888888] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-[rgba(196,168,80,0.1)] file:text-[#c4a850] hover:file:bg-[rgba(196,168,80,0.2)] disabled:opacity-50" />
                  </div>
                ) : (
                  <input
                    type="text"
                    disabled={isSubmitted}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-[#e8e4df] focus:outline-none focus:border-[#c4a850] disabled:opacity-50"
                  />
                )}
              </motion.div>
            ))}
          </div>

          {!isSubmitted && (
            <div className="p-6 border-t border-[rgba(255,255,255,0.05)] bg-[#08080a] flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-[#888888]">
                {completedRequired} von {requiredFields.length} Pflichtfeldern ausgefüllt
              </p>
              <div className="flex gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => handleSave('entwurf')}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0d0d0f] border border-[rgba(255,255,255,0.1)] text-[#e8e4df] rounded-lg font-medium hover:bg-[rgba(255,255,255,0.05)] transition-colors disabled:opacity-50"
                >
                  <Save size={18} /> Entwurf speichern
                </button>
                <button 
                  onClick={() => handleSave('eingereicht')}
                  disabled={isSaving || progress < 100}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#c4a850] text-[#08080a] rounded-lg font-medium hover:bg-[#d4bc6a] transition-colors disabled:opacity-50"
                >
                  <Send size={18} /> Einreichen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
