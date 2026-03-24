import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import PasswordResetModal from '@/components/PasswordResetModal.jsx';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  
  const { login, signup, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoggedIn) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (isLogin) {
      const res = await login(email, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.error);
      }
    } else {
      if (!name) {
        setError('Name ist erforderlich.');
        setIsSubmitting(false);
        return;
      }
      if (password.length < 8) {
        setError('Passwort muss mindestens 8 Zeichen lang sein.');
        setIsSubmitting(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwörter stimmen nicht überein.');
        setIsSubmitting(false);
        return;
      }
      
      const res = await signup(name, email, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.error);
      }
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#08090d] flex items-center justify-center p-6">
      <Helmet>
        <title>Login · agensia</title>
      </Helmet>

      <div className="w-full max-w-md bg-[rgba(12,14,20,0.7)] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-8 shadow-2xl backdrop-blur-sm">
        <div className="flex mb-8 border-b border-[rgba(255,255,255,0.1)]">
          <button 
            className={`flex-1 pb-4 text-lg font-serif transition-colors relative ${isLogin ? 'text-[#d4a850]' : 'text-[#a8b0c5] hover:text-[#edf0f7]'}`}
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            Anmelden
            {isLogin && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#d4a850]" />}
          </button>
          <button 
            className={`flex-1 pb-4 text-lg font-serif transition-colors relative ${!isLogin ? 'text-[#d4a850]' : 'text-[#a8b0c5] hover:text-[#edf0f7]'}`}
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            Registrieren
            {!isLogin && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#d4a850]" />}
          </button>
        </div>

        {error && <div className="mb-6 p-3 bg-[#d4a850]/10 border border-[#d4a850]/30 text-[#d4a850] rounded-md text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm text-[#a8b0c5] mb-1">Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#08090d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7] focus:outline-none focus:border-[#d4a850]"
                required={!isLogin}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm text-[#a8b0c5] mb-1">E-Mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#08090d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7] focus:outline-none focus:border-[#d4a850]"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-[#a8b0c5] mb-1">Passwort</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#08090d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7] focus:outline-none focus:border-[#d4a850]"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm text-[#a8b0c5] mb-1">Passwort bestätigen</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#08090d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7] focus:outline-none focus:border-[#d4a850]"
                required={!isLogin}
              />
            </div>
          )}

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-4 bg-[#d4a850] text-[#08090d] rounded-md font-medium hover:brightness-110 transition-all disabled:opacity-70"
          >
            {isSubmitting ? 'Bitte warten...' : (isLogin ? 'Anmelden' : 'Registrieren')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          {isLogin ? (
            <>
              <button onClick={() => setIsResetModalOpen(true)} className="text-[#a8b0c5] hover:text-[#d4a850] mb-2 block w-full">
                Passwort vergessen?
              </button>
              <button onClick={() => { setIsLogin(false); setError(''); }} className="text-[#a8b0c5] hover:text-[#edf0f7]">
                Noch kein Konto? <span className="text-[#d4a850]">Registrieren</span>
              </button>
            </>
          ) : (
            <button onClick={() => { setIsLogin(true); setError(''); }} className="text-[#a8b0c5] hover:text-[#edf0f7]">
              Bereits registriert? <span className="text-[#d4a850]">Anmelden</span>
            </button>
          )}
        </div>
      </div>

      <PasswordResetModal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)} />
    </div>
  );
}