'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { apiRequest } from '@/lib/api-client';
import { useAuth } from '@/context/AuthContext';
import StatusBadge from './StatusBadge';
import GrievanceFormModal from './GrievanceFormModal';
import GrievanceDetailModal from './GrievanceDetailModal';
import EditGrievanceModal from './EditGrievanceModal';
import AnnouncementBoard from './AnnouncementBoard';
import AnalyticsDashboard from './AnalyticsDashboard';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  FileText, 
  Clock, 
  CheckCircle, 
  BookOpen, 
  ArrowUpRight,
  AlertCircle,
  BarChart3,
  Pencil,
  Trash2,
  Camera
} from 'lucide-react';

export default function TeacherDashboard({ sidebarTab }) {
  const { user } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Tab selection


  // Filters & Search
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [issueTypeFilter, setIssueTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedGrievanceId, setSelectedGrievanceId] = useState(null);
  const [grievanceToEdit, setGrievanceToEdit] = useState(null);

  useEffect(() => {
    loadMyGrievances();
  }, []);

  const loadMyGrievances = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiRequest('/api/grievances/my');
      if (res.success) {
        setGrievances(res.grievances || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch teacher grievances');
    } finally {
      setLoading(false);
    }
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const deleteGrievance = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(null), 3000);
      return;
    }
    
    try {
      const res = await apiRequest(`/api/grievances/${id}`, { method: 'DELETE' });
      if (res.success) {
        setGrievances((prev) => prev.filter((g) => (g.id || g._id) !== id));
        setConfirmDeleteId(null);
      } else {
        alert(res.message || 'Failed to delete grievance');
      }
    } catch (err) {
      alert(err.message || 'Error deleting grievance');
    }
  };

  const stats = {
    total: grievances.length,
    pending: grievances.filter((g) => g.status === 'pending').length,
    in_progress: grievances.filter((g) => g.status === 'in_progress').length,
    resolved: grievances.filter((g) => g.status === 'resolved').length,
  };

  const availableIssueTypes = useMemo(() => {
    const types = new Set();
    grievances.forEach((g) => {
      if (g.details?.issue_type) {
        types.add(g.details.issue_type);
      }
    });
    return Array.from(types).sort();
  }, [grievances]);

  const filteredGrievances = grievances.filter((g) => {
    if (statusFilter !== 'all' && g.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && g.category_name !== categoryFilter) return false;
    if (issueTypeFilter !== 'all' && g.details?.issue_type !== issueTypeFilter) return false;
    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase();
      const matchDesc = g.description?.toLowerCase().includes(term);
      const matchCat = g.category_name?.toLowerCase().includes(term);
      const matchIssue = g.details?.issue_type?.toLowerCase().includes(term);
      const matchDetails = JSON.stringify(g.details || {}).toLowerCase().includes(term);
      if (!matchDesc && !matchCat && !matchIssue && !matchDetails) return false;
    }
    return true;
  });

  const isGrievancesOnly = sidebarTab === 'Grievances';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {!isGrievancesOnly && (
        <>
          {/* Welcome Hero Banner - Modern Light & Red Theme with Campus Background */}
          <div className="relative rounded-2xl overflow-hidden border border-red-100 bg-white shadow-sm">
        {/* Background Overlay */}
        <div className="absolute inset-y-0 right-0 w-[80%] sm:w-[70%] overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 to-transparent z-10" />
          <img 
            src="/login_page.png" 
            alt="Campus" 
            className="w-full h-full object-cover opacity-100"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-50/60 to-transparent pointer-events-none" />

        <div className="relative z-20 flex flex-col p-6 sm:p-8">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-600 border border-red-200 shadow-sm">
              <BookOpen size={14} /> Faculty Portal • Department of AI / AI&ML
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800">
              Welcome, <span className="text-[#C61A22]">{user?.name?.split(' (')[0]}</span>
            </h1>
            <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-md mb-4">
              Report faculty cabin maintenance, lecture hall audiovisual problems, or department infrastructure needs directly for administrative action.
            </p>
            <div>
              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-[#C61A22] hover:bg-[#A8161D] transition-colors shadow-md shrink-0"
              >
                <PlusCircle size={15} />
                Submit Grievance
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Announcement Board */}
      <AnnouncementBoard />


      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Reported</span>
            <span className="text-2xl font-bold text-[#1B2A4A] block mt-1">{stats.total}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#FAF3DE] text-[#D4A017]">
            <FileText size={20} />
          </div>
        </div>
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Pending Action</span>
            <span className="text-2xl font-bold text-amber-600 block mt-1">{stats.pending}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
            <Clock size={20} />
          </div>
        </div>
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Under Repair</span>
            <span className="text-2xl font-bold text-blue-600 block mt-1">{stats.in_progress}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
            <Clock size={20} />
          </div>
        </div>
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Resolved</span>
            <span className="text-2xl font-bold text-emerald-600 block mt-1">{stats.resolved}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle size={20} />
          </div>
        </div>
      </div>
        </>
      )}

      {/* Grievance List Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Controls Bar */}
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              My Submitted Department Requests
            </h2>
            <p className="text-xs text-slate-500">
              Showing {filteredGrievances.length} of {grievances.length} requests
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 rounded-xl text-xs font-medium border border-slate-200 bg-slate-50 text-slate-800 outline-none focus:ring-2 focus:ring-[#C61A22] w-44"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-200 bg-slate-50 text-slate-800 outline-none focus:ring-2 focus:ring-[#C61A22]"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-200 bg-slate-50 text-slate-800 outline-none focus:ring-2 focus:ring-[#C61A22]"
            >
              <option value="all">All Categories</option>
              <option value="Cabin Issue">Cabin Issue</option>
              <option value="Classroom">Classroom</option>
              <option value="Student Issue">Student Issue</option>
            </select>

            {availableIssueTypes.length > 0 && (
              <select
                value={issueTypeFilter}
                onChange={(e) => setIssueTypeFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-200 bg-slate-50 text-slate-800 outline-none focus:ring-2 focus:ring-[#C61A22]"
              >
                <option value="all">All Issue Types</option>
                {availableIssueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Content Table / Cards */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            Loading your submitted requests...
          </div>
        ) : filteredGrievances.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-3">
              <FileText size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              No faculty grievances found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              {grievances.length === 0
                ? "You haven't reported any cabin or classroom maintenance issues yet."
                : "No items match your active filters."}
            </p>
            {grievances.length === 0 && (
              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#C61A22] hover:bg-[#A8161D] transition-colors shadow-sm"
              >
                <PlusCircle size={14} /> Submit New Grievance
              </button>
            )}
          </div>
        ) : (
          <div className="p-4 space-y-4 bg-slate-50/50">
            {filteredGrievances.map((g) => (
              <div
                key={g.id || g._id}
                onClick={() => setSelectedGrievanceId(g.id || g._id)}
                className="group relative bg-white border border-slate-200 hover:border-red-200 rounded-2xl p-5 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center gap-4 overflow-hidden shadow-sm"
              >
                {/* Red Left Border Accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C61A22] rounded-l-2xl" />

                <div className="flex-1 flex gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                    <FileText size={20} />
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 border border-red-100">
                        {g.category_name}
                      </span>
                      <StatusBadge status={g.status} />
                      {g.resolution_photo_url && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Camera size={11} /> Photo Proof
                        </span>
                      )}
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                        <Clock size={12} />
                        {new Date(g.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap pt-0.5">
                      <p className="text-[14px] font-bold text-slate-800">
                        {g.details?.issue_type || g.title || g.description || `${g.category_name} Issue`}
                      </p>
                      {(g.details?.room_no || g.details?.lab_name || g.details?.cabin_no || g.details?.student_name || (g.details?.system_no && g.details.system_no !== 'N/A')) && (
                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                          {g.details.lab_name && <span>{g.details.lab_name}</span>}
                          {g.details.room_no && <span>{g.details.lab_name ? '• ' : ''}Room {g.details.room_no}</span>}
                          {g.details.cabin_no && <span>Cabin {g.details.cabin_no}</span>}
                          {g.details.student_name && <span>Student: {g.details.student_name}</span>}
                          {g.details.system_no && g.details.system_no !== 'N/A' && <span>• Sys #{g.details.system_no}</span>}
                          {g.details.floor && <span>• {g.details.floor}</span>}
                        </span>
                      )}
                    </div>

                    {g.description && g.description !== g.details?.issue_type && (
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {g.description}
                      </p>
                    )}
                    {g.admin_notes && (
                      <p className="text-xs text-slate-600 font-medium line-clamp-1">
                        <span className="text-[#C61A22] font-bold">Remark:</span> {g.admin_notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  {g.status === 'pending' && (
                    <div className="flex items-center gap-2 mr-2">
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setGrievanceToEdit(g);
                        }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors relative z-10"
                        title="Edit Description"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => deleteGrievance(g.id || g._id, e)}
                        className={`p-2 rounded-lg transition-colors relative z-10 flex items-center gap-1 ${
                          confirmDeleteId === (g.id || g._id)
                            ? 'bg-rose-600 text-white hover:bg-rose-700 px-3'
                            : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                        }`}
                        title={confirmDeleteId === (g.id || g._id) ? "Click again to confirm" : "Delete Grievance"}
                      >
                        <Trash2 size={16} />
                        {confirmDeleteId === (g.id || g._id) && <span className="text-xs font-bold">Confirm</span>}
                      </button>
                    </div>
                  )}
                  <button className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
                    View Details
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* Modals */}
      <GrievanceFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onGrievanceCreated={loadMyGrievances}
      />

      <GrievanceDetailModal
        grievanceId={selectedGrievanceId}
        onClose={() => setSelectedGrievanceId(null)}
      />

      <EditGrievanceModal
        isOpen={!!grievanceToEdit}
        grievance={grievanceToEdit}
        onClose={() => setGrievanceToEdit(null)}
        onGrievanceUpdated={loadMyGrievances}
      />
    </div>
  );
}
