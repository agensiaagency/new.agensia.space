
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Mail, Bell, Palette, Link as LinkIcon, Users, Database, Package, Save, Download, Trash2, Loader } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const tabs = [
    { id: 'general', label: 'Allgemein', icon: Settings },
    { id: 'packages', label: 'Pakete & Preise', icon: Package },
    { id: 'email', label: 'E-Mail', icon: Mail },
    { id: 'notifications', label: 'Benachrichtigungen', icon: Bell },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'integrations', label: 'Integrationen', icon: LinkIcon },
    { id: 'users', label: 'Benutzer', icon: Users },
    { id: 'data', label: 'Daten & Backup', icon: Database },
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await api.app_settings.getAll();
      const settingsMap = {};
      data.forEach(item => {
        settingsMap[item.key] = item.value;
      });
      setSettings(settingsMap);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save all settings for the active tab
      const keysToSave = Object.keys(settings).filter(k => k.startsWith(activeTab + '_'));
      for (const key of keysToSave) {
        await api.app_settings.set(key, settings[key], activeTab);
      }
      toast({ title: "Gespeichert", description: "Einstellungen wurden aktualisiert.", className: "bg-[#10b981] text-white border-none" });
    } catch (error) {
      toast({ title: "Fehler", description: "Konnte nicht gespeichert werden.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) return (<div className="p-8 flex items-center justify-center"><Loader className="w-8 h-8 text-[#c4a850] animate-spin" /></div>);

  return (
    <div className="space-y-8 pb-20 max-w-full overflow-x-hidden mx-auto p-8 bg-[#08080a]">
      <DashboardHeader />
      
      <div className="max-w-6xl mx-auto">
        <div>
          <h1 className="text-3xl font-serif text-[#e8e4df] mb-2">Plattform Einstellungen</h1>
          <p className="text-[#888888]">Konfiguriere die globalen Parameter der agensia Plattform.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mt-8">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-[rgba(196,168,80,0.1)] text-[#c4a850]' 
                    : 'text-[#888888] hover:bg-[rgba(255,255,255,0.03)] hover:text-[#e8e4df]'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl p-6 md:p-8 min-h-[500px]">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-[rgba(255,255,255,0.05)]">
              <h2 className="text-xl font-medium text-[#e8e4df]">{tabs.find(t => t.id === activeTab)?.label}</h2>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-[#c4a850] text-[#08080a] px-4 py-2 rounded-md text-sm font-medium hover:bg-[#d4bc6a] transition-colors disabled:opacity-50"
              >
                <Save size={16} /> {isSaving ? 'Speichert...' : 'Speichern'}
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* GENERAL TAB */}
                {activeTab === 'general' && (
                  <div className="space-y-4 max-w-xl">
                    <div>
                      <label className="block text-sm text-[#888888] mb-1">Firmenname</label>
                      <input 
                        type="text" 
                        value={settings['general_company_name'] || ''} 
                        onChange={e => handleChange('general_company_name', e.target.value)}
                        className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#888888] mb-1">Kontakt E-Mail</label>
                      <input 
                        type="email" 
                        value={settings['general_contact_email'] || ''} 
                        onChange={e => handleChange('general_contact_email', e.target.value)}
                        className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#888888] mb-1">Zeitzone</label>
                      <select 
                        value={settings['general_timezone'] || 'Europe/Berlin'} 
                        onChange={e => handleChange('general_timezone', e.target.value)}
                        className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none"
                      >
                        <option value="Europe/Berlin">Europe/Berlin</option>
                        <option value="Europe/London">Europe/London</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <input 
                        type="checkbox" 
                        id="maintenance"
                        checked={settings['general_maintenance_mode'] === 'true'} 
                        onChange={e => handleChange('general_maintenance_mode', e.target.checked ? 'true' : 'false')}
                        className="w-4 h-4 rounded border-[rgba(255,255,255,0.2)] bg-[#08080a] text-[#c4a850] focus:ring-[#c4a850]" 
                      />
                      <label htmlFor="maintenance" className="text-sm text-[#e8e4df]">Wartungsmodus aktivieren (Nur Admins können sich einloggen)</label>
                    </div>
                  </div>
                )}

                {/* PACKAGES TAB */}
                {activeTab === 'packages' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['starter', 'professional', 'premium'].map(pkg => (
                      <div key={pkg} className="bg-[#08080a] border border-[rgba(255,255,255,0.05)] rounded-xl p-4 space-y-4">
                        <h3 className="text-[#e8e4df] font-medium capitalize">{pkg} Paket</h3>
                        <div>
                          <label className="block text-xs text-[#888888] mb-1">Preis (€)</label>
                          <input 
                            type="number" 
                            value={settings[`packages_${pkg}_price`] || ''} 
                            onChange={e => handleChange(`packages_${pkg}_price`, e.target.value)}
                            className="w-full bg-[#0d0d0f] border border-[rgba(255,255,255,0.1)] rounded-md px-3 py-1.5 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none text-sm" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#888888] mb-1">Inklusive Revisionen</label>
                          <input 
                            type="number" 
                            value={settings[`packages_${pkg}_revisions`] || ''} 
                            onChange={e => handleChange(`packages_${pkg}_revisions`, e.target.value)}
                            className="w-full bg-[#0d0d0f] border border-[rgba(255,255,255,0.1)] rounded-md px-3 py-1.5 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none text-sm" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#888888] mb-1">Features (kommagetrennt)</label>
                          <textarea 
                            rows={3}
                            value={settings[`packages_${pkg}_features`] || ''} 
                            onChange={e => handleChange(`packages_${pkg}_features`, e.target.value)}
                            className="w-full bg-[#0d0d0f] border border-[rgba(255,255,255,0.1)] rounded-md px-3 py-1.5 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none text-sm resize-none" 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* EMAIL TAB */}
                {activeTab === 'email' && (
                  <div className="space-y-4 max-w-xl">
                    <div>
                      <label className="block text-sm text-[#888888] mb-1">SMTP Host</label>
                      <input 
                        type="text" 
                        value={settings['email_smtp_host'] || ''} 
                        onChange={e => handleChange('email_smtp_host', e.target.value)}
                        className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#888888] mb-1">SMTP Port</label>
                      <input 
                        type="text" 
                        value={settings['email_smtp_port'] || ''} 
                        onChange={e => handleChange('email_smtp_port', e.target.value)}
                        className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#888888] mb-1">SMTP User</label>
                      <input 
                        type="text" 
                        value={settings['email_smtp_user'] || ''} 
                        onChange={e => handleChange('email_smtp_user', e.target.value)}
                        className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#888888] mb-1">SMTP Password</label>
                      <input 
                        type="password" 
                        value={settings['email_smtp_password'] || ''} 
                        onChange={e => handleChange('email_smtp_password', e.target.value)}
                        className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none" 
                      />
                    </div>
                    <button className="mt-4 px-4 py-2 bg-[rgba(255,255,255,0.05)] text-[#e8e4df] rounded-md hover:bg-[rgba(255,255,255,0.1)] transition-colors text-sm">
                      Test E-Mail senden
                    </button>
                  </div>
                )}

                {/* NOTIFICATIONS TAB */}
                {activeTab === 'notifications' && (
                  <div className="space-y-4 max-w-xl">
                    {[
                      { id: 'new_customer', label: 'Neuer Kunde registriert' },
                      { id: 'form_submitted', label: 'Formular eingereicht' },
                      { id: 'new_message', label: 'Neue Nachricht erhalten' },
                      { id: 'revision_requested', label: 'Neue Revision angefordert' },
                      { id: 'file_uploaded', label: 'Neue Datei hochgeladen' }
                    ].map(notif => (
                      <div key={notif.id} className="flex items-center gap-3 p-3 bg-[#08080a] border border-[rgba(255,255,255,0.05)] rounded-lg">
                        <input 
                          type="checkbox" 
                          id={`notif_${notif.id}`}
                          checked={settings[`notifications_${notif.id}`] === 'true'} 
                          onChange={e => handleChange(`notifications_${notif.id}`, e.target.checked ? 'true' : 'false')}
                          className="w-4 h-4 rounded border-[rgba(255,255,255,0.2)] bg-[#0d0d0f] text-[#c4a850] focus:ring-[#c4a850]" 
                        />
                        <label htmlFor={`notif_${notif.id}`} className="text-sm text-[#e8e4df]">{notif.label}</label>
                      </div>
                    ))}
                  </div>
                )}

                {/* BRANDING TAB */}
                {activeTab === 'branding' && (
                  <div className="space-y-6 max-w-xl">
                    <div>
                      <label className="block text-sm text-[#888888] mb-1">Logo URL</label>
                      <input 
                        type="text" 
                        value={settings['branding_logo_url'] || ''} 
                        onChange={e => handleChange('branding_logo_url', e.target.value)}
                        className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none" 
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#888888] mb-1">Primärfarbe (Hex)</label>
                      <div className="flex gap-3">
                        <input 
                          type="color" 
                          value={settings['branding_primary_color'] || '#c4a850'} 
                          onChange={e => handleChange('branding_primary_color', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0" 
                        />
                        <input 
                          type="text" 
                          value={settings['branding_primary_color'] || '#c4a850'} 
                          onChange={e => handleChange('branding_primary_color', e.target.value)}
                          className="flex-1 bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none uppercase" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-[#888888] mb-1">Custom CSS</label>
                      <textarea 
                        rows={5}
                        value={settings['branding_custom_css'] || ''} 
                        onChange={e => handleChange('branding_custom_css', e.target.value)}
                        className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none font-mono text-sm resize-y" 
                        placeholder=":root { ... }"
                      />
                    </div>
                  </div>
                )}

                {/* INTEGRATIONS TAB */}
                {activeTab === 'integrations' && (
                  <div className="space-y-6 max-w-xl">
                    <div>
                      <label className="block text-sm text-[#888888] mb-1">Stripe Publishable Key</label>
                      <input 
                        type="text" 
                        value={settings['integrations_stripe_key'] || ''} 
                        onChange={e => handleChange('integrations_stripe_key', e.target.value)}
                        className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none font-mono text-sm" 
                        placeholder="pk_test_..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#888888] mb-1">Google Analytics ID</label>
                      <input 
                        type="text" 
                        value={settings['integrations_google_analytics_id'] || ''} 
                        onChange={e => handleChange('integrations_google_analytics_id', e.target.value)}
                        className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none font-mono text-sm" 
                        placeholder="G-XXXXXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#888888] mb-1">Webhook URLs (kommagetrennt)</label>
                      <textarea 
                        rows={3}
                        value={settings['integrations_webhook_urls'] || ''} 
                        onChange={e => handleChange('integrations_webhook_urls', e.target.value)}
                        className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none font-mono text-sm resize-none" 
                      />
                    </div>
                  </div>
                )}

                {/* USERS TAB */}
                {activeTab === 'users' && (
                  <div className="space-y-6 max-w-xl">
                    <div className="p-6 bg-[#08080a] border border-[rgba(255,255,255,0.05)] rounded-xl">
                      <h3 className="text-[#e8e4df] font-medium mb-2">Admin einladen</h3>
                      <p className="text-sm text-[#888888] mb-4">Sende eine Einladung an ein neues Teammitglied mit Administratorrechten.</p>
                      <div className="flex gap-3">
                        <input 
                          type="email" 
                          placeholder="E-Mail Adresse" 
                          className="flex-1 bg-[#0d0d0f] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none" 
                        />
                        <button className="bg-[#c4a850] text-[#08080a] px-4 py-2 rounded-md font-medium hover:bg-[#d4bc6a] transition-colors">
                          Einladen
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* DATA TAB */}
                {activeTab === 'data' && (
                  <div className="space-y-6 max-w-xl">
                    <div className="p-6 bg-[#08080a] border border-[rgba(255,255,255,0.05)] rounded-xl flex items-center justify-between">
                      <div>
                        <h3 className="text-[#e8e4df] font-medium mb-1">Datenexport</h3>
                        <p className="text-sm text-[#888888]">Exportiere alle Kundendaten als CSV.</p>
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 bg-[rgba(255,255,255,0.05)] text-[#e8e4df] rounded-md hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                        <Download size={16} /> Export
                      </button>
                    </div>
                    
                    <div className="p-6 bg-red-900/10 border border-red-900/30 rounded-xl">
                      <h3 className="text-red-400 font-medium mb-2 flex items-center gap-2"><Trash2 size={18} /> DSGVO Löschung</h3>
                      <p className="text-sm text-red-400/80 mb-4">Lösche alle Daten eines Benutzers unwiderruflich.</p>
                      <div className="flex gap-3">
                        <input 
                          type="text" 
                          placeholder="Benutzer ID" 
                          className="flex-1 bg-[#0d0d0f] border border-red-900/30 rounded-md px-4 py-2 text-[#e8e4df] focus:border-red-500 focus:outline-none" 
                        />
                        <button className="bg-red-500 text-white px-4 py-2 rounded-md font-medium hover:bg-red-600 transition-colors">
                          Löschen
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
