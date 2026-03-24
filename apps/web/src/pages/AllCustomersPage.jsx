import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Link } from 'react-router-dom';

export default function AllCustomersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.users.getAll()
      .then(res => setUsers(res.filter(u => u.role !== 'admin')))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.company_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-serif text-3xl text-[#edf0f7]">Kunden</h2>
        <input 
          type="text" 
          placeholder="Suchen..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-[rgba(12,14,20,0.7)] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#edf0f7] focus:outline-none focus:border-[#d4a850]"
        />
      </div>

      {loading ? (
        <div className="text-[#a8b0c5]">Lade Kunden...</div>
      ) : (
        <div className="bg-[rgba(12,14,20,0.7)] border border-[rgba(255,255,255,0.08)] rounded-[16px] overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.08)]">
              <tr>
                <th className="p-4 text-[#a8b0c5] font-medium">Name</th>
                <th className="p-4 text-[#a8b0c5] font-medium">E-Mail</th>
                <th className="p-4 text-[#a8b0c5] font-medium">Firma</th>
                <th className="p-4 text-[#a8b0c5] font-medium">Paket</th>
                <th className="p-4 text-[#a8b0c5] font-medium">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-[rgba(255,255,255,0.04)]">
                  <td className="p-4 text-[#edf0f7]">{u.name || '-'}</td>
                  <td className="p-4 text-[#edf0f7]">{u.email}</td>
                  <td className="p-4 text-[#edf0f7]">{u.company_name || '-'}</td>
                  <td className="p-4 text-[#edf0f7] capitalize">{u.selected_package || '-'}</td>
                  <td className="p-4">
                    <Link to={`/dashboard/customers/${u.id}`} className="text-[#d4a850] hover:underline">
                      Dashboard ansehen
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[#a8b0c5]">Keine Kunden gefunden.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}