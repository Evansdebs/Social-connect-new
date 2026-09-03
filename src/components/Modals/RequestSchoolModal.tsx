import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Building2, MapPin, Mail, User as UserIcon, Send, Sparkles, CheckCircle2, Globe, FileText } from 'lucide-react';

interface RequestSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultName?: string;
  defaultEmail?: string;
  onSubmitted?: (schoolName: string) => void;
}

export const RequestSchoolModal: React.FC<RequestSchoolModalProps> = ({
  isOpen,
  onClose,
  defaultName = '',
  defaultEmail = '',
  onSubmitted
}) => {
  const { createSchoolRequest, showToast } = useApp();

  const [schoolName, setSchoolName] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [notes, setNotes] = useState('');
  const [requesterName, setRequesterName] = useState(defaultName);
  const [requesterEmail, setRequesterEmail] = useState(defaultEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim() || !location.trim()) {
      showToast('Please enter both school name and location.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const combinedNotes = [
        website.trim() ? `Website: ${website.trim()}` : '',
        notes.trim() ? notes.trim() : ''
      ].filter(Boolean).join(' • ');

      await createSchoolRequest({
        schoolName: schoolName.trim(),
        location: location.trim(),
        notes: combinedNotes,
        requesterName: requesterName.trim() || defaultName || 'Applicant',
        requesterEmail: requesterEmail.trim() || defaultEmail || ''
      });

      setSubmittedSuccess(true);
      if (onSubmitted) {
        onSubmitted(schoolName.trim());
      }
      setTimeout(() => {
        setSubmittedSuccess(false);
        onClose();
      }, 1800);
    } catch (err: any) {
      showToast(err?.message || 'Failed to submit school request.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-base leading-tight">Request School Addition</h3>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                Send school details to Platform Administrator
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submittedSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-extrabold text-neutral-900 text-base">School Request Sent!</h4>
            <p className="text-xs text-neutral-600 leading-relaxed max-w-xs mx-auto">
              Your request for <strong>{schoolName}</strong> was dispatched to the platform admin. You can now continue your registration without any interruption!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs text-neutral-800">
            <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3 text-[11px] text-blue-900 leading-relaxed">
              Can't find your campus in the dropdown? Submit its name and location. The admin will verify and add it. <strong>You can register right now even without selecting a school!</strong>
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1">
                School / Institution Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="e.g., St. Augustine's College or Ashesi University"
                  className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1">
                Location / City / Region <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Cape Coast, Central Region, Ghana"
                  className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Your Name (Optional)</label>
                <div className="relative">
                  <UserIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full pl-8 pr-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Your Email (Optional)</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    value={requesterEmail}
                    onChange={(e) => setRequesterEmail(e.target.value)}
                    placeholder="student@mail.com"
                    className="w-full pl-8 pr-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-xs"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1">School Website or Link (Optional)</label>
              <div className="relative">
                <Globe className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://myschool.edu.gh"
                  className="w-full pl-8 pr-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1">Additional Notes (Optional)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="High school, university, campus branch details, etc."
                className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 resize-none text-xs"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending Request...' : 'Send Request to Admin'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
