import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { User, Lock, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Profile State
  const [profileData, setProfileData] = useState({
    name: '',
    company_name: '',
    phone: ''
  });
  const [profileStatus, setProfileStatus] = useState({ type: '', msg: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password State
  const [pwdData, setPwdData] = useState({
    oldPassword: '',
    password: '',
    passwordConfirm: ''
  });
  const [pwdStatus, setPwdStatus] = useState({ type: '', msg: '' });
  const [savingPwd, setSavingPwd] = useState(false);

  // Delete State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        company_name: user.company_name || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePwdChange = (e) => {
    setPwdData({ ...pwdData, [e.target.name]: e.target.value });
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileStatus({ type: '', msg: '' });
    try {
      await pb.collection('users').update(user.id, profileData, { $autoCancel: false });
      setProfileStatus({ type: 'success', msg: 'Profil erfolgreich aktualisiert.' });
    } catch (error) {
      console.error(error);
      setProfileStatus({ type: 'error', msg: 'Fehler beim Speichern des Profils.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPwdStatus({ type: '', msg: '' });

    if (pwdData.password.length < 8) {
      return setPwdStatus({ type: 'error', msg: 'Das neue Passwort muss mindestens 8 Zeichen lang sein.' });
    }
    if (pwdData.password !== pwdData.passwordConfirm) {
      return setPwdStatus({ type: 'error', msg: 'Die neuen Passwörter stimmen nicht überein.' });
    }

    setSavingPwd(true);
    try {
      await pb.collection('users').update(user.id, pwdData, { $autoCancel: false });
      setPwdStatus({ type: 'success', msg: 'Passwort erfolgreich geändert.' });
      setPwdData({ oldPassword: '', password: '', passwordConfirm: '' });
    } catch (error) {
      console.error(error);
      setPwdStatus({ type: 'error', msg: 'Fehler beim Ändern des Passworts. Altes Passwort korrekt?' });
    } finally {
      setSavingPwd(false);
    }
  };

  const deleteAccount = async () => {
    try {
      await pb.collection('users').delete(user.id, { $autoCancel: false });
      logout();
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Fehler beim Löschen des Kontos.');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#0a0f0d] relative overflow-hidden pb-20">
      {/* 2D Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none z-0" 
        style={{
          backgroundImage: `linear-gradient(rgba(196,168,80,0.04) 0.5px, transparent 0.5px), linear-gradient(90deg, rgba(196,168,80,0.04) 0.5px, transparent 0.5px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto space-y-8 pt-8">
        <header className="mb-8">
          <h1 className="text-4xl font-serif text-[#e8e4df] mb-2">Profil & Einstellungen</h1>
          <p className="text-[#a8b0c5] font-sans text-sm">Verwalte deine persönlichen Daten und Sicherheitseinstellungen.</p>
        </header>

        {/* Profile Section */}
        <section className="bg-[#141210]/90 backdrop-blur-sm border border-[rgba(196,168,80,0.12)] rounded-lg p-6 md:p-8">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[rgba(196,168,80,0.1)]">
            <div className="w-20 h-20 rounded-full bg-[#c4a850] flex items-center justify-center text-[#0a0f0d] text-2xl font-serif font-bold shadow-[0_0_20px_rgba(196,168,80,0.3)]">
              {getInitials(user?.name)}
            </div>
            <div>
              <h2 className="text-2xl font-serif text-[#e8e4df]">{user?.name || 'Benutzer'}</h2>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[#888888] font-sans text-sm">{user?.email}</span>
                {user?.selected_package && (
                  <span className="px-2 py-0.5 rounded bg-[rgba(196,168,80,0.1)] border border-[rgba(196,168,80,0.2)] text-[#c4a850] text-xs font-sans">
                    Paket: {user.selected_package}
                  </span>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={saveProfile} className="space-y-5">
            <h3 className="text-xl font-serif text-[#e8e4df] flex items-center gap-2 mb-4">
              <User size={18} className="text-[#c4a850]" /> Persönliche Daten
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-sans text-[#a8b0c5] mb-1.5">Vollständiger Name</label>
                <input 
                  type="text" name="name" value={profileData.name} onChange={handleProfileChange}
                  className="w-full bg-[#08090d] border border-[rgba(196,168,80,0.2)] rounded-md px-4 py-2.5 text-[#e8e4df] font-sans focus:outline-none focus:border-[#c4a850] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-sans text-[#a8b0c5] mb-1.5">E-Mail Adresse</label>
                <input 
                  type="email" value={user?.email || ''} disabled
                  className="w-full bg-[#08090d]/50 border border-[rgba(255,255,255,0.05)] rounded-md px-4 py-2.5 text-[#888888] font-sans cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-sans text-[#a8b0c5] mb-1.5">Firma / Praxis</label>
                <input 
                  type="text" name="company_name" value={profileData.company_name} onChange={handleProfileChange}
                  className="w-full bg-[#08090d] border border-[rgba(196,168,80,0.2)] rounded-md px-4 py-2.5 text-[#e8e4df] font-sans focus:outline-none focus:border-[#c4a850] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-sans text-[#a8b0c5] mb-1.5">Telefonnummer</label>
                <input 
                  type="tel" name="phone" value={profileData.phone} onChange={handleProfileChange}
                  className="w-full bg-[#08090d] border border-[rgba(196,168,80,0.2)] rounded-md px-4 py-2.5 text-[#e8e4df] font-sans focus:outline-none focus:border-[#c4a850] transition-colors"
                />
              </div>
            </div>

            {profileStatus.msg && (
              <div className={`p-3 rounded-md text-sm font-sans flex items-center gap-2 ${profileStatus.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {profileStatus.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                {profileStatus.msg}
              </div>
            )}

            <div className="pt-4">
              <button type="submit" disabled={savingProfile} className="px-6 py-2.5 bg-[#c4a850] text-[#0a0f0d] rounded-md font-sans font-medium hover:brightness-110 transition-all disabled:opacity-70">
                {savingProfile ? 'Speichert...' : 'Profil speichern'}
              </button>
            </div>
          </form>
        </section>

        {/* Password Section */}
        <section className="bg-[#141210]/90 backdrop-blur-sm border border-[rgba(196,168,80,0.12)] rounded-lg p-6 md:p-8">
          <form onSubmit={savePassword} className="space-y-5">
            <h3 className="text-xl font-serif text-[#e8e4df] flex items-center gap-2 mb-4">
              <Lock size={18} className="text-[#c4a850]" /> Passwort ändern
            </h3>
            
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-sans text-[#a8b0c5] mb-1.5">Aktuelles Passwort</label>
                <input 
                  type="password" name="oldPassword" value={pwdData.oldPassword} onChange={handlePwdChange} required
                  className="w-full bg-[#08090d] border border-[rgba(196,168,80,0.2)] rounded-md px-4 py-2.5 text-[#e8e4df] font-sans focus:outline-none focus:border-[#c4a850] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-sans text-[#a8b0c5] mb-1.5">Neues Passwort</label>
                <input 
                  type="password" name="password" value={pwdData.password} onChange={handlePwdChange} required minLength={8}
                  className="w-full bg-[#08090d] border border-[rgba(196,168,80,0.2)] rounded-md px-4 py-2.5 text-[#e8e4df] font-sans focus:outline-none focus:border-[#c4a850] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-sans text-[#a8b0c5] mb-1.5">Neues Passwort bestätigen</label>
                <input 
                  type="password" name="passwordConfirm" value={pwdData.passwordConfirm} onChange={handlePwdChange} required minLength={8}
                  className="w-full bg-[#08090d] border border-[rgba(196,168,80,0.2)] rounded-md px-4 py-2.5 text-[#e8e4df] font-sans focus:outline-none focus:border-[#c4a850] transition-colors"
                />
              </div>
            </div>

            {pwdStatus.msg && (
              <div className={`p-3 rounded-md text-sm font-sans flex items-center gap-2 max-w-md ${pwdStatus.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {pwdStatus.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                {pwdStatus.msg}
              </div>
            )}

            <div className="pt-4">
              <button type="submit" disabled={savingPwd} className="px-6 py-2.5 bg-[#141210] border border-[#c4a850] text-[#c4a850] rounded-md font-sans font-medium hover:bg-[rgba(196,168,80,0.1)] transition-all disabled:opacity-70">
                {savingPwd ? 'Speichert...' : 'Passwort ändern'}
              </button>
            </div>
          </form>
        </section>

        {/* Danger Zone */}
        <section className="bg-[#141210]/90 backdrop-blur-sm border border-red-900/30 rounded-lg p-6 md:p-8">
          <h3 className="text-xl font-serif text-red-400 flex items-center gap-2 mb-2">
            <Trash2 size={18} /> Gefahrenzone
          </h3>
          <p className="text-[#888888] font-sans text-sm mb-6">
            Wenn du dein Konto löschst, werden alle deine Daten, Projekte und Formulare unwiderruflich entfernt.
          </p>

          {!showDeleteConfirm ? (
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="px-6 py-2.5 bg-transparent border border-red-500/50 text-red-400 rounded-md font-sans font-medium hover:bg-red-500/10 transition-all"
            >
              Konto löschen
            </button>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 rounded-md p-4 max-w-md"
            >
              <p className="text-red-200 font-sans text-sm mb-4 flex items-start gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                Bist du sicher? Diese Aktion kann nicht rückgängig gemacht werden.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={deleteAccount}
                  className="px-4 py-2 bg-[#ff4444] text-white rounded-md font-sans text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Ja, Konto löschen
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-transparent text-[#a8b0c5] hover:text-white rounded-md font-sans text-sm transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            </motion.div>
          )}
        </section>

      </div>
    </div>
  );
}