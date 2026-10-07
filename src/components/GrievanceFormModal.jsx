'use client';

import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api-client';
import { useAuth } from '@/context/AuthContext';
import { X, Send, AlertCircle, UploadCloud, CheckCircle, FileText, ShieldCheck, GraduationCap, Image as ImageIcon, Trash2, Video } from 'lucide-react';

export const ALL_FLOORS = [
  'Ground Floor',
  '1st Floor',
  '2nd Floor',
  '3rd Floor',
  '4th Floor',
  '5th Floor',
  '6th Floor',
  '7th Floor',
  '8th Floor',
];

export const detectFloorFromRoom = (val) => {
  if (!val || typeof val !== 'string') return null;
  const trimmed = val.trim();
  // Support explicit ground floor indications
  if (/^g(?:round)?[\s-_]?\d*/i.test(trimmed)) {
    return 'Ground Floor';
  }
  // Match first sequence of digits (e.g. '202' -> '2', 'CR-304' -> '3', 'H 801' -> '8')
  const match = trimmed.match(/\d+/);
  if (!match) return null;
  const firstDigit = match[0].charAt(0);
  const floorMap = {
    '0': 'Ground Floor',
    '1': '1st Floor',
    '2': '2nd Floor',
    '3': '3rd Floor',
    '4': '4th Floor',
    '5': '5th Floor',
    '6': '6th Floor',
    '7': '7th Floor',
    '8': '8th Floor',
  };
  return floorMap[firstDigit] || null;
};

export const POPULAR_LAB_ROOMS = ['H 103', 'H 106', 'H 201', 'H 305', 'H 402', 'H 801'];

export default function GrievanceFormModal({ isOpen, onClose, onGrievanceCreated }) {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedYear, setSelectedYear] = useState(user?.year || 1);
  const [selectedBranch, setSelectedBranch] = useState(user?.branch || 'AIML');
  const [selectedSection, setSelectedSection] = useState(user?.section || 'A');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [fileName, setFileName] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Category specific state fields
  // Classroom
  const [roomNo, setRoomNo] = useState('');
  const [block, setBlock] = useState('H Block');
  const [floor, setFloor] = useState('Ground Floor');
  const [classroomIssueType, setClassroomIssueType] = useState('Projector/Display');
  const [customClassroomIssueType, setCustomClassroomIssueType] = useState('');

  // Labs
  const [labName, setLabName] = useState('');
  const [labRoomNo, setLabRoomNo] = useState('');
  const [labFloor, setLabFloor] = useState('Ground Floor');
  const [systemNo, setSystemNo] = useState('');
  const [labIssueType, setLabIssueType] = useState('');

  // Cabin
  const [cabinNo, setCabinNo] = useState('');
  const [cabinFloor, setCabinFloor] = useState('Ground Floor');
  const [cabinIssueType, setCabinIssueType] = useState('');

  // Student Issue
  const [studentName, setStudentName] = useState('');
  const [studentRollNo, setStudentRollNo] = useState('');
  const [studentIssueType, setStudentIssueType] = useState('Academic Performance');

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      resetForm();
    }
  }, [isOpen]);

  const loadCategories = async () => {
    try {
      const res = await apiRequest('/api/categories');
      if (res.success && res.categories) {
        // Exclude Faculty category
        let availableCategories = res.categories.filter(
          (c) => c.name.toLowerCase() !== 'faculty'
        );
        if (user?.role === 'teacher') {
          availableCategories = availableCategories.filter(
            (c) => c.name.toLowerCase() !== 'student issue'
          );
        }
        setCategories(availableCategories);
        if (availableCategories.length > 0) {
          setSelectedCategoryId(availableCategories[0].id || availableCategories[0]._id);
        }
      }
    } catch (err) {
      setError('Could not load grievance categories');
    }
  };

  const resetForm = () => {
    setSelectedYear(user?.year || 1);
    setSelectedBranch(user?.branch || 'AIML');
    setSelectedSection(user?.section || 'A');
    setDescription('');
    setAttachment(null);
    setFileName('');
    setImagePreview(null);
    setVideoPreview(null);
    setIsDragging(false);
    setError('');
    setRoomNo('');
    setBlock('H Block');
    setFloor('Ground Floor');
    setClassroomIssueType('Projector/Display');
    setCustomClassroomIssueType('');
    setLabName('');
    setLabRoomNo('');
    setLabFloor('Ground Floor');
    setSystemNo('');
    setLabIssueType('');
    setCabinNo('');
    setCabinFloor('Ground Floor');
    setCabinIssueType('');
    setStudentName('');
    setStudentRollNo('');
    setStudentIssueType('Academic Performance');
  };

  const currentCategory = categories.find(
    (c) => (c.id || c._id) === selectedCategoryId
  );

  const compressImage = (file) => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(file);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1280;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const optimizedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(optimizedFile);
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            0.82
          );
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const processFile = async (file) => {
    if (!file) return;

    // Support Video Uploads up to 25MB
    if (file.type.startsWith('video/')) {
      if (file.size > 25 * 1024 * 1024) {
        setError('Video file size cannot exceed 25MB.');
        return;
      }
      setAttachment(file);
      setFileName(file.name);
      setVideoPreview(URL.createObjectURL(file));
      setImagePreview(null);
      setError('');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError('File size cannot exceed 15MB.');
      return;
    }

    try {
      const optimized = await compressImage(file);
      setAttachment(optimized);
      setFileName(optimized.name);
      if (optimized.type.startsWith('image/')) {
        setImagePreview(URL.createObjectURL(optimized));
        setVideoPreview(null);
      } else {
        setImagePreview(null);
        setVideoPreview(null);
      }
      setError('');
    } catch {
      setAttachment(file);
      setFileName(file.name);
      setImagePreview(null);
      setVideoPreview(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const removeAttachment = (e) => {
    if (e) e.stopPropagation();
    setAttachment(null);
    setFileName('');
    setImagePreview(null);
    setVideoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const details = {};

      if (currentCategory?.name === 'Classroom') {
        const finalIssueType = classroomIssueType === 'Other' ? customClassroomIssueType : classroomIssueType;
        if (!roomNo.trim() || !floor.trim() || !finalIssueType.trim()) {
          throw new Error('Please fill all required Classroom grievance fields.');
        }
        details.room_no = roomNo.trim();
        details.block = (block && block.trim()) || 'H Block';
        details.floor = floor.trim();
        details.issue_type = finalIssueType.trim();
      } else if (currentCategory?.name === 'Labs') {
        if (!labName.trim() || !labIssueType.trim()) {
          throw new Error('Please fill all required Laboratory grievance fields.');
        }
        details.lab_name = labName.trim();
        if (labRoomNo.trim()) {
          details.room_no = labRoomNo.trim();
        }
        if (labFloor.trim()) {
          details.floor = labFloor.trim();
        }
        details.system_no = systemNo.trim() || 'N/A';
        details.issue_type = labIssueType.trim();
      } else if (currentCategory?.name === 'Cabin Issue') {
        if (!cabinNo.trim() || !cabinIssueType.trim()) {
          throw new Error('Please fill all required Faculty Cabin fields.');
        }
        details.cabin_no = cabinNo.trim();
        details.floor = cabinFloor.trim();
        details.issue_type = cabinIssueType.trim();
      } else if (currentCategory?.name === 'Student Issue') {
        if (!studentName.trim() || !studentRollNo.trim() || !studentIssueType.trim()) {
          throw new Error('Please fill all required Student Issue fields.');
        }
        details.student_name = studentName.trim();
        details.roll_no = studentRollNo.trim();
        details.issue_type = studentIssueType.trim();
      }

      let attachment_url = null;
      if (attachment) {
        attachment_url = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(attachment);
        });
      }

      const res = await apiRequest('/api/grievances', {
        method: 'POST',
        body: JSON.stringify({
          category_id: selectedCategoryId,
          year: selectedYear,
          branch: selectedBranch,
          section: selectedSection,
          description: description.trim(),
          details,
          attachment_url,
        }),
      });

      if (res.success) {
        if (onGrievanceCreated) onGrievanceCreated();
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit grievance');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-[#1B2A4A] flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#1B2A4A]" />
              File AI &amp; AI/ML Department Grievance
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Submit concerns across 1st, 2nd, 3rd, or 4th year for direct review by HOD &amp; Department committee.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#1B2A4A] hover:bg-slate-200/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl text-sm bg-rose-50 text-rose-700 border border-rose-200 flex items-start gap-2.5 font-medium">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Category Select */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
              Grievance Category <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {categories.map((cat) => {
                const catId = cat.id || cat._id;
                const isSelected = selectedCategoryId === catId;
                return (
                  <button
                    key={catId}
                    type="button"
                    onClick={() => setSelectedCategoryId(catId)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 shadow-sm ring-1 ring-indigo-500/30'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>


          {/* Dynamic Fields: Classroom */}
          {currentCategory?.name === 'Classroom' && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Classroom Infrastructure Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 202, CR-304, or 801"
                    value={roomNo}
                    onChange={(e) => {
                      const val = e.target.value;
                      setRoomNo(val);
                      const autoFloor = detectFloorFromRoom(val);
                      if (autoFloor) {
                        setFloor(autoFloor);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Floor *
                    {detectFloorFromRoom(roomNo) && (
                      <span className="text-[11px] font-normal text-indigo-600 dark:text-indigo-400 ml-1.5">
                        (auto-selected: {detectFloorFromRoom(roomNo)})
                      </span>
                    )}
                  </label>
                  <select
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {ALL_FLOORS.map((flr) => (
                      <option key={flr} value={flr}>
                        {flr}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Issue Type *
                  </label>
                  {classroomIssueType !== 'Other' ? (
                    <select
                      value={classroomIssueType}
                      onChange={(e) => setClassroomIssueType(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="Projector/Display">Projector / HDMI Display</option>
                      <option value="AC/Fan">Air Conditioning / Ceiling Fan</option>
                      <option value="Seating/Desks">Broken Benches / Desks</option>
                      <option value="Sound/Mic">Microphone / Audio Amplifier</option>
                      <option value="Lighting">Tube Lights / Power Outlets</option>
                      <option value="Other">Other Classroom Concern</option>
                    </select>
                  ) : (
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        required
                        autoFocus
                        placeholder="Type issue here..."
                        value={customClassroomIssueType}
                        onChange={(e) => setCustomClassroomIssueType(e.target.value)}
                        className="w-full px-3 py-2 pr-14 rounded-lg text-sm border border-indigo-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setClassroomIssueType('Projector/Display');
                          setCustomClassroomIssueType('');
                        }}
                        className="absolute right-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Fields: Labs */}
          {currentCategory?.name === 'Labs' && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-3.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  AI & AIML Laboratory Details
                </h4>
                <span className="text-[11px] font-medium text-slate-400">
                  Ground to 8th Floor
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Lab Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Super Computing Lab, AI Lab"
                    value={labName}
                    onChange={(e) => setLabName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Lab Room No. / Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. H 103, H 201, H 801"
                    value={labRoomNo}
                    onChange={(e) => {
                      const val = e.target.value;
                      setLabRoomNo(val);
                      const autoFloor = detectFloorFromRoom(val);
                      if (autoFloor) {
                        setLabFloor(autoFloor);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Floor *
                    {detectFloorFromRoom(labRoomNo) && (
                      <span className="text-[11px] font-normal text-indigo-600 dark:text-indigo-400 ml-1.5">
                        (auto-selected: {detectFloorFromRoom(labRoomNo)})
                      </span>
                    )}
                  </label>
                  <select
                    value={labFloor}
                    onChange={(e) => setLabFloor(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {ALL_FLOORS.map((flr) => (
                      <option key={flr} value={flr}>
                        {flr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    System / PC No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PC-18, WS-08, or All"
                    value={systemNo}
                    onChange={(e) => setSystemNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Issue Category *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GPU crash, OS driver issue, LAN not working"
                    value={labIssueType}
                    onChange={(e) => setLabIssueType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Fields: Cabin */}
          {currentCategory?.name === 'Cabin Issue' && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Faculty Cabin Maintenance
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Cabin Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 202 or H 304"
                    value={cabinNo}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCabinNo(val);
                      const autoFloor = detectFloorFromRoom(val);
                      if (autoFloor) {
                        setCabinFloor(autoFloor);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Floor *
                    {detectFloorFromRoom(cabinNo) && (
                      <span className="text-[11px] font-normal text-indigo-600 dark:text-indigo-400 ml-1.5">
                        (auto-selected: {detectFloorFromRoom(cabinNo)})
                      </span>
                    )}
                  </label>
                  <select
                    value={cabinFloor}
                    onChange={(e) => setCabinFloor(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {ALL_FLOORS.map((flr) => (
                      <option key={flr} value={flr}>
                        {flr}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Maintenance Issue *
                  </label>
                  <input
                    list="cabin-issues"
                    value={cabinIssueType}
                    onChange={(e) => setCabinIssueType(e.target.value)}
                    placeholder="Select or type your issue..."
                    className="w-full px-3 py-2 rounded-lg text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                  <datalist id="cabin-issues">
                    <option value="Electrical / Switchboard" />
                    <option value="Chair / Table Repair" />
                    <option value="Faculty LAN / Wi-Fi" />
                    <option value="AC Not Cooling / Water Leak" />
                    <option value="Housekeeping / Cleaning" />
                  </datalist>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Fields: Student Issue */}
          {currentCategory?.name === 'Student Issue' && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Student Concern Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Kumar"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2100xxxx"
                    value={studentRollNo}
                    onChange={(e) => setStudentRollNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Issue Type *
                  </label>
                  <select
                    value={studentIssueType}
                    onChange={(e) => setStudentIssueType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="Academic Performance">Academic Performance</option>
                    <option value="Disciplinary">Disciplinary Issue</option>
                    <option value="Attendance">Low Attendance</option>
                    <option value="Medical/Personal">Medical / Personal</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Description Textarea */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
              Detailed Description <span className="text-slate-400 font-normal lowercase tracking-normal">(optional)</span>
            </label>
            <textarea
              rows={4}
              placeholder="Clearly state the issue, its frequency, and any urgent impact on lectures or practical labs (optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>

          {/* File Attachment Dropzone with Image or Video Preview */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
              Attach Evidence / Photo or Video Proof (Optional)
            </label>

            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 p-2 flex flex-col items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Proof preview"
                  className="max-h-48 rounded-xl object-contain"
                />
                <div className="w-full flex items-center justify-between pt-2 px-1 text-xs text-slate-300">
                  <span className="truncate max-w-xs">{fileName}</span>
                  <button
                    type="button"
                    onClick={removeAttachment}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600/80 hover:bg-red-600 text-white font-semibold transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              </div>
            ) : videoPreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 p-2 flex flex-col items-center">
                <video
                  src={videoPreview}
                  controls
                  className="max-h-52 w-full rounded-xl object-contain bg-black"
                />
                <div className="w-full flex items-center justify-between pt-2 px-1 text-xs text-slate-300">
                  <span className="truncate max-w-xs flex items-center gap-1.5 text-slate-200 font-medium">
                    <Video size={14} className="text-red-400 shrink-0" /> {fileName}
                  </span>
                  <button
                    type="button"
                    onClick={removeAttachment}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600/80 hover:bg-red-600 text-white font-semibold transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <label
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center p-5 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:border-indigo-400'
                }`}
              >
                <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-2">
                  <UploadCloud size={24} />
                  <span className="text-slate-300 dark:text-slate-600">/</span>
                  <Video size={22} className="text-red-500" />
                </div>
                {fileName ? (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle size={14} />
                    <span>{fileName}</span>
                  </div>
                ) : (
                  <div className="text-center">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                      Click to upload Photo or Video Proof, or Drag & Drop here
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Photos (JPG, PNG, WebP) or Video recordings (MP4, WebM up to 25MB)
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,video/*,.mp4,.webm,.mov,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-[#1B2A4A] bg-[#D4A017] hover:bg-[#C9A227] transition-all shadow-md shadow-[#D4A017]/25 active:scale-95 disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Submit Grievance'}
              {!submitting && <Send size={15} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
