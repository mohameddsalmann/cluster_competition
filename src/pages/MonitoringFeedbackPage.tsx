import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { useDemoData } from '../context/DemoDataContext';
import {
  Activity,
  TrendingDown,
  TrendingUp,
  AlertOctagon,
  FileCheck,
  Plus,
  X,
  CheckCircle,
  MessageSquare,
  ArrowRight,
  Info,
} from 'lucide-react';
import { WeeklyQualityReport, FeedbackRecord } from '../types';

export const MonitoringFeedbackPage: React.FC = () => {
  const {
    weeklyReports,
    feedbackRecords,
    addFeedbackRecord,
    updateFeedbackStatus,
  } = useDemoData();

  const [selectedReport, setSelectedReport] = useState<WeeklyQualityReport>(weeklyReports[0]);
  const [showNewFeedbackModal, setShowNewFeedbackModal] = useState(false);

  // Form state for creating new reviewer feedback
  const [newTicketId, setNewTicketId] = useState(`FB-${Math.floor(410 + Math.random() * 50)}`);
  const [newMedicineFamily, setNewMedicineFamily] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAssignedOwner, setNewAssignedOwner] = useState('Mohammed Mohsen (AI Lead)');

  const handleCreateFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedicineFamily.trim() || !newDescription.trim()) return;

    addFeedbackRecord({
      ticketId: newTicketId,
      reportedBy: 'Dr. Heba Admin (Reviewer)',
      assignedOwner: newAssignedOwner,
      status: 'Under Investigation',
      issueDescription: newDescription,
      investigationFindings: 'Pending initial vector embedding distance and token analysis.',
      correctiveAction: 'To be assigned by AI lead in upcoming model sprint.',
      followUpResult: 'Awaiting next weekly audit report validation.',
      relatedMedicineFamily: newMedicineFamily,
    });

    setShowNewFeedbackModal(false);
    setNewMedicineFamily('');
    setNewDescription('');
    setNewTicketId(`FB-${Math.floor(460 + Math.random() * 50)}`);
  };

  return (
    <div className="w-full pb-16">
      <PageHeader
        title="Production Monitoring & Feedback Loop"
        breadcrumbs={['Dashboard', 'Governance', 'Ongoing Monitoring & Feedback']}
        actionSlot={
          <button
            onClick={() => setShowNewFeedbackModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#0066cc] hover:bg-[#0055b3] text-white text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Submit Reviewer Corrective Note</span>
          </button>
        }
      />

      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 space-y-6">
        {/* Banner Explaining Q33 Closed Loop */}
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 text-xs text-sky-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-3">
            <Activity className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                Closed-Loop Model Correction & Tester Reporting (Q33 RAI Playbook)
              </h3>
              <p className="text-slate-600 mt-0.5">
                Demonstrating the continuous improvement pipeline: Upstream catalogue formatting changes (Week 49) detected by human reviewers &rarr; Root cause investigated &rarr; Custom parser &amp; aliases deployed in v1.4.2 &rarr; Corrections fell to 2.1% in Week 51.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-[#0083cb] text-white text-[11px] font-bold shadow-xs whitespace-nowrap">
            Closed-Loop Verified
          </span>
        </div>

        {/* 4 Weekly Quality Reports Timeline / Cards */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[#0083cb]" />
            Weekly Quality & Reliability Reports (Last 4 Weeks)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {weeklyReports.map((report) => {
              const isSelected = selectedReport.id === report.id;
              const isSpikeWeek = report.correctionRate > 10;

              return (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 bg-white ${
                    isSelected
                      ? 'border-[#0083cb] shadow-md ring-2 ring-[#0083cb]/20'
                      : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800 text-xs">{report.weekLabel}</span>
                    {isSpikeWeek ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 flex items-center gap-1">
                        <AlertOctagon className="w-3 h-3" /> Spike
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Stable
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono mb-3">
                    {report.dateRange}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="p-2 bg-slate-50 rounded">
                      <span className="text-[10px] text-slate-400 block uppercase">Matching Quality</span>
                      <span className="font-bold text-[#0066cc] font-mono text-sm">
                        {report.matchingQualityScore}%
                      </span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded">
                      <span className="text-[10px] text-slate-400 block uppercase">Correction Rate</span>
                      <span className={`font-bold font-mono text-sm ${isSpikeWeek ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {report.correctionRate}%
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2 italic">
                    "{report.reviewerNotes}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Weekly Report Deep-Dive Card */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Detailed Tester Report
              </span>
              <h3 className="text-base font-bold text-slate-800">
                {selectedReport.weekLabel} ({selectedReport.dateRange})
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span>Total Extractions: <strong>{selectedReport.totalExtractions.toLocaleString()}</strong></span>
              <span>Extraction Failures: <strong className="text-amber-600">{selectedReport.extractionFailures}</strong></span>
              <span>Unresolved Issues: <strong className="text-rose-600">{selectedReport.unresolvedIssuesCount}</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-lg space-y-1">
              <span className="font-bold text-blue-900 block text-[11px] uppercase">
                Reviewer / Domain Tester Audit Notes:
              </span>
              <p className="text-slate-700 leading-relaxed font-medium">
                {selectedReport.reviewerNotes}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="font-bold text-slate-700 block text-[11px] uppercase">
                Operational Trends & Upstream Shifts:
              </span>
              <p className="text-slate-600 leading-relaxed">
                {selectedReport.trendsSummary}
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Records & Closed-Loop Tracker */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] overflow-hidden">
          <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between bg-white">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                Continuous Improvement Closed-Loop Feedback Records
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Every reviewer note creates an actionable feedback ticket leading to root cause analysis, code fixes, and verified follow-up.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {feedbackRecords.map((fb) => (
              <div key={fb.id} className="p-5 hover:bg-[#fafbfc] transition space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-1 rounded text-slate-800">
                      {fb.ticketId}
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs">
                      {fb.relatedMedicineFamily}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 font-mono">
                      Reported: {fb.reportedDate} by {fb.reportedBy}
                    </span>
                    {/* Status dropdown */}
                    <select
                      value={fb.status}
                      onChange={(e) => updateFeedbackStatus(fb.id, e.target.value as any)}
                      className={`text-[11px] font-bold px-2 py-1 rounded border ${
                        fb.status === 'Closed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : fb.status === 'Fix Deployed'
                          ? 'bg-sky-50 text-sky-800 border-sky-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      <option value="Under Investigation">Under Investigation</option>
                      <option value="Fix Deployed">Fix Deployed</option>
                      <option value="Closed">Closed</option>
                      <option value="Retraining Scheduled">Retraining Scheduled</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 bg-rose-50/60 border border-rose-100 rounded">
                    <span className="text-[10px] font-bold text-rose-800 uppercase block">1. Reviewer Issue Note</span>
                    <p className="text-slate-700 mt-1">{fb.issueDescription}</p>
                  </div>
                  <div className="p-2.5 bg-blue-50/60 border border-blue-100 rounded">
                    <span className="text-[10px] font-bold text-blue-800 uppercase block">2. Developer Root Cause & Action</span>
                    <p className="text-slate-700 mt-1"><strong>Action:</strong> {fb.correctiveAction}</p>
                  </div>
                  <div className="p-2.5 bg-emerald-50/60 border border-emerald-100 rounded">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">3. Closed Loop Validation Result</span>
                    <p className="text-slate-700 mt-1 font-medium">{fb.followUpResult}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Reviewer Feedback Modal */}
      {showNewFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-scaleIn">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#0083cb]" />
                <h3 className="text-sm font-bold text-slate-800">
                  Submit Reviewer Corrective Note
                </h3>
              </div>
              <button
                onClick={() => setShowNewFeedbackModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFeedback} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Ticket Reference ID
                </label>
                <input
                  type="text"
                  readOnly
                  value={newTicketId}
                  className="w-full px-3 py-1.5 bg-slate-100 border border-slate-200 rounded font-mono text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Affected Medicine Family / Supplier Catalogue
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Panadol Extra 24s / Supplier New Express..."
                  value={newMedicineFamily}
                  onChange={(e) => setNewMedicineFamily(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0083cb]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Reviewer Error Note & Explanation
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain the discrepancy (e.g. volume mismatch, dosage form confusion, pricing prefix noise)..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0083cb]"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  This note will be automatically routed to the AI Engineering lead for regex sanitization or hard-negative retraining.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Assigned Developer / Engineer
                </label>
                <select
                  value={newAssignedOwner}
                  onChange={(e) => setNewAssignedOwner(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0083cb]"
                >
                  <option value="Mohammed Mohsen (AI Lead)">Mohammed Mohsen (AI Lead)</option>
                  <option value="Voice Eng Team">Voice Eng Team</option>
                  <option value="Vision Pipeline Team">Vision Pipeline Team</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewFeedbackModal(false)}
                  className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0066cc] text-white font-semibold rounded hover:bg-[#0055b3]"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
