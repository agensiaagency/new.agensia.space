import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#08090d] flex">
      <DashboardSidebar />
      
      <main className="flex-1 md:ml-[240px] p-6 md:p-10 pt-[100px] md:pt-10 max-w-[1600px] mx-auto w-full">
        <DashboardHeader />
        <div className="animate-in fade-in duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  );
}