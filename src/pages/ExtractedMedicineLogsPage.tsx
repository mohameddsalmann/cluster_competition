import React, { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { useDemoData } from '../context/DemoDataContext';
import {
  Search,
  Filter,
  Eye,
  X,
  Mic,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { ExtractedMedicineLog } from '../types';

export const ExtractedMedicineLogsPage: React.FC = () => {
  const { extractedLogs, updateExtractedLogReview } = useDemoData();

  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<'all' | 'Audio' | 'Image'>('all');
  const [reviewFilter, setReviewFilter] = useState<string>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedItemDetail, setSelectedItemDetail] = useState<ExtractedMedicineLog | null>(null);

  // Review modal internal note
  const [reviewerNoteInput, setReviewerNoteInput] = useState('');

  const filteredLogs = useMemo(() => {
    return extractedLogs.filter((log) => {
      const matchSearch =
        log.logId.includes(searchTerm) ||
        log.pharmacy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.pharmacyId.includes(searchTerm);

      const matchType = typeFilter === 'all' || log.type === typeFilter;
      const matchReview = reviewFilter === 'all' || log.reviewStatus === reviewFilter;

      return matchSearch && matchType && matchReview;
    });
  }, [extractedLogs, searchTerm, typeFilter, reviewFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  useEffect(() => { setCurrentPage(page => Math.min(page, totalPages)); }, [totalPages]);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  const openDetailModal = (item: ExtractedMedicineLog) => {
    setSelectedItemDetail(item);
    setReviewerNoteInput(item.reviewerNotes || '');
  };

  const handleUpdateReviewStatus = (status: ExtractedMedicineLog['reviewStatus']) => {
    if (!selectedItemDetail) return;
    updateExtractedLogReview(selectedItemDetail.id, status, reviewerNoteInput);
    setSelectedItemDetail((prev) =>
      prev ? { ...prev, reviewStatus: status, reviewerNotes: reviewerNoteInput } : null
    );
  };

  return (
    <div className="w-full pb-16">
      <PageHeader
        title="Extracted Medicine Logs"
        breadcrumbs={['Dashboard', 'Extracted Medicine Logs']}
      />

      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 space-y-4">
        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] overflow-hidden">
          {/* Card Toolbar matching Screenshot 2 */}
          <div className="p-4 border-b border-[#e2e8f0] flex flex-wrap items-center justify-between gap-3 bg-white">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-bold text-slate-800">
                Extracted Medicine Logs
              </h2>
              <button
                type="button"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border transition ${
                  showAdvancedFilters
                    ? 'bg-slate-200 border-slate-300 text-slate-800'
                    : 'bg-[#f8fafc] border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>Advanced Filters</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="search pharmacy or ID..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f8fafc] border border-slate-200 rounded text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0083cb]"
                />
              </div>

              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1.5 bg-[#f8fafc] border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0083cb]"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          {/* Advanced Filter Collapse */}
          {showAdvancedFilters && (
            <div className="p-3 bg-[#f8fafc] border-b border-slate-200 flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600">Input Modality:</span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="px-2 py-1 bg-white border border-slate-200 rounded"
                >
                  <option value="all">All Modalities (Audio & Image)</option>
                  <option value="Audio">Audio Voice Orders</option>
                  <option value="Image">Prescription Images</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600">Review Status:</span>
                <select
                  value={reviewFilter}
                  onChange={(e) => setReviewFilter(e.target.value)}
                  className="px-2 py-1 bg-white border border-slate-200 rounded"
                >
                  <option value="all">All Reviews</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Verified">Verified</option>
                  <option value="Corrected">Corrected</option>
                </select>
              </div>
            </div>
          )}

          {/* Table matching Screenshot 2 */}
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#fafbfc] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 w-12">#</th>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">TYPE</th>
                  <th className="py-3 px-4 min-w-[200px]">PHARMACY</th>
                  <th className="py-3 px-4 text-center">EXTRACTED MEDICINES</th>
                  <th className="py-3 px-4 text-center">MATCHED MEDICINES</th>
                  <th className="py-3 px-4 min-w-[150px]">CREATED</th>
                  <th className="py-3 px-4 text-center">REVIEW STATUS</th>
                  <th className="py-3 px-4 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9] text-xs">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      No extracted medicine logs found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, index) => {
                    const isAudio = item.type === 'Audio';

                    return (
                      <tr key={item.id} className="hover:bg-[#f8fafc] transition">
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {(currentPage - 1) * pageSize + index + 1}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800 text-[11px] font-mono">
                          {item.logId}
                        </td>
                        <td className="py-3 px-4">
                          {isAudio ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#e0f2fe] text-[#0284c7]">
                              <Mic className="w-3 h-3" />
                              Audio
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#dcfce7] text-[#16a34a]">
                              <ImageIcon className="w-3 h-3" />
                              Image
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className={`font-semibold text-slate-800 text-xs ${item.pharmacy.match(/[\u0600-\u06FF]/) ? 'font-arabic' : ''}`}>
                            {item.pharmacy}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            ID: {item.pharmacyId}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-medium text-slate-700">
                          {item.extractedMedicinesCount} medicines
                        </td>
                        <td className="py-3 px-4 text-center font-medium text-slate-700">
                          <span
                            className={
                              item.matchedMedicinesCount > 0
                                ? 'text-emerald-600 font-semibold'
                                : 'text-slate-400'
                            }
                          >
                            {item.matchedMedicinesCount} matched
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800 font-mono text-[11px]">
                          {item.createdAt}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.reviewStatus === 'Verified'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : item.reviewStatus === 'Corrected'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {item.reviewStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => openDetailModal(item)}
                            className="p-1.5 text-slate-400 hover:text-[#0083cb] rounded hover:bg-sky-50 transition"
                            title="Inspect extraction items"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-[#e2e8f0] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 bg-[#fafbfc]">
            <div>
              Showing {filteredLogs.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredLogs.length)} of {filteredLogs.length} entries
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50 text-slate-700"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded text-xs font-semibold ${
                    currentPage === i + 1
                      ? 'bg-[#0083cb] text-white shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 rounded border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50 text-slate-700"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail & Human-in-the-Loop Review Modal */}
      {selectedItemDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-scaleIn max-h-[90vh] flex flex-col">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#0083cb]" />
                <h3 className="text-sm font-bold text-slate-800">
                  Extracted Items Detail - Log #{selectedItemDetail.logId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItemDetail(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Metadata strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Pharmacy</span>
                  <span className="font-bold text-slate-800">{selectedItemDetail.pharmacy}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Input Type</span>
                  <span className="font-semibold text-[#0083cb]">{selectedItemDetail.type}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Acoustic / Visual Spec</span>
                  <span className="text-slate-700">{selectedItemDetail.sourceDetails.dialectOrFormat || 'Standard'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Device</span>
                  <span className="text-slate-700">{selectedItemDetail.sourceDetails.deviceType || 'App Client'}</span>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="font-bold text-slate-700 mb-2 uppercase tracking-wider text-[11px]">
                  Extracted Pharmaceutical Entities ({selectedItemDetail.extractedItems.length})
                </h4>
                <div className="border border-slate-200 rounded divide-y divide-slate-100 max-h-60 overflow-y-auto">
                  {selectedItemDetail.extractedItems.map((item, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between gap-3 hover:bg-slate-50">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-arabic font-medium text-slate-800 dir-rtl text-right">
                          <span dir="rtl">{item.rawText}</span>
                        </div>
                        <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                          &rarr; {item.suggestedMatch}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-100">
                          {(item.confidence * 100).toFixed(0)}%
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                            item.matchStatus === 'matched'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.matchStatus === 'matched' ? 'Auto-Matched' : 'Needs Review'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviewer Note */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Pharmacist / Reviewer Notes
                </label>
                <textarea
                  rows={2}
                  value={reviewerNoteInput}
                  onChange={(e) => setReviewerNoteInput(e.target.value)}
                  placeholder="Add notes about acoustic quality, handwriting clarity, or remapped items..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0083cb]"
                />
              </div>

              {/* Actions for human review */}
              <div className="bg-sky-50/60 p-3 rounded border border-sky-100 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-700">
                  Update Human-in-the-Loop Gate:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateReviewStatus('Verified')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-xs transition"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Verify All</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateReviewStatus('Corrected')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded text-xs transition"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Mark Corrected</span>
                  </button>
                  <button type="button" onClick={() => handleUpdateReviewStatus('Rejected')} className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded text-xs">Reject</button>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end flex-shrink-0">
              <button
                type="button"
                onClick={() => setSelectedItemDetail(null)}
                className="px-4 py-1.5 bg-slate-200 text-slate-700 font-semibold rounded text-xs hover:bg-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
