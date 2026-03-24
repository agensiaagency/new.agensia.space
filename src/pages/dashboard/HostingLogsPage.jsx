
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, AlertCircle, ArrowUpRight, ArrowDownLeft, Package, Calendar } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useOutletContext } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function HostingLogsPage() {
  const { user } = useAuth();
  const { setSidebarOpen } = useOutletContext() || {};
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.hosting.getLogs(user.id)
        .then(setLogs)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const getIcon = (type) => {
    switch(type) {
      case 'activation': return <CheckCircle className="text-green-500" size={20} />;
      case 'renewal': return <Zap className="text-yellow-500" size={20} />;
      case 'cancellation': return <AlertCircle className="text-red-500" size={20} />;
      case 'upgrade': return <ArrowUpRight className="text-blue-500" size={20} />;
      case 'downgrade': return <ArrowDownLeft className="text-orange-500" size={20} />;
      case 'payment_failed': return <AlertCircle className="text-red-500" size={20} />;
      case 'domain_change': return <Package className="text-purple-500" size={20} />;
      default: return <CheckCircle className="text-[#888888]" size={20} />;
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto">
      <DashboardHeader onMenuClick={() => setSidebarOpen?.(true)} />
      
      <div>
        <h1 className="text-3xl font-serif text-[#e8e4df] mb-2">Hosting-Logs</h1>
        <p className="text-[#888888]">Verfolge alle Änderungen an deinem Abonnement und Hosting-Status.</p>
      </div>

      {logs.length === 0 ? (
        <div className="bg-[#141210] border border-[rgba(196,168,80,0.12)] rounded-xl p-12 text-center">
          <Calendar size={48} className="text-[#888888] mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-[#e8e4df] mb-2">Keine Logs vorhanden</h3>
          <p className="text-[#888888]">Es wurden noch keine Hosting-Aktivitäten aufgezeichnet.</p>
        </div>
      ) : (
        <div className="relative border-l border-[rgba(196,168,80,0.2)] ml-4 md:ml-6 space-y-8">
          {logs.map((log, index) => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8 md:pl-10"
            >
              <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-[#141210] border border-[rgba(196,168,80,0.5)] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#c4a850]" />
              </div>
              
              <div className="bg-[#141210] border border-[rgba(196,168,80,0.12)] rounded-xl p-5 hover:border-[#c4a850]/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {getIcon(log.type)}
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[rgba(255,255,255,0.05)] text-[#a8b0c5] border border-[rgba(255,255,255,0.1)]">
                      {log.type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-[#888888] font-medium">
                    {new Date(log.created).toLocaleDateString('de-DE')} • {new Date(log.created).toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
                
                <p className="text-[#e8e4df] text-sm mb-4">{log.description}</p>
                
                {log.metadata && Object.keys(log.metadata).length > 0 && (
                  <div className="bg-[#0a0f0d] border border-[rgba(255,255,255,0.05)] rounded-lg p-3 overflow-x-auto">
                    <pre className="text-[11px] text-[#a8b0c5] font-mono m-0">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
