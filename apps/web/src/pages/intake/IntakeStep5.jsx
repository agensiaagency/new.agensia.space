
import React, { useState } from 'react';
import { useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import { useIntake } from '@/contexts/IntakeContext';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { colorGroups } from '@/lib/categories';

export default function IntakeStep5() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromDashboard = searchParams.get('from') === 'dashboard';
  const { category, formData, updateFormData } = useIntake();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!category) return <Navigate to="/intake" replace />;

  const { step5 } = formData;
  const isBlue = category.color === colorGroups.blue;

  const toggleAsset = (asset) => {
    const current = step5.assets || [];
    const updated = current.includes(asset)
      ? current.filter(a => a !== asset)
      : [...current, asset];
    updateFormData('step5', { assets: updated });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      // Determine recommended package based on budget
      const budget = formData.step2?.budget || '';
      let recommendedPackage = 'professional';
      if (budget.includes('2.000') || budget.includes('3.000')) {
        recommendedPackage = 'premium';
      } else if (budget.includes('500') || budget.includes('1.000')) {
        recommendedPackage = 'starter';
      }

      const submissionData = {
        status: 'Eingereicht',
        niche: category.id,
        company_name: formData.step1?.companyName || '',
        selected_package: recommendedPackage,
        name: formData.step1?.name || '',
        email: formData.step1?.email || '',
        phone: formData.step1?.phone || '',
        dsgvoAccepted: true,
        form_data: formData,
      };

      if (user?.id) {
        submissionData.user_id = user.id;
      }

      const result = await api.intake_submissions.create(submissionData);
      
      if (fromDashboard) {
        navigate('/dashboard/overview');
      } else {
        navigate(`/intake/confirmation?submissionId=${result.id}`);
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError('Es gab ein Problem beim Senden. Bitte versuche es erneut.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 flex-1 w-full">
      <h2 className="text-4xl font-serif mb-2 text-[#e8e4df]">Fast geschafft.</h2>
      <p className="text-[#888888] mb-10">
        {isBlue ? 'Welche Materialien liegen Ihnen bereits vor?' : 'Welche Materialien liegen dir bereits vor?'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {['Logo (Vektor/PNG)', 'Corporate Design Manual', 'Professionelle Fotos', 'Texte für die Website', 'Videos', 'Nichts davon'].map(asset => {
          const isActive = (step5.assets || []).includes(asset);
          return (
            <button
              key={asset}
              onClick={() => toggleAsset(asset)}
              className={`p-4 rounded-xl border text-left transition-all duration-200 flex items-center gap-3 ${
                isActive 
                  ? 'bg-[rgba(255,255,255,0.05)]' 
                  : 'bg-[rgba(16,21,18,0.6)] border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.1)]'
              }`}
              style={{ borderColor: isActive ? category.color : undefined }}
            >
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isActive ? 'border-transparent' : 'border-[rgba(255,255,255,0.2)]'}`} style={{ backgroundColor: isActive ? category.color : 'transparent' }}>
                {isActive && <div className="w-2 h-2 bg-[#0a0f0d] rounded-full" />}
              </div>
              <span className={`text-sm ${isActive ? 'text-[#e8e4df]' : 'text-[#888888]'}`}>{asset}</span>
            </button>
          );
        })}
      </div>

      <div className="mb-10">
        <label className="block text-lg font-serif text-[#e8e4df] mb-4">
          {isBlue ? 'Haben Sie noch weitere Anmerkungen?' : 'Hast du noch weitere Anmerkungen?'}
        </label>
        <textarea 
          value={step5.notes || ''} 
          onChange={(e) => updateFormData('step5', { notes: e.target.value })} 
          rows={4} 
          className="w-full bg-[rgba(16,21,18,0.6)] border border-[rgba(255,255,255,0.1)] rounded-xl px-5 py-3 text-[#e8e4df] focus:outline-none focus:border-opacity-50 transition-colors resize-none" 
          placeholder="Optional..."
        />
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-between pt-8">
        <button onClick={() => navigate(`/intake/step4${fromDashboard ? '?from=dashboard' : ''}`)} className="px-6 py-3 rounded-full border border-[rgba(255,255,255,0.1)] text-[#888888] hover:text-white transition-colors">
          Zurück
        </button>
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="px-8 py-3 rounded-full text-[#0a0f0d] font-medium transition-all hover:brightness-110 disabled:opacity-50" 
          style={{ backgroundColor: category.color }}
        >
          {isSubmitting ? 'Wird gesendet...' : 'Briefing abschließen'}
        </button>
      </div>
    </div>
  );
}
