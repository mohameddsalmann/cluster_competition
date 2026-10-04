import React, { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { useDemoData } from '../context/DemoDataContext';
import {
  Bug,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Search,
  Filter,
  Info,
  X,
  Check,
  RefreshCw,
} from 'lucide-react';
import { ErrorLog } from '../types';

export const ErrorLogsPage: React.FC = () => {
  const { errorLogs, resolveError, unresolveError } = useDemoData();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'unresolved' | 'resolved'>('all');
  const [selectedErrorDetail, setSelectedErrorDetail] = useState<ErrorLog | null>(null);

  // Dynamic calculations for the 4 stat cards from the dataset
  const stats = useMemo(() => {
    const resolvedCount = errorLogs.filter(e => e.status === 'resolved').length;
    // Use the latest fixture date so the historic demo still has a meaningful seven-day window.
    const latest = Math.max(...errorLogs.map(e => Date.parse(e.lastOccurred.replace(' ', 'T'))), 0);
    const weekStart = latest - 7 * 24 * 60 * 60 * 1000;
    return {
      total: errorLogs.length,
      unresolved: errorLogs.length - resolvedCount,
      resolved: resolvedCount,
      last7Days: errorLogs.filter(e => Date.parse(e.lastOccurred.replace(' ', 'T')) > weekStart).length,
    };
  }, [errorLogs]);

  const filteredErrors = useMemo(() => {
    return errorLogs.filter((err) => {
      const matchSearch =
        err.errorMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
        err.errorDetails.toLowerCase().includes(searchTerm.toLowerCase()) ||
        err.controller.toLowerCase().includes(searchTerm.toLowerCase()) ||
        err.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        err.type.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        statusFilter === 'all' || err.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [errorLogs, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredErrors.length / pageSize));
  useEffect(() => { setCurrentPage(page => Math.min(page, totalPages)); }, [totalPages]);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredErrors.slice(start, start + pageSize);
  }, [filteredErrors, currentPage, pageSize]);

  return (
    <div className="w-full pb-16">
      <PageHeader
        title="Error Logs"
        breadcrumbs={['Dashboard', 'Error Logs']}
      />

      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 space-y-6">
        {/* 4 Stat Cards exactly matching Screenshot 6 colors and icons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Total Errors (Sky Blue) */}
          <div className="bg-[#38bdf8] text-white p-5 rounded-lg shadow-sm flex items-center justify-between">
            <div>
              <div className="text-3xl font-extrabold tracking-tight font-sans">
                {stats.total.toLocaleString()}
              </div>
              <div className="text-xs font-semibold text-white/90 mt-1">
                Total Errors
              </div>
            </div>
            <div className="p-2.5 bg-white/20 rounded-lg">
              <Bug className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* 2. Unresolved (Amber Yellow) */}
          <div className="bg-[#fbbf24] text-white p-5 rounded-lg shadow-sm flex items-center justify-between">
            <div>
              <div className="text-3xl font-extrabold tracking-tight font-sans">
                {stats.unresolved.toLocaleString()}
              </div>
              <div className="text-xs font-semibold text-white/90 mt-1">
                Unresolved
              </div>
            </div>
            <div className="p-2.5 bg-white/20 rounded-lg">
              <AlertTriangle className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* 3. Resolved (Emerald Green) */}
          <div className="bg-[#4ade80] text-white p-5 rounded-lg shadow-sm flex items-center justify-between">
            <div>
              <div className="text-3xl font-extrabold tracking-tight font-sans">
                {stats.resolved.toLocaleString()}
              </div>
              <div className="text-xs font-semibold text-white/90 mt-1">
                Resolved
              </div>
            </div>
            <div className="p-2.5 bg-white/20 rounded-lg">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* 4. Last 7 Demo Days (Purple) */}
          <div className="bg-[#a855f7] text-white p-5 rounded-lg shadow-sm flex items-center justify-between">
            <div>
              <div className="text-3xl font-extrabold tracking-tight font-sans">
                {stats.last7Days.toLocaleString()}
              </div>
              <div className="text-xs font-semibold text-white/90 mt-1">
                Last 7 Demo Days
              </div>
            </div>
            <div className="p-2.5 bg-white/20 rounded-lg">
              <Calendar className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Main Error Logs Card */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] overflow-hidden">
          {/* Card Toolbar matching Screenshot 6 */}
          <div className="p-4 border-b border-[#e2e8f0] flex flex-wrap items-center justify-between gap-3 bg-white">
            <h2 className="text-sm font-bold text-slate-800">
              Error Logs
            </h2>

            <div className="flex flex-wrap items-center gap-3">
              {/* Primary Search */}
              <div className="relative w-48 sm:w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="search ..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f8fafc] border border-slate-200 rounded text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0083cb]"
                />
              </div>

              {/* Page size */}
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

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 bg-[#f8fafc] border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0083cb]"
              >
                <option value="all">All Statuses</option>
                <option value="unresolved">Unresolved Only</option>
                <option value="resolved">Resolved Only</option>
              </select>
            </div>
          </div>

          {selectedIds.length > 0 && <div className="px-4 py-3 border-b flex items-center gap-3 text-xs"><span>{selectedIds.length} selected</span><button onClick={() => {selectedIds.forEach(resolveError); setSelectedIds([]);}} className="cluster-button">Resolve selected</button><button onClick={() => setSelectedIds([])} className="text-slate-500">Clear selection</button></div>}

          {/* Table matching Screenshot 6 */}
          <div className="overflow-x-auto min-h-[350px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#fafbfc] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      aria-label="Select all visible errors"
                      checked={paginatedData.length > 0 && paginatedData.every(item => selectedIds.includes(item.id))}
                      onChange={event => setSelectedIds(event.target.checked ? paginatedData.map(item => item.id) : [])}
                      className="w-4 h-4 rounded border-slate-300 text-[#0083cb] cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-3 w-10 text-center">#</th>
                  <th className="py-3 px-4 min-w-[280px]">ERROR MESSAGE</th>
                  <th className="py-3 px-4 min-w-[220px]">TYPE</th>
                  <th className="py-3 px-4 min-w-[150px]">CONTROLLER</th>
                  <th className="py-3 px-4 min-w-[160px]">USER</th>
                  <th className="py-3 px-3 text-center">OCCURRE</th>
                  <th className="py-3 px-4 text-center">STATUS</th>
                  <th className="py-3 px-3 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9] text-xs">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      No matching error logs.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item) => {
                    const isResolved = item.status === 'resolved';

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-[#f8fafc] transition ${
                          isResolved ? 'bg-emerald-50/20' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            aria-label={`Select error ${item.id}`}
                            checked={selectedIds.includes(item.id)}
                            onChange={() => setSelectedIds(ids => ids.includes(item.id) ? ids.filter(id => id !== item.id) : [...ids,item.id])}
                            className="w-4 h-4 rounded border-slate-300 text-[#0083cb] cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">
                          {item.orderNumber}
                        </td>
                        <td className="py-3 px-4">
                          <div
                            onClick={() => setSelectedErrorDetail(item)}
                            className="flex items-center gap-1.5 cursor-pointer group"
                          >
                            <span
                              className={`font-semibold group-hover:text-[#0083cb] transition ${
                                item.errorMessage.match(/[\u0600-\u06FF]/)
                                  ? 'font-arabic text-right dir-rtl text-slate-800'
                                  : 'text-slate-800'
                              }`}
                            >
                              {item.errorMessage}
                            </span>
                            <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 group-hover:text-[#0083cb]" />
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-2.5 py-1 rounded-sm text-[11px] font-mono font-medium bg-[#e0f2fe] text-[#0284c7] border border-sky-100">
                            {item.type}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-800 text-[11px]">
                            {item.controller}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {item.action}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className={`font-semibold text-slate-800 text-[11px] ${item.user.match(/[\u0600-\u06FF]/) ? 'font-arabic' : ''}`}>
                            {item.user}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {item.userType}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                            {item.occurrences}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              isResolved
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isResolved ? 'Resolved' : 'Unresolved'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {isResolved ? (
                            <button
                              onClick={() => unresolveError(item.id)}
                              className="p-1 text-slate-400 hover:text-slate-600 rounded transition"
                              title="Re-open issue"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => resolveError(item.id)}
                              className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition"
                            >
                              Resolve
                            </button>
                          )}
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
              Showing {filteredErrors.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredErrors.length)} of {filteredErrors.length} entries
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

      {/* Error Detail Modal */}
      {selectedErrorDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden animate-scaleIn">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bug className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-800">
                  Exception Diagnostics #{selectedErrorDetail.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedErrorDetail(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-rose-50 border border-rose-200 rounded p-3 text-rose-900 font-medium font-arabic dir-rtl text-right">
                {selectedErrorDetail.errorDetails}
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Exception Class</span>
                  <span className="font-mono text-slate-800 text-[11px]">{selectedErrorDetail.type}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Controller / Action</span>
                  <span className="font-semibold text-slate-800 text-[11px]">
                    {selectedErrorDetail.controller}@{selectedErrorDetail.action}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Reported User</span>
                  <span className="text-slate-800">{selectedErrorDetail.user} ({selectedErrorDetail.userType})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Frequency</span>
                  <span className="font-bold text-purple-700">{selectedErrorDetail.occurrences} incidents</span>
                </div>
              </div>

              {selectedErrorDetail.stackTrace && (
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                    Simulated Stack Trace
                  </span>
                  <pre className="p-3 bg-slate-900 text-slate-100 rounded text-[10px] font-mono overflow-x-auto whitespace-pre-wrap">
                    {selectedErrorDetail.stackTrace}
                  </pre>
                </div>
              )}
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Status: <strong className="text-slate-800">{selectedErrorDetail.status}</strong>
              </span>
              <div className="flex items-center gap-2">
                {selectedErrorDetail.status === 'unresolved' ? (
                  <button
                    type="button"
                    onClick={() => {
                      resolveError(selectedErrorDetail.id);
                      setSelectedErrorDetail(null);
                    }}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-xs shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark as Resolved</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      unresolveError(selectedErrorDetail.id);
                      setSelectedErrorDetail(null);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded text-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reopen</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedErrorDetail(null)}
                  className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded text-xs hover:bg-slate-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
