import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Clock, DollarSign, Download, BarChart2 } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';

export default function AnalyticsPage() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30days');

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await apiServerClient.fetch('/analytics/kpis').then(r => r.json());
      setKpis(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Mock data fallback
      setKpis({
        total_revenue: 45200,
        average_project_price: 3200,
        conversion_rate: 24.5,
        average_project_duration: 42,
        customer_satisfaction: 4.8
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await apiServerClient.fetch(`/exports/projects?format=${format}`, { method: 'POST' });
      if (format === 'json') {
        const data = await response.json();
        console.log('Exported:', data);
        alert('Export erfolgreich (siehe Konsole)');
      } else {
        alert('CSV Export gestartet');
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  if (loading && !kpis) return <div className="p-8 text-[#a8b0c5]">Lade Analytics...</div>;

  const statCards = [
    { title: 'Gesamtumsatz', value: `€${kpis?.total_revenue?.toLocaleString() || 0}`, icon: DollarSign, trend: '+12%' },
    { title: 'Ø Projektpreis', value: `€${kpis?.average_project_price?.toLocaleString() || 0}`, icon: TrendingUp, trend: '+5%' },
    { title: 'Conversion Rate', value: `${kpis?.conversion_rate || 0}%`, icon: Users, trend: '+2.1%' },
    { title: 'Ø Projektdauer', value: `${kpis?.average_project_duration || 0} Tage`, icon: Clock, trend: '-3 Tage' },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-serif text-[#e8e4df] mb-2 flex items-center gap-3">
            <BarChart2 className="text-[#c4a850]" /> Analytics & Reports
          </h1>
          <p className="text-[#a8b0c5] font-sans text-sm">Wichtige Kennzahlen und Auswertungen im Überblick.</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={period} onChange={(e) => setPeriod(e.target.value)}
            className="bg-[#141210] border border-[rgba(196,168,80,0.2)] text-[#e8e4df] text-sm rounded-md px-3 py-2 focus:outline-none focus:border-[#c4a850]"
          >
            <option value="7days">Letzte 7 Tage</option>
            <option value="30days">Letzte 30 Tage</option>
            <option value="90days">Letzte 90 Tage</option>
            <option value="1year">1 Jahr</option>
          </select>
          <button onClick={() => handleExport('csv')} className="flex items-center gap-2 px-4 py-2 bg-[#141210] border border-[rgba(196,168,80,0.2)] text-[#e8e4df] rounded-md hover:border-[#c4a850] transition-colors text-sm">
            <Download size={16} /> CSV Export
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-[#141210] border border-[rgba(196,168,80,0.12)] rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[rgba(196,168,80,0.1)] rounded-lg text-[#c4a850]">
                <stat.icon size={24} />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-[#888888] text-sm font-sans mb-1">{stat.title}</h3>
            <p className="text-3xl font-serif text-[#e8e4df]">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#141210] border border-[rgba(196,168,80,0.12)] rounded-xl p-6 h-80 flex flex-col">
          <h3 className="text-lg font-serif text-[#e8e4df] mb-4">Umsatzentwicklung</h3>
          <div className="flex-1 flex items-end gap-2 justify-between pt-4">
            {[40, 70, 45, 90, 65, 100, 85].map((h, i) => (
              <div key={i} className="w-full bg-[rgba(196,168,80,0.2)] rounded-t-sm relative group hover:bg-[#c4a850] transition-colors" style={{ height: `${h}%` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0a0f0d] text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-[#c4a850]">
                  €{h * 100}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-[#888888] mt-2">
            <span>Mo</span><span>Di</span><span>Mi</span><span>Do</span><span>Fr</span><span>Sa</span><span>So</span>
          </div>
        </div>

        <div className="bg-[#141210] border border-[rgba(196,168,80,0.12)] rounded-xl p-6 h-80 flex flex-col">
          <h3 className="text-lg font-serif text-[#e8e4df] mb-4">Kunden nach Paket</h3>
          <div className="flex-1 flex flex-col justify-center gap-4">
            {[
              { label: 'Starter', val: 35, color: '#c4a850' },
              { label: 'Professional', val: 50, color: '#a8b0c5' },
              { label: 'Premium', val: 15, color: '#888888' }
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#e8e4df]">{item.label}</span>
                  <span className="text-[#888888]">{item.val}%</span>
                </div>
                <div className="h-2 bg-[#0a0f0d] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${item.val}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}