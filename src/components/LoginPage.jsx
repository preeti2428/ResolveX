'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  GraduationCap,
  BookOpen,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Wrench,
  Cpu,
  Fan,
} from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState('cr');
  const [loadingRole, setLoadingRole] = useState(null);
  const [errorRole, setErrorRole] = useState({ role: null, message: '' });

  // 1. CR Box (Empty by default)
  const [crEmail, setCrEmail] = useState('');
  const [crPassword, setCrPassword] = useState('');
  const [showCrPass, setShowCrPass] = useState(false);
  const [selectedCrYear, setSelectedCrYear] = useState(null);

  // 2. Faculty Box (Empty by default)
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [showTeacherPass, setShowTeacherPass] = useState(false);

  // 3. Infra Head Box
  const [infraEmail, setInfraEmail] = useState('');
  const [infraPassword, setInfraPassword] = useState('');
  const [showInfraPass, setShowInfraPass] = useState(false);

  // 4. IT Infra Head Box
  const [itEmail, setItEmail] = useState('');
  const [itPassword, setItPassword] = useState('');
  const [showItPass, setShowItPass] = useState(false);

  // 5. AC Incharge Box
  const [acEmail, setAcEmail] = useState('');
  const [acPassword, setAcPassword] = useState('');
  const [showAcPass, setShowAcPass] = useState(false);



  const handleCrYearSelect = (year) => {
    setSelectedCrYear(year);
    setCrEmail(`cr${year}@aiml.edu`);
    setCrPassword('Cr@123');
    setErrorRole({ role: null, message: '' });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoadingRole('cr');
    setErrorRole({ role: null, message: '' });
    try {
      await loginWithGoogle(credentialResponse.credential);
    } catch (err) {
      setErrorRole({
        role: 'cr',
        message: err.message || 'Google Login failed. Are you a verified CR?',
      });
    } finally {
      setLoadingRole(null);
    }
  };

  const handleLoginSubmit = async (e, role) => {
    e.preventDefault();
    let emailToUse = '';
    let passwordToUse = '';

    if (role === 'cr') {
      emailToUse = crEmail.trim();
      passwordToUse = crPassword;
    } else if (role === 'teacher') {
      emailToUse = teacherEmail.trim();
      passwordToUse = teacherPassword;
    } else if (role === 'infra_head') {
      emailToUse = infraEmail.trim();
      passwordToUse = infraPassword;
    } else if (role === 'it_infra_head') {
      emailToUse = itEmail.trim();
      passwordToUse = itPassword;
    } else if (role === 'ac_incharge') {
      emailToUse = acEmail.trim();
      passwordToUse = acPassword;
    }

    if (!emailToUse || !passwordToUse) {
      setErrorRole({ role, message: 'Email and password are required.' });
      return;
    }

    setLoadingRole(role);
    setErrorRole({ role: null, message: '' });

    try {
      await login(emailToUse, passwordToUse, role);
    } catch (err) {
      setErrorRole({
        role,
        message: err.message || 'Authentication failed. Please verify credentials.',
      });
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col justify-between text-slate-800 p-3 sm:p-5 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/login_page.png')" }}
    >

      {/* Top Header */}
      <header className="text-center pt-3 pb-1 relative z-10">
        {/* Brand Logo & Name */}
        <div className="flex flex-col items-center mb-1">
          <img
            src="/logo.png"
            alt="ResolveX Logo"
            className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-xs -mb-2"
          />
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
            Resolve<span className="text-[#C61A22]">X</span>
          </span>
        </div>

        {/* Subtitle */}
        <p className="text-xs font-medium text-[#475569]">
          AI / AI&amp;ML Department Grievance Redressal Portal
        </p>
      </header>

      {/* Single Compact Glass Card with Tabs */}
      <main className="max-w-md w-full mx-auto my-auto py-4 relative z-10">
        <div className="backdrop-blur-xl bg-white/95 rounded-2xl p-4 sm:p-5 shadow-xl border border-[#C61A22]/10 ring-1 ring-[#C61A22]/5 transition-all duration-300">
          
          {/* Role Selection Tabs */}
          <div className="grid grid-cols-5 p-1 bg-slate-100 rounded-xl mb-5 gap-1">
            <button
              type="button"
              onClick={() => { setActiveTab('cr'); setErrorRole({ role: null, message: '' }); }}
              className={`py-1.5 px-0.5 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                activeTab === 'cr' ? 'bg-white text-[#C61A22] shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <GraduationCap size={13} className="shrink-0" />
              <span>CR</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('teacher'); setErrorRole({ role: null, message: '' }); }}
              className={`py-1.5 px-0.5 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                activeTab === 'teacher' ? 'bg-white text-[#C61A22] shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <BookOpen size={13} className="shrink-0" />
              <span>Faculty</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('infra_head'); setErrorRole({ role: null, message: '' }); }}
              className={`py-1.5 px-0.5 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                activeTab === 'infra_head' ? 'bg-white text-[#C61A22] shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Wrench size={12} className="shrink-0" />
              <span className="truncate">Infra</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('it_infra_head'); setErrorRole({ role: null, message: '' }); }}
              className={`py-1.5 px-0.5 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                activeTab === 'it_infra_head' ? 'bg-white text-[#C61A22] shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Cpu size={12} className="shrink-0" />
              <span className="truncate">IT Head</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('ac_incharge'); setErrorRole({ role: null, message: '' }); }}
              className={`py-1.5 px-0.5 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                activeTab === 'ac_incharge' ? 'bg-white text-[#C61A22] shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Fan size={12} className="shrink-0" />
              <span className="truncate">AC</span>
            </button>
          </div>

          {/* CR PORTAL CONTENT */}
          {activeTab === 'cr' && (
            <div className="animate-fade-in">
              <div className="mb-4">
                <h2 className="text-sm font-bold text-[#0F172A] leading-tight text-center">CR Portal</h2>
                <p className="text-[11px] font-medium text-[#64748B] text-center mt-0.5">Years 1 – 4</p>
              </div>

              {errorRole.role === 'cr' && (
                <div className="mb-2.5 p-2 rounded-lg text-[11px] bg-red-50 text-red-700 border border-red-200 flex items-center gap-1.5">
                  <AlertCircle size={13} className="shrink-0 text-red-600" />
                  <span>{errorRole.message}</span>
                </div>
              )}

              <form onSubmit={(e) => handleLoginSubmit(e, 'cr')} className="space-y-2.5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={14} className="text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={crEmail}
                    onChange={(e) => setCrEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-9 pr-3 py-2 rounded-lg text-xs border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:border-[#C61A22] focus:ring-1 focus:ring-[#C61A22] outline-none transition-all shadow-sm"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={14} className="text-slate-400" />
                  </div>
                  <input
                    type={showCrPass ? 'text' : 'password'}
                    required
                    value={crPassword}
                    onChange={(e) => setCrPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-8 py-2 rounded-lg text-xs border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:border-[#C61A22] focus:ring-1 focus:ring-[#C61A22] outline-none transition-all font-mono shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCrPass(!showCrPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCrPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loadingRole === 'cr'}
                  className="w-full mt-2 py-2 px-3 rounded-lg text-xs font-semibold text-white bg-[#C61A22] hover:bg-[#A8161D] active:bg-[#8B1218] transition-all flex items-center justify-center gap-1.5 shadow-md disabled:opacity-60 cursor-pointer"
                >
                  {loadingRole === 'cr' ? 'Signing in...' : 'Sign In as CR'}
                  {!loadingRole && <ArrowRight size={13} />}
                </button>
              </form>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-[#64748B] font-medium text-[10px]">Quick Fill:</span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => handleCrYearSelect(yr)}
                      className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                        selectedCrYear === yr
                          ? 'bg-[#C61A22] text-white shadow-sm'
                          : 'bg-red-50 hover:bg-red-100 text-[#C61A22]'
                      }`}
                    >
                      Yr {yr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col items-center gap-2">
                <span className="text-[#64748B] font-medium text-[10px]">Verified CR Google Login:</span>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    setErrorRole({ role: 'cr', message: 'Google Login failed.' });
                  }}
                  useOneTap={false}
                  size="medium"
                  shape="pill"
                  width="320"
                />
              </div>
            </div>
          )}

          {/* FACULTY PORTAL CONTENT */}
          {activeTab === 'teacher' && (
            <div className="animate-fade-in">
              <div className="mb-4">
                <h2 className="text-sm font-bold text-[#0F172A] leading-tight text-center">Faculty Portal</h2>
                <p className="text-[11px] font-medium text-[#64748B] text-center mt-0.5">Department Faculty</p>
              </div>

              {errorRole.role === 'teacher' && (
                <div className="mb-2.5 p-2 rounded-lg text-[11px] bg-red-50 text-red-700 border border-red-200 flex items-center gap-1.5">
                  <AlertCircle size={13} className="shrink-0 text-red-600" />
                  <span>{errorRole.message}</span>
                </div>
              )}

              <form onSubmit={(e) => handleLoginSubmit(e, 'teacher')} className="space-y-2.5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={14} className="text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={teacherEmail}
                    onChange={(e) => setTeacherEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-9 pr-3 py-2 rounded-lg text-xs border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:border-[#C61A22] focus:ring-1 focus:ring-[#C61A22] outline-none transition-all shadow-sm"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={14} className="text-slate-400" />
                  </div>
                  <input
                    type={showTeacherPass ? 'text' : 'password'}
                    required
                    value={teacherPassword}
                    onChange={(e) => setTeacherPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-8 py-2 rounded-lg text-xs border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:border-[#C61A22] focus:ring-1 focus:ring-[#C61A22] outline-none transition-all font-mono shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowTeacherPass(!showTeacherPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showTeacherPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loadingRole === 'teacher'}
                  className="w-full mt-2 py-2 px-3 rounded-lg text-xs font-semibold text-white bg-[#C61A22] hover:bg-[#A8161D] active:bg-[#8B1218] transition-all flex items-center justify-center gap-1.5 shadow-md disabled:opacity-60 cursor-pointer"
                >
                  {loadingRole === 'teacher' ? 'Signing in...' : 'Sign In as Faculty'}
                  {!loadingRole && <ArrowRight size={13} />}
                </button>
              </form>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-[#64748B] font-medium text-[10px]">Quick Fill:</span>
                <button
                  type="button"
                  onClick={() => {
                    setTeacherEmail('teacher@aiml.edu');
                    setTeacherPassword('Teacher@123');
                    setErrorRole({ role: null, message: '' });
                  }}
                  className="bg-red-50 hover:bg-red-100 text-[#C61A22] font-semibold text-[10px] px-3 py-1 rounded-md transition-colors cursor-pointer"
                >
                  Faculty Demo
                </button>
              </div>
            </div>
          )}

          {/* INFRASTRUCTURE HEAD PORTAL CONTENT */}
          {activeTab === 'infra_head' && (
            <div className="animate-fade-in">
              <div className="mb-4">
                <h2 className="text-sm font-bold text-[#0F172A] leading-tight text-center">Campus Infrastructure Portal</h2>
                <p className="text-[11px] font-medium text-[#64748B] text-center mt-0.5">Physical Maintenance, AC, Civil & Electrical</p>
              </div>

              {errorRole.role === 'infra_head' && (
                <div className="mb-2.5 p-2 rounded-lg text-[11px] bg-red-50 text-red-700 border border-red-200 flex items-center gap-1.5">
                  <AlertCircle size={13} className="shrink-0 text-red-600" />
                  <span>{errorRole.message}</span>
                </div>
              )}

              <form onSubmit={(e) => handleLoginSubmit(e, 'infra_head')} className="space-y-2.5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={14} className="text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={infraEmail}
                    onChange={(e) => setInfraEmail(e.target.value)}
                    placeholder="infra@aiml.edu"
                    className="w-full pl-9 pr-3 py-2 rounded-lg text-xs border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:border-[#C61A22] focus:ring-1 focus:ring-[#C61A22] outline-none transition-all shadow-sm"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={14} className="text-slate-400" />
                  </div>
                  <input
                    type={showInfraPass ? 'text' : 'password'}
                    required
                    value={infraPassword}
                    onChange={(e) => setInfraPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-8 py-2 rounded-lg text-xs border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:border-[#C61A22] focus:ring-1 focus:ring-[#C61A22] outline-none transition-all font-mono shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowInfraPass(!showInfraPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showInfraPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loadingRole === 'infra_head'}
                  className="w-full mt-2 py-2 px-3 rounded-lg text-xs font-semibold text-white bg-[#C61A22] hover:bg-[#A8161D] active:bg-[#8B1218] transition-all flex items-center justify-center gap-1.5 shadow-md disabled:opacity-60 cursor-pointer"
                >
                  {loadingRole === 'infra_head' ? 'Signing in...' : 'Sign In as Infra Head'}
                  {!loadingRole && <ArrowRight size={13} />}
                </button>
              </form>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-[#64748B] font-medium text-[10px]">Quick Fill:</span>
                <button
                  type="button"
                  onClick={() => {
                    setInfraEmail('infra@aiml.edu');
                    setInfraPassword('Infra@123');
                    setErrorRole({ role: null, message: '' });
                  }}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-[10px] px-3 py-1 rounded-md transition-colors cursor-pointer border border-amber-200/60"
                >
                  Infra Head Demo
                </button>
              </div>
            </div>
          )}

          {/* IT INFRASTRUCTURE HEAD PORTAL CONTENT */}
          {activeTab === 'it_infra_head' && (
            <div className="animate-fade-in">
              <div className="mb-4">
                <h2 className="text-sm font-bold text-[#0F172A] leading-tight text-center">IT Infrastructure Portal</h2>
                <p className="text-[11px] font-medium text-[#64748B] text-center mt-0.5">Lab PCs, Wi-Fi, LAN, Projectors &amp; Systems</p>
              </div>

              {errorRole.role === 'it_infra_head' && (
                <div className="mb-2.5 p-2 rounded-lg text-[11px] bg-red-50 text-red-700 border border-red-200 flex items-center gap-1.5">
                  <AlertCircle size={13} className="shrink-0 text-red-600" />
                  <span>{errorRole.message}</span>
                </div>
              )}

              <form onSubmit={(e) => handleLoginSubmit(e, 'it_infra_head')} className="space-y-2.5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={14} className="text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={itEmail}
                    onChange={(e) => setItEmail(e.target.value)}
                    placeholder="it_infra@aiml.edu"
                    className="w-full pl-9 pr-3 py-2 rounded-lg text-xs border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:border-[#C61A22] focus:ring-1 focus:ring-[#C61A22] outline-none transition-all shadow-sm"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={14} className="text-slate-400" />
                  </div>
                  <input
                    type={showItPass ? 'text' : 'password'}
                    required
                    value={itPassword}
                    onChange={(e) => setItPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-8 py-2 rounded-lg text-xs border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:border-[#C61A22] focus:ring-1 focus:ring-[#C61A22] outline-none transition-all font-mono shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowItPass(!showItPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showItPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loadingRole === 'it_infra_head'}
                  className="w-full mt-2 py-2 px-3 rounded-lg text-xs font-semibold text-white bg-[#C61A22] hover:bg-[#A8161D] active:bg-[#8B1218] transition-all flex items-center justify-center gap-1.5 shadow-md disabled:opacity-60 cursor-pointer"
                >
                  {loadingRole === 'it_infra_head' ? 'Signing in...' : 'Sign In as IT Head'}
                  {!loadingRole && <ArrowRight size={13} />}
                </button>
              </form>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-[#64748B] font-medium text-[10px]">Quick Fill:</span>
                <button
                  type="button"
                  onClick={() => {
                    setItEmail('it_infra@aiml.edu');
                    setItPassword('ItInfra@123');
                    setErrorRole({ role: null, message: '' });
                  }}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-semibold text-[10px] px-3 py-1 rounded-md transition-colors cursor-pointer border border-indigo-200/60"
                >
                  IT Head Demo
                </button>
              </div>
            </div>
          )}

          {/* AC INCHARGE PORTAL CONTENT */}
          {activeTab === 'ac_incharge' && (
            <div className="animate-fade-in">
              <div className="mb-4">
                <h2 className="text-sm font-bold text-[#0F172A] leading-tight text-center">AC Incharge Portal</h2>
                <p className="text-[11px] font-medium text-[#64748B] text-center mt-0.5">Air Conditioning, Ventilation &amp; Cooling Units</p>
              </div>

              {errorRole.role === 'ac_incharge' && (
                <div className="mb-2.5 p-2 rounded-lg text-[11px] bg-red-50 text-red-700 border border-red-200 flex items-center gap-1.5">
                  <AlertCircle size={13} className="shrink-0 text-red-600" />
                  <span>{errorRole.message}</span>
                </div>
              )}

              <form onSubmit={(e) => handleLoginSubmit(e, 'ac_incharge')} className="space-y-2.5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={14} className="text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={acEmail}
                    onChange={(e) => setAcEmail(e.target.value)}
                    placeholder="ac_incharge@aiml.edu"
                    className="w-full pl-9 pr-3 py-2 rounded-lg text-xs border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:border-[#C61A22] focus:ring-1 focus:ring-[#C61A22] outline-none transition-all shadow-sm"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={14} className="text-slate-400" />
                  </div>
                  <input
                    type={showAcPass ? 'text' : 'password'}
                    required
                    value={acPassword}
                    onChange={(e) => setAcPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-8 py-2 rounded-lg text-xs border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:border-[#C61A22] focus:ring-1 focus:ring-[#C61A22] outline-none transition-all font-mono shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAcPass(!showAcPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showAcPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loadingRole === 'ac_incharge'}
                  className="w-full mt-2 py-2 px-3 rounded-lg text-xs font-semibold text-white bg-[#C61A22] hover:bg-[#A8161D] active:bg-[#8B1218] transition-all flex items-center justify-center gap-1.5 shadow-md disabled:opacity-60 cursor-pointer"
                >
                  {loadingRole === 'ac_incharge' ? 'Signing in...' : 'Sign In as AC Incharge'}
                  {!loadingRole && <ArrowRight size={13} />}
                </button>
              </form>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-[#64748B] font-medium text-[10px]">Quick Fill:</span>
                <button
                  type="button"
                  onClick={() => {
                    setAcEmail('ac_incharge@aiml.edu');
                    setAcPassword('AcIncharge@123');
                    setErrorRole({ role: null, message: '' });
                  }}
                  className="bg-cyan-50 hover:bg-cyan-100 text-cyan-900 font-semibold text-[10px] px-3 py-1 rounded-md transition-colors cursor-pointer border border-cyan-200/60"
                >
                  AC Incharge Demo
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="text-center pt-3 pb-1 relative z-10">
        <div className="w-16 h-px bg-slate-200/80 mx-auto mb-2" />
        <p className="text-[11px] text-[#64748B]">
          ResolveX &copy; {new Date().getFullYear()} Department of AI / AI&amp;ML
        </p>
      </footer>
    </div>
  );
}
