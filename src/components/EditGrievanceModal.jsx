'use client';

import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api-client';
import { X, Save, AlertCircle } from 'lucide-react';

export default function EditGrievanceModal({ isOpen, onClose, grievance, onGrievanceUpdated }) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && grievance) {
      setDescription(grievance.description || '');
      setError('');
    }
  }, [isOpen, grievance]);

  if (!isOpen || !grievance) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Description cannot be empty.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await apiRequest(`/api/grievances/${grievance.id || grievance._id}`, {
        method: 'PUT',
        body: JSON.stringify({ description: description.trim() }),
      });

      if (res.success) {
        onGrievanceUpdated();
        onClose();
      } else {
        setError(res.message || 'Failed to update grievance.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while updating.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            Edit Pending Grievance
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-sm flex items-start gap-2.5 border border-rose-100 dark:border-rose-800/50">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} id="edit-grievance-form" className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Issue Description
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Update your issue description..."
                className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-slate-800 dark:text-slate-200"
              />
              <p className="text-[11px] text-slate-500 mt-1.5">
                Note: You can only edit grievances that have not yet been reviewed (Pending status).
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 shrink-0 flex justify-end gap-3 bg-slate-50 dark:bg-slate-850 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-grievance-form"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-sm transition-colors disabled:opacity-70"
          >
            {loading ? 'Saving...' : 'Save Changes'}
            {!loading && <Save size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
