
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import pb from '@/lib/pocketbaseClient';
import { useToast } from '@/hooks/use-toast';

// Import steps dynamically or directly
import IntakeStep1 from '@/components/intake/IntakeStep1';
import IntakeStep2 from '@/components/intake/IntakeStep2';
import IntakeStep3 from '@/components/intake/IntakeStep3';
import IntakeStep4 from '@/components/intake/IntakeStep4';
import IntakeStep5 from '@/components/intake/IntakeStep5';
import IntakeStep6 from '@/components/intake/IntakeStep6';
import IntakeStep7 from '@/components/intake/IntakeStep7';

const TOTAL_STEPS = 7;

export default function IntakePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    niche: '',
    company_name: '',
    website: '',
    goals: '',
    package: '',
    colors: '',
    style: '',
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const pkg = searchParams.get('package');
    if (pkg && !formData.package) {
      setFormData(prev => ({ ...prev, package: pkg }));
    }
  }, [searchParams]);

  const updateFormData = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const submissionData = {
        ...formData,
        user_id: user?.id || null,
        status: 'Entwurf',
        form_data: formData // Store full object in JSON field as backup
      };

      await pb.collection('intake_submissions').create(submissionData, { $autoCancel: false });
      
      toast({
        title: "Erfolgreich gespeichert",
        description: "Dein Briefing wurde übermittelt.",
        className: "bg-[#10b981] text-white border-none"
      });
      
      navigate(`/intake/checkout?category=${formData.niche || 'general'}`);
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Fehler",
        description: "Es gab ein Problem beim Speichern. Bitte versuche es erneut.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <IntakeStep1 formData={formData} updateFormData={updateFormData} />;
      case 2: return <IntakeStep2 formData={formData} updateFormData={updateFormData} />;
      case 3: return <IntakeStep3 formData={formData} updateFormData={updateFormData} />;
      case 4: return <IntakeStep4 formData={formData} updateFormData={updateFormData} />;
      case 5: return <IntakeStep5 formData={formData} updateFormData={updateFormData} />;
      case 6: return <IntakeStep6 formData={formData} updateFormData={updateFormData} />;
      case 7: return <IntakeStep7 formData={formData} updateFormData={updateFormData} />;
      default: return <IntakeStep1 formData={formData} updateFormData={updateFormData} />;
    }
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8e4df] font-sans pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Progress Header */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 text-[#888888] hover:text-[#c4a850] transition-colors text-sm font-medium"
            >
              <ArrowLeft size={16} /> Zurück
            </button>
            <span className="text-sm font-medium text-[#a8b0c5]">
              Schritt {currentStep} von {TOTAL_STEPS}
            </span>
          </div>
          
          <div className="w-full h-2 bg-[#141210] rounded-full overflow-hidden border border-[rgba(255,255,255,0.05)]">
            <motion.div 
              className="h-full bg-[#c4a850]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Step Indicators */}
          <div className="hidden md:flex justify-between mt-6 px-2">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
              const stepNum = i + 1;
              const isPast = stepNum < currentStep;
              const isActive = stepNum === currentStep;
              
              return (
                <div key={stepNum} className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    isPast ? 'bg-[#c4a850] text-[#0a0f0d]' :
                    isActive ? 'bg-[#141210] border-2 border-[#c4a850] text-[#c4a850]' :
                    'bg-[#141210] border border-[rgba(255,255,255,0.1)] text-[#888888]'
                  }`}>
                    {isPast ? <CheckCircle size={16} /> : stepNum}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-[#141210] border border-[rgba(196,168,80,0.12)] rounded-2xl p-6 md:p-10 shadow-2xl min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Footer */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-[#c4a850] text-[#0a0f0d] px-8 py-3.5 rounded-xl font-medium hover:bg-[#d4bc6a] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? 'Wird gespeichert...' : currentStep === TOTAL_STEPS ? 'Abschließen' : 'Weiter'}
            {!isSubmitting && currentStep !== TOTAL_STEPS && <ArrowRight size={18} />}
          </button>
        </div>

      </div>
    </div>
  );
}
