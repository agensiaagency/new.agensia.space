
import React, { useEffect } from 'react';
import { useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import { useIntake } from '@/contexts/IntakeContext';
import { useAuth } from '@/contexts/AuthContext';
import { colorGroups } from '@/lib/categories';

export default function IntakeStep1() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nicheParam = searchParams.get('niche');
  const fromDashboard = searchParams.get('from') === 'dashboard';
  const { category, formData, updateFormData } = useIntake();
  const { user } = useAuth();

  useEffect(() => {
    if (user && !formData.step1.name) {
      updateFormData('step1', {
        name: user.name || '',
        email: user.email || '',
        companyName: user.company_name || '',
        phone: user.phone || ''
      });
    }
  }, [user, formData.step1.name, updateFormData]);

  if (!category && !nicheParam) return <Navigate to="/intake" replace />;
  if (!category) return null; // Wait for context to sync

  const { step1 } = formData;
  const isBlue = category.color === colorGroups.blue;

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/intake/step2${fromDashboard ? '?from=dashboard' : ''}`);
  };

  const handleChange = (e) => {
    updateFormData('step1', { [e.target.name]: e.target.value });
  };

  const inputClass = "w-full bg-[rgba(16,21,18,0.6)] border border-[rgba(255,255,255,0.1)] rounded-xl px-5 py-3 text-[#e8e4df] focus:outline-none focus:border-opacity-50 transition-colors";

  return (
    <div className="max-w-3xl mx-auto px-6 py-20 flex-1 w-full">
      <h2 className="text-4xl font-serif mb-2 text-[#e8e4df]">Lass uns starten.</h2>
      <p className="text-[#888888] mb-10">
        {isBlue ? 'Erzählen Sie uns ein wenig über sich und Ihre Praxis.' : 'Erzähl mir ein wenig über dich und dein Projekt.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {isBlue && (
          <div>
            <label className="block text-sm text-[#888888] mb-2">Titel (z.B. Dr. med.)</label>
            <input type="text" name="title" value={step1.title} onChange={handleChange} className={inputClass} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-[#888888] mb-2">Name *</label>
            <input required type="text" name="name" value={step1.name} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-[#888888] mb-2">E-Mail *</label>
            <input required type="email" name="email" value={step1.email} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-[#888888] mb-2">{isBlue ? 'Praxisname / Firmenname *' : 'Firmenname *'}</label>
            <input required type="text" name="companyName" value={step1.companyName} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-[#888888] mb-2">{isBlue ? 'Ihre Rolle / Position *' : 'Deine Rolle *'}</label>
            <input required type="text" name="role" value={step1.role} onChange={handleChange} placeholder={isBlue ? "z.B. Inhaber, Praxismanager" : "z.B. Gründer, Inhaber"} className={inputClass} />
          </div>
        </div>

        <div>
          <label className="block text-sm text-[#888888] mb-2">Standort *</label>
          <input required type="text" name="location" value={step1.location} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className="block text-sm text-[#888888] mb-2">{isBlue ? 'Kurze Beschreibung Ihrer Praxis *' : 'Kurze Beschreibung deines Business *'}</label>
          <textarea required name="description" value={step1.description} onChange={handleChange} rows={4} className={`${inputClass} resize-none`} placeholder={isBlue ? "Was zeichnet Ihre Praxis aus?" : "Was machst du genau?"} />
        </div>

        <div className="flex justify-between pt-8">
          <button type="button" onClick={() => navigate(fromDashboard ? '/dashboard/briefing' : '/')} className="px-6 py-3 rounded-full border border-[rgba(255,255,255,0.1)] text-[#888888] hover:text-white transition-colors">
            Zurück
          </button>
          <button type="submit" className="px-8 py-3 rounded-full text-[#0a0f0d] font-medium transition-all hover:brightness-110" style={{ backgroundColor: category.color }}>
            Weiter
          </button>
        </div>
      </form>
    </div>
  );
}
