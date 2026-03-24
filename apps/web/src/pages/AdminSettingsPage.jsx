
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Mail, Bell, Palette, Link as LinkIcon, Users, Database, Package, Save } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

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
      // Save current tab settings
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

  if (isLoading) return <div className="p-8 text-[#888888] animate-pulse">Lade Einstellungen...</div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-serif text-[#e8e4df] mb-2">Plattform Einstellungen</h1>
        <p className="text-[#888888]">Konfiguriere die globalen Parameter der agensia Plattform.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
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
        <div className="flex-1 bg-[#141210] border border-[rgba(196,168,80,0.12)] rounded-xl p-6 md:p-8 min-h-[500px]">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-[rgba(255,255,255,0.05)]">
            <h2 className="text-xl font-medium text-[#e8e4df]">{tabs.find(t => t.id === activeTab)?.label}</h2>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-[#c4a850] text-[#0a0f0d] px-4 py-2 rounded-md text-sm font-medium hover:bg-[#d4bc6a] transition-colors disabled:opacity-50"
            >
              <Save size={16} /> {isSaving ? 'Speichert...' : 'Speichern'}
            </button>
          </div>

          <div className="space-y-6">
            {activeTab === 'general' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-sm text-[#888888] mb-1">Plattform Name</label>
                  <input type="text" value={settings['general_platform_name'] || 'agensia'} onChange={e => handleChange('general_platform_name', e.target.value)} className="w-full bg-[#0a0f0d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-[#888888] mb-1">Support E-Mail</label>
                  <input type="email" value={settings['general_support_email'] || 'support@agensia.de'} onChange={e => handleChange('general_support_email', e.target.value)} className="w-full bg-[#0a0f0d] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none" />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <input type="checkbox" id="maintenance" checked={settings['general_maintenance_mode'] === 'true'} onChange={e => handleChange('general_maintenance_mode', e.target.checked ? 'true' : 'false')} className="w-4 h-4 rounded border-[rgba(255,255,255,0.2)] bg-[#0a0f0d] text-[#c4a850] focus:ring-[#c4a850]" />
                  <label htmlFor="maintenance" className="text-sm text-[#e8e4df]">Wartungsmodus aktivieren (Nur Admins können sich einloggen)</label>
                </div>
              </motion.div>
            )}

            {activeTab === 'integrations' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-xl">
                <div className="p-4 border border-[rgba(255,255,255,0.05)] rounded-lg bg-[#0a0f0d]">
                  <h3 className="text-[#e8e4df] font-medium mb-4">Stripe API</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-[#888888] mb-1">Public Key</label>
                      <input type="text" value={settings['integrations_stripe_public'] || ''} onChange={e => handleChange('integrations_stripe_public', e.target.value)} className="w-full bg-[#141210] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none font-mono text-sm" placeholder="pk_test_..." />
                    </div>
                    <div>
                      <label className="block text-sm text-[#888888] mb-1">Secret Key</label>
                      <input type="password" value={settings['integrations_stripe_secret'] || ''} onChange={e => handleChange('integrations_stripe_secret', e.target.value)} className="w-full bg-[#141210] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none font-mono text-sm" placeholder="sk_test_..." />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Placeholder for other tabs */}
            {['packages', 'email', 'notifications', 'branding', 'users', 'data'].includes(activeTab) && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-12 text-center">
                <Settings size={48} className="text-[#888888] mb-4 opacity-20" />
                <h3 className="text-lg font-medium text-[#e8e4df] mb-2">In Entwicklung</h3>
                <p className="text-[#888888] max-w-sm">Die Einstellungen für diesen Bereich werden in einem zukünftigen Update verfügbar sein.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
