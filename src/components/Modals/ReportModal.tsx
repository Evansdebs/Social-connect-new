import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';

export const ReportModal: React.FC = () => {
  const { closeModal, submitReport, modalData, showToast } = useApp();
  const [reason, setReason] = useState<string>('Harassment or Bullying');
  const [details, setDetails] = useState('');

  const reportReasons = [
    'Harassment or Bullying',
    'Spam or Scam',
    'Impersonation of Student/School',
    'Inappropriate or Explicit Content',
    'Hate Speech or Discrimination',
    'Academic Dishonesty / Fraud',
    'Dangerous or Harmful Activity'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport({
      targetType: modalData?.targetType || 'post',
      targetId: modalData?.targetId || 'unknown',
      reason,
      details: details.trim() || undefined
    });
    showToast('Report submitted for administrator review.', 'success');
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 px-6 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-extrabold text-sm text-neutral-900">Report Content or User</h3>
          </div>
          <button
            onClick={closeModal}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <p className="text-neutral-600 leading-relaxed">
            Campus Connect strives to maintain a safe, welcoming, and productive environment for all schools. Select the violation category below:
          </p>

          <div className="space-y-2">
            <label className="font-bold text-neutral-700 block">Reason for Report</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs outline-none focus:border-rose-500"
            >
              {reportReasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-neutral-700 block">Additional Details (Optional)</label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide any additional context for school moderators..."
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-rose-500 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-xl text-neutral-600 hover:bg-neutral-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors shadow-xs"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
