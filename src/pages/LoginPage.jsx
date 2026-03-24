
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { api } from '@/lib/api.js';
import pb from '@/lib/pocketbaseClient.js';
import GridBackgroundPattern from '@/components/GridBackgroundPattern.jsx';
import AgensiaLogo from '@/components/AgensiaLogo.jsx';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const submissionId = searchParams.get('submissionId');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const result = await login(email, password);
    if (result.success) {
      if (submissionId && pb.authStore.model?.id) {
        try {
          await api.intake_submissions.update(submissionId, { user_id: pb.authStore.model.id });
        } catch (err) {
          console.error('Failed to link submission:', err);
        }
      }
      navigate('/dashboard/overview');
    } else {
      setError(result.error || 'Login fehlgeschlagen.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0f0d] flex items-center justify-center relative px-4">
      <GridBackgroundPattern useCycle={true} glowOpacity={0.06} />
      
      <div className="w-full max-w-md bg-[hsl(var(--surface))] bg-opacity-90 border border-[hsl(var(--border))] rounded-[var(--radius)] p-8 md:p-10 relative z-10 shadow-2xl backdrop-blur-sm">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2 group">
            <AgensiaLogo size={28} gold />
            <span className="text-3xl font-serif lowercase text-[#e8e4df] leading-none tracking-wide">
              agensia
            </span>
          </Link>
        </div>

        <h1 className="text-3xl font-serif text-[#e8e4df] text-center mb-8">Willkommen zurück.</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="E-Mail Adresse"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#0a0f0d] border border-[rgba(255,255,255,0.1)] rounded-[4px] px-[18px] py-[14px] text-[#e8e4df] placeholder-[#888888] focus:outline-none focus:border-[#c4a850] focus:ring-1 focus:ring-[#c4a850] transition-all"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#0a0f0d] border border-[rgba(255,255,255,0.1)] rounded-[4px] px-[18px] py-[14px] text-[#e8e4df] placeholder-[#888888] focus:outline-none focus:border-[#c4a850] focus:ring-1 focus:ring-[#c4a850] transition-all"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-[#888888] hover:text-[#e8e4df] transition-colors">
              <input type="checkbox" className="rounded border-[rgba(255,255,255,0.2)] bg-[#0a0f0d] text-[#c4a850] focus:ring-[#c4a850] focus:ring-offset-0" />
              Angemeldet bleiben
            </label>
            <Link to="/forgot-password" className="text-[#e8e4df] hover:underline decoration-[#c4a850] underline-offset-4 transition-all">
              Passwort vergessen?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#c4a850] text-[#0a0f0d] font-medium py-[14px] rounded-[4px] hover:bg-[#d4bc6a] transition-colors disabled:opacity-70 mt-4"
          >
            {isLoading ? 'Wird eingeloggt...' : 'einloggen'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-[#888888]">
          Noch kein Konto?{' '}
          <Link to={`/register${submissionId ? `?submissionId=${submissionId}` : ''}`} className="text-[#e8e4df] hover:underline decoration-[#c4a850] underline-offset-4 transition-all">
            Registrieren
          </Link>
        </div>
      </div>
    </div>
  );
}
