import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext.jsx';
import PaymentModal from '@/components/dashboard/PaymentModal.jsx';

export default function PaymentPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      api.payments.getByUser(user.id)
        .then(setPayments)
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-serif text-3xl text-[#edf0f7]">Zahlungen</h2>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="px-4 py-2 bg-[#d4a850] text-[#08090d] rounded-md font-medium hover:brightness-110 transition-all"
        >
          Paket bezahlen
        </button>
      </div>
      
      {loading ? (
        <div className="text-[#a8b0c5]">Lade Zahlungen...</div>
      ) : (
        <div className="bg-[rgba(12,14,20,0.7)] border border-[rgba(255,255,255,0.08)] rounded-[16px] overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.08)]">
              <tr>
                <th className="p-4 text-[#a8b0c5] font-medium">Datum</th>
                <th className="p-4 text-[#a8b0c5] font-medium">Paket</th>
                <th className="p-4 text-[#a8b0c5] font-medium">Betrag</th>
                <th className="p-4 text-[#a8b0c5] font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} className="border-b border-[rgba(255,255,255,0.04)]">
                  <td className="p-4 text-[#edf0f7]">{new Date(p.created).toLocaleDateString('de-DE')}</td>
                  <td className="p-4 text-[#edf0f7] capitalize">{p.packageId || '-'}</td>
                  <td className="p-4 text-[#edf0f7]">€{p.amount}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${p.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                      {p.status === 'completed' ? 'Bezahlt' : 'Ausstehend'}
                    </span>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-[#a8b0c5]">Keine Zahlungen gefunden.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      <PaymentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        packageKey={user?.selected_package || 'professional'} 
      />
    </div>
  );
}