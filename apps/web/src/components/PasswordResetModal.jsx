import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { X } from 'lucide-react';

export default function PasswordResetModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { resetPassword } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    const res = await resetPassword(email);
    if (res.success) {
      setStatus({ type: 'success', message: 'E-Mail zum Zurücksetzen wurde gesendet.' });
      setEmail('');
    } else {
      setStatus({ type: 'error', message: res.error });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#12151e] border border-[rgba(255,255,255,0.1)] rounded-[20px] p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#a8b0c5] hover:text-white">
          <X size={20} />
        </button>
        <h2 className="text-2xl font-serif text-[#edf0f7] mb-4">Passwort zurücksetzen</h2>
        
        {status.message && (
          <div className={`p-3 mb-4 rounded-md text-sm ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-[#a8b0c5] mb-1">E-Mail Adresse</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#08090d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7] focus:outline-none focus:border-[#d4a850]"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-[#d4a850] text-[#08090d] rounded-md font-medium hover:brightness-110 transition-all disabled:opacity-70"
          >
            {isSubmitting ? 'Wird gesendet...' : 'Link anfordern'}
          </button>
        </form>
      </div>
    </div>
  );
}