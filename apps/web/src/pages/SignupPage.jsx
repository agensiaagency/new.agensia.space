
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { ArrowRight, Mail, Lock, User, Building, Phone, Sparkles } from 'lucide-react';
import AgensiaLogo from '@/components/AgensiaLogo';

export default function SignupPage() {
  const [searchParams] = useSearchParams();
  const submissionId = searchParams.get('submissionId');
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company_name: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const packageInfo = {
    package: searchParams.get('package'),
    term: searchParams.get('term'),
    monthly: searchParams.get('monthly'),
    base: searchParams.get('base')
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.password,
        company_name: formData.company_name,
        phone: formData.phone,
        role: 'user',
        selected_package: packageInfo.package || '',
        selected_term: packageInfo.term || '',
        monthly_price: Number(packageInfo.monthly) || 0,
        base_price: Number(packageInfo.base) || 0
      });

      // Non-blocking project creation
      try {
        await api.projects.createProject({
          userId: user.id,
          title: `Website für ${formData.company_name || formData.name}`,
          nicheId: searchParams.get('category') || searchParams.get('niche') || 'custom',
          packageId: packageInfo.package || 'starter',
          status: 'planning'
        });
      } catch (projErr) {
        console.warn('Non-blocking project creation failed:', projErr);
      }

      if (submissionId) {
        try {
          await api.intake_submissions.update(submissionId, { user_id: user.id });
        } catch (err) {
          console.warn('Failed to link submission:', err);
        }
      }

      navigate('/dashboard/overview');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f0d] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#c4a850] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <Link to="/">
            <AgensiaLogo className="h-8 text-[#e8e4df]" />
          </Link>
        </div>
        <h2 className="text-center text-3xl font-serif text-[#e8e4df]">
          Account erstellen
        </h2>
        <p className="mt-2 text-center text-sm text-[#888888]">
          Oder{' '}
          <Link to={`/login${submissionId ? `?submissionId=${submissionId}` : ''}`} className="font-medium text-[#c4a850] hover:text-[#d4bc6a] transition-colors">
            melde dich bei deinem bestehenden Account an
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#141210] py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-[rgba(196,168,80,0.12)]"
        >
          {packageInfo.package && (
            <div className="mb-6 p-4 rounded-xl border border-[#c4a850]/30 bg-[rgba(196,168,80,0.05)] flex items-start gap-3">
              <Sparkles className="text-[#c4a850] shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="text-sm font-medium text-[#e8e4df] mb-1">Gewähltes Paket: <span className="capitalize">{packageInfo.package}</span></h4>
                <p className="text-xs text-[#a8b0c5]">Einmalig €{packageInfo.base} + €{packageInfo.monthly}/Mo. Erstelle deinen Account, um fortzufahren.</p>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-[#a8b0c5] mb-1">Vollständiger Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#5e6680]" />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-[rgba(255,255,255,0.1)] rounded-xl bg-[#0a0f0d] text-[#e8e4df] placeholder-[#5e6680] focus:outline-none focus:ring-1 focus:ring-[#c4a850] focus:border-[#c4a850] sm:text-sm transition-colors"
                  placeholder="Max Mustermann"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#a8b0c5] mb-1">Firma (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-[#5e6680]" />
                </div>
                <input
                  name="company_name"
                  type="text"
                  value={formData.company_name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-[rgba(255,255,255,0.1)] rounded-xl bg-[#0a0f0d] text-[#e8e4df] placeholder-[#5e6680] focus:outline-none focus:ring-1 focus:ring-[#c4a850] focus:border-[#c4a850] sm:text-sm transition-colors"
                  placeholder="Muster GmbH"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#a8b0c5] mb-1">E-Mail Adresse</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#5e6680]" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-[rgba(255,255,255,0.1)] rounded-xl bg-[#0a0f0d] text-[#e8e4df] placeholder-[#5e6680] focus:outline-none focus:ring-1 focus:ring-[#c4a850] focus:border-[#c4a850] sm:text-sm transition-colors"
                  placeholder="max@beispiel.de"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#a8b0c5] mb-1">Telefon (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-[#5e6680]" />
                </div>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-[rgba(255,255,255,0.1)] rounded-xl bg-[#0a0f0d] text-[#e8e4df] placeholder-[#5e6680] focus:outline-none focus:ring-1 focus:ring-[#c4a850] focus:border-[#c4a850] sm:text-sm transition-colors"
                  placeholder="+49 123 456789"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#a8b0c5] mb-1">Passwort</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#5e6680]" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-[rgba(255,255,255,0.1)] rounded-xl bg-[#0a0f0d] text-[#e8e4df] placeholder-[#5e6680] focus:outline-none focus:ring-1 focus:ring-[#c4a850] focus:border-[#c4a850] sm:text-sm transition-colors"
                  placeholder="Mindestens 8 Zeichen"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-[#0a0f0d] bg-[#c4a850] hover:bg-[#d4bc6a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c4a850] focus:ring-offset-[#141210] transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? 'Wird erstellt...' : 'Account erstellen'} <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
