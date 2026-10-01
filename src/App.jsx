import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import LoginPage from '@/components/LoginPage';
import CRDashboard from '@/components/CRDashboard';
import TeacherDashboard from '@/components/TeacherDashboard';
import AdminDashboard from '@/components/AdminDashboard';
import AnnouncementBoard from '@/components/AnnouncementBoard';

function DashboardRouter() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('Dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#F8F8F8] text-[#2C2C2C]">
        <div className="w-14 h-14 rounded-2xl bg-white p-2.5 flex items-center justify-center shadow-md border border-slate-200">
          <img
            src="/logo.png"
            alt="ResolveX Logo"
            className="w-10 h-10 object-contain animate-pulse"
          />
        </div>
        <p className="text-xs font-semibold text-slate-500">Loading ResolveX Portal...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
      case 'Grievances':
        return (
          <>
            {user.role === 'admin' && <AdminDashboard sidebarTab={activeTab} />}
            {user.role === 'teacher' && <TeacherDashboard sidebarTab={activeTab} />}
            {user.role === 'cr' && <CRDashboard sidebarTab={activeTab} />}
          </>
        );
      case 'Announcements':
        return (
          <div className="p-8 animate-fade-in max-w-5xl mx-auto">
            <h1 className="text-2xl font-extrabold text-slate-800 mb-6">Announcements</h1>
            <AnnouncementBoard />
          </div>
        );
      case 'My Profile':
        return (
          <div className="p-8 animate-fade-in max-w-5xl mx-auto">
            <h1 className="text-2xl font-extrabold text-slate-800 mb-6">My Profile</h1>
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 shadow-sm">
              <div className="w-20 h-20 rounded-full bg-rose-400 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {user.name ? user.name[0] : 'U'}
              </div>
              <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
              <p className="text-xs text-rose-500 font-semibold uppercase tracking-wider mt-1">{user.role} • {user.department || 'AIML'}</p>
              <p className="text-sm text-slate-400 mt-1">{user.email}</p>
              {user.year && <p className="text-xs text-slate-400 mt-0.5">Year {user.year} • Section {user.section}</p>}
            </div>
          </div>
        );
      default:
        return (
          <>
            {user.role === 'admin' && <AdminDashboard sidebarTab={activeTab} />}
            {user.role === 'teacher' && <TeacherDashboard sidebarTab={activeTab} />}
            {user.role === 'cr' && <CRDashboard sidebarTab={activeTab} />}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DashboardRouter />
      </AuthProvider>
    </ThemeProvider>
  );
}
