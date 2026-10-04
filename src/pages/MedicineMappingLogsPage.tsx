import React, { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { useDemoData } from '../context/DemoDataContext';
import {
  Search,
  Store,
  ArrowRightLeft,
  UserCog,
  Filter,
  Eye,
  X,
  FileCheck,
  ChevronDown,
} from 'lucide-react';
import { exportCsv } from '../utils/exportCsv';
import { MedicineMappingLog } from '../types';

export const MedicineMappingLogsPage: React.FC = () => {
  const { mappingLogs } = useDemoData();

  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [changeTypeFilter, setChangeTypeFilter] = useState('all');
  const [selectedLogDetail, setSelectedLogDetail] = useState<MedicineMappingLog | null>(null);

  const suppliers = useMemo(() => {
    return Array.from(new Set(mappingLogs.map((l) => l.supplier)));
  }, [mappingLogs]);

  const filteredLogs = useMemo(() => {
    return mappingLogs.filter((log) => {
      const matchSearch =
        log.supplierMedicine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.oldMedicine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.newMedicine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.changedBy.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSupplier =
        supplierFilter === 'all' || log.supplier === supplierFilter;

      const matchType =
        changeTypeFilter === 'all' || log.changeType === changeTypeFilter;

      return matchSearch && matchSupplier && matchType;
    });
  }, [mappingLogs, searchTerm, supplierFilter, changeTypeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  useEffect(() => { setCurrentPage(page => Math.min(page, totalPages)); }, [totalPages]);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedData.map((d) => d.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const allVisibleSelected =
    paginatedData.length > 0 &&
    paginatedData.every((d) => selectedIds.includes(d.id));

  return (
    <div className="w-full pb-16">
      <PageHeader
        title="Medicine Mapping Logs"
        breadcrumbs={['Dashboard', 'Medicine Mapping Logs']}
      />

      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 space-y-4">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] overflow-hidden">
          {/* Card Toolbar matching Screenshot 4 */}
          <div className="p-4 border-b border-[#e2e8f0] flex flex-wrap items-center justify-between gap-3 bg-white">
            <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
              {/* Search input */}
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="search ..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f8fafc] border border-slate-200 rounded text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0083cb]"
                />
              </div>

              {/* Page size */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
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
                  <option value={50}>50</option>
                </select>
              </div>

              {/* Export selected audit records */}
              <div className="relative">
                <button
                  type="button"
                  disabled={selectedIds.length === 0}
                  onClick={() => exportCsv('cluster-mapping-history.csv', mappingLogs.filter(log => selectedIds.includes(log.id)).map(log => ({...log})))}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f8fafc] border border-slate-200 rounded text-xs text-slate-700 hover:bg-slate-100"
                >
                  <span>Export selected ({selectedIds.length})</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              {/* Filter by Supplier */}
              <select
                value={supplierFilter}
                onChange={(e) => {
                  setSupplierFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 bg-[#f8fafc] border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0083cb]"
              >
                <option value="all">All Suppliers</option>
                {suppliers.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              {/* Filter by Type */}
              <select
                value={changeTypeFilter}
                onChange={(e) => {
                  setChangeTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 bg-[#f8fafc] border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0083cb]"
              >
                <option value="all">All Change Types</option>
                <option value="Remapped">Remapped</option>
                <option value="Auto-matched">Auto-matched</option>
                <option value="Unlinked">Unlinked</option>
              </select>
            </div>
          </div>

          {/* Table matching Screenshot 4 */}
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#fafbfc] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 text-[#0083cb] focus:ring-[#0083cb] cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-3 w-10 text-center">#</th>
                  <th className="py-3 px-4 min-w-[200px]">SUPPLIER MEDICINE</th>
                  <th className="py-3 px-4 min-w-[140px]">SUPPLIER</th>
                  <th className="py-3 px-4 min-w-[200px]">OLD MEDICINE</th>
                  <th className="py-3 px-4 min-w-[220px]">NEW MEDICINE</th>
                  <th className="py-3 px-4 min-w-[210px]">CHANGE DESCRIPTION</th>
                  <th className="py-3 px-4 min-w-[120px]">CHANGED BY</th>
                  <th className="py-3 px-4 min-w-[130px]">CHANGED AT</th>
                  <th className="py-3 px-3 text-center">DETAIL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9] text-xs">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400">
                      No mapping log entries found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item) => {
                    const isSelected = selectedIds.includes(item.id);

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-[#f8fafc] transition ${
                          isSelected ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(item.id)}
                            className="w-4 h-4 rounded border-slate-300 text-[#0083cb] focus:ring-[#0083cb] cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">
                          {item.orderNumber}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-arabic font-semibold text-slate-800 dir-rtl text-right">
                            <span dir="rtl">{item.supplierMedicine}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {item.supplierMedicineCode}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px]">
                            <Store className="w-3.5 h-3.5 text-[#0083cb] flex-shrink-0" />
                            <span>{item.supplier}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-700">
                            {item.oldMedicine}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {item.oldMedicineCode}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-900 font-semibold">
                            {item.newMedicine}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {item.newMedicineCode}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-start gap-1.5">
                            <div className="w-5 h-5 rounded bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <ArrowRightLeft className="w-3 h-3 text-amber-600" />
                            </div>
                            <div>
                              <span className="font-bold text-amber-600 text-[11px] block">
                                {item.changeType}
                              </span>
                              <span className="text-[11px] text-slate-500 block leading-tight">
                                {item.changeDescription}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                              <UserCog className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 text-[11px]">
                                {item.changedBy}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {item.changedByRole}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-mono text-[11px] whitespace-nowrap">
                          {item.changedAt}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => setSelectedLogDetail(item)}
                            className="p-1.5 text-slate-400 hover:text-[#0083cb] rounded hover:bg-sky-50 transition"
                            title="View log audit details"
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

      {/* Log Detail Audit Modal */}
      {selectedLogDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-scaleIn">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#0083cb]" />
                <h3 className="text-sm font-bold text-slate-800">
                  Mapping Audit Trail #{selectedLogDetail.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLogDetail(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Supplier</span>
                  <span className="font-bold text-slate-800 text-xs">{selectedLogDetail.supplier}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Timestamp</span>
                  <span className="font-mono text-slate-700 text-xs">{selectedLogDetail.changedAt}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Authorized By</span>
                  <span className="font-semibold text-purple-700 text-xs">
                    {selectedLogDetail.changedBy} ({selectedLogDetail.changedByRole})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Action Type</span>
                  <span className="font-bold text-amber-600 text-xs">{selectedLogDetail.changeType}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                  Supplier Raw Title
                </span>
                <div className="p-2.5 bg-slate-100/70 rounded text-right font-arabic font-medium text-slate-800 dir-rtl">
                  {selectedLogDetail.supplierMedicine}
                </div>
              </div>

              <div className="border border-slate-200 rounded p-3 space-y-2">
                <div>
                  <span className="text-rose-500 font-bold text-[10px] uppercase block">Previous System Mapping</span>
                  <p className="text-slate-600 line-through">{selectedLogDetail.oldMedicine}</p>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-emerald-600 font-bold text-[10px] uppercase block">New Confirmed Mapping</span>
                  <p className="text-slate-900 font-semibold">{selectedLogDetail.newMedicine}</p>
                </div>
              </div>

              {selectedLogDetail.reason && (
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                    Pharmacist Audit Rationale
                  </span>
                  <p className="p-2.5 bg-blue-50/50 border border-blue-100 rounded text-slate-700 italic">
                    "{selectedLogDetail.reason}"
                  </p>
                </div>
              )}
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLogDetail(null)}
                className="px-4 py-1.5 bg-[#0066cc] text-white font-semibold rounded text-xs hover:bg-[#0055b3]"
              >
                Close Audit Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
