import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function AdminPaymentPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadPayments = () => {
    api.payments.getAll()
      .then(setPayments)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const markAsPaid = async (id) => {
    try {
      await api.payments.update(id, { status: 'completed' });
      toast({ title: 'Zahlung als bezahlt markiert' });
      loadPayments();
    } catch (e) {
      toast({ title: 'Fehler', description: e.message, variant: 'destructive' });
    }
  };

  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="max-w-6xl">
      <h2 className="font-serif text-3xl text-[#edf0f7] mb-8">Zahlungsübersicht</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[rgba(12,14,20,0.7)] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-6">
          <div className="text-[#a8b0c5] mb-2">Gesamtumsatz</div>
          <div className="text-3xl font-mono text-[#d4a850]">€{totalRevenue}</div>
        </div>
        <div className="bg-[rgba(12,14,20,0.7)] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-6">
          <div className="text-[#a8b0c5] mb-2">Ausstehend</div>
          <div className="text-3xl font-mono text-yellow-500">€{pendingAmount}</div>
        </div>
      </div>

      {loading ? (
        <div className="text-[#a8b0c5]">Lade Zahlungen...</div>
      ) : (
        <div className="bg-[rgba(12,14,20,0.7)] border border-[rgba(255,255,255,0.08)] rounded-[16px] overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.08)]">
              <tr>
                <th className="p-4 text-[#a8b0c5] font-medium">Datum</th>
                <th className="p-4 text-[#a8b0c5] font-medium">Kunde (ID)</th>
                <th className="p-4 text-[#a8b0c5] font-medium">Paket</th>
                <th className="p-4 text-[#a8b0c5] font-medium">Betrag</th>
                <th className="p-4 text-[#a8b0c5] font-medium">Status</th>
                <th className="p-4 text-[#a8b0c5] font-medium">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} className="border-b border-[rgba(255,255,255,0.04)]">
                  <td className="p-4 text-[#edf0f7]">{new Date(p.created).toLocaleDateString('de-DE')}</td>
                  <td className="p-4 text-[#edf0f7]">{p.userId}</td>
                  <td className="p-4 text-[#edf0f7] capitalize">{p.packageId || '-'}</td>
                  <td className="p-4 text-[#edf0f7]">€{p.amount}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${p.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                      {p.status === 'completed' ? 'Bezahlt' : 'Ausstehend'}
                    </span>
                  </td>
                  <td className="p-4">
                    {p.status === 'pending' && (
                      <button 
                        onClick={() => markAsPaid(p.id)} 
                        className="text-xs px-3 py-1 bg-[#d4a850] text-[#08090d] rounded hover:brightness-110 transition-all"
                      >
                        Als bezahlt markieren
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[#a8b0c5]">Keine Zahlungen gefunden.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}