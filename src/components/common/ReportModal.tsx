import React, { useState } from 'react';
import { X, AlertTriangle, Shield } from 'lucide-react';
import { useToast } from './Toast';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'post' | 'user';
  targetId: string;
  itemPreview: string;
  onSubmitReport: (data: {
    type: 'post' | 'user';
    targetId: string;
    reason: string;
    details: string;
    itemPreview: string;
  }) => void;
}

const REPORT_REASONS = [
  'Commercial booking solicitation / Spam',
  'Inappropriate or dangerous route guidance',
  'Impersonation or falsified summits',
  'Harassment or abusive conduct',
  'Environmental / Leave No Trace violation',
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  itemPreview,
  onSubmitReport,
}) => {
  const { showToast } = useToast();
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport({
      type: targetType,
      targetId,
      reason: selectedReason,
      details: details.trim(),
      itemPreview,
    });
    onClose();
    showToast('Report submitted to Trust & Safety moderation queue', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-rose-600" />
            <h3 className="font-bold text-base text-stone-900">
              Report {targetType === 'post' ? 'Post' : 'Explorer Account'}
            </h3>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-stone-600 mb-4">
          <span className="font-semibold block text-stone-800 mb-0.5">Item Flagged:</span>
          <span className="italic line-clamp-2">"{itemPreview}"</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Reason for Flag</label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-white"
            >
              {REPORT_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Additional Context (Optional)</label>
            <textarea
              rows={3}
              placeholder="Provide specific details to help our safety moderators..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full px-3 py-2 border border-stone-200 rounded-xl"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold shadow-xs"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
