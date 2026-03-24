import React from 'react';

export default function AdminBadge({ isAdmin }) {
  if (!isAdmin) return null;
  
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#d4a850]/20 text-[#d4a850] border border-[#d4a850]/30 ml-2">
      Admin
    </span>
  );
}