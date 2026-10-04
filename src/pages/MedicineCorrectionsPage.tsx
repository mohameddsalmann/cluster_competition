import React, { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { useDemoData } from '../context/DemoDataContext';
import { Search, Filter, Trash2, Unlink, Pencil, X, Check } from 'lucide-react';
import { MedicineCorrection } from '../types';

export const MedicineCorrectionsPage: React.FC = () => {
  const {
    corrections,
    updateCorrection,
    bulkRemoveCorrections,
    bulkUnlinkCorrections,
  } = useDemoData();

  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Edit dialog state
  const [editingItem, setEditingItem] = useState<MedicineCorrection | null>(null);
  const [newMappingValue, setNewMappingValue] = useState('');

  // Suppliers list
  const suppliers = useMemo(() => {
    return Array.from(new Set(corrections.map((c) => c.supplier)));
  }, [corrections]);

  // Filtered & Paginated records
  const filteredCorrections = useMemo(() => {
    return corrections.filter((item) => {
      const matchSearch =
        item.supplierMedicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.currentMapping.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSupplier =
        supplierFilter === 'all' || item.supplier === supplierFilter;

      const matchStatus =
        statusFilter === 'all' || item.status === statusFilter;

      return matchSearch && matchSupplier && matchStatus;
    });
  }, [corrections, searchTerm, supplierFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredCorrections.length / pageSize));
  useEffect(() => { setCurrentPage(page => Math.min(page, totalPages)); }, [totalPages]);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCorrections.slice(start, start + pageSize);
  }, [filteredCorrections, currentPage, pageSize]);

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

  const handleBulkRemove = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Are you sure you want to remove ${selectedIds.length} item(s)?`)) {
      bulkRemoveCorrections(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleBulkUnlink = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Unlink ${selectedIds.length} mapping(s)? They will return to unmapped status.`)) {
      bulkUnlinkCorrections(selectedIds);
      setSelectedIds([]);
    }
  };

  const openEditModal = (item: MedicineCorrection) => {
    setEditingItem(item);
    setNewMappingValue(item.currentMapping);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !newMappingValue.trim()) return;
    updateCorrection(editingItem.id, newMappingValue.trim());
    setEditingItem(null);
  };

  const allVisibleSelected =
    paginatedData.length > 0 &&
    paginatedData.every((d) => selectedIds.includes(d.id));

  return (
    <div className="w-full pb-16">
      <PageHeader
        title="Medicine Mapping Corrections"
        breadcrumbs={['Dashboard', 'Medicine Mapping Corrections']}
      />

      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 space-y-4">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] overflow-hidden">
          {/* Card Toolbar exactly matching Screenshot 3 */}
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

              {/* Page size dropdown */}
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

              {/* Advanced Filters Button */}
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

            {/* Action Buttons matching Screenshot 3: Bulk Remove (Red) & Bulk Unlink (Purple) */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkRemove}
                disabled={selectedIds.length === 0}
                className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#e11d48] hover:bg-[#be123c] disabled:opacity-50 disabled:cursor-not-allowed rounded shadow-xs transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Bulk Remove Checked</span>
                {selectedIds.length > 0 && (
                  <span className="bg-white/20 px-1.5 rounded-full text-[10px]">
                    {selectedIds.length}
                  </span>
                )}
              </button>

              <button
                onClick={handleBulkUnlink}
                disabled={selectedIds.length === 0}
                className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 disabled:cursor-not-allowed rounded shadow-xs transition"
              >
                <Unlink className="w-3.5 h-3.5" />
                <span>Bulk Unlink Checked</span>
                {selectedIds.length > 0 && (
                  <span className="bg-white/20 px-1.5 rounded-full text-[10px]">
                    {selectedIds.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Advanced Filter Collapse Bar */}
          {showAdvancedFilters && (
            <div className="p-3 bg-[#f8fafc] border-b border-slate-200 flex flex-wrap gap-4 text-xs animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600">Supplier:</span>
                <select
                  value={supplierFilter}
                  onChange={(e) => setSupplierFilter(e.target.value)}
                  className="px-2 py-1 bg-white border border-slate-200 rounded"
                >
                  <option value="all">All Suppliers</option>
                  {suppliers.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2 py-1 bg-white border border-slate-200 rounded"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="unlinked">Unlinked</option>
                </select>
              </div>
            </div>
          )}

          {/* Table */}
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
                  <th className="py-3 px-4">SUPPLIER</th>
                  <th className="py-3 px-4 min-w-[280px]">SUPPLIER MEDICINE NAME</th>
                  <th className="py-3 px-4 min-w-[280px]">CURRENT MAPPING</th>
                  <th className="py-3 px-3 text-center">EDIT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9] text-xs">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No correction records found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    const isUnlinked = item.status === 'unlinked';

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-[#f8fafc] transition ${
                          isSelected ? 'bg-blue-50/40' : ''
                        } ${isUnlinked ? 'opacity-60 bg-amber-50/20' : ''}`}
                      >
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(item.id)}
                            className="w-4 h-4 rounded border-slate-300 text-[#0083cb] focus:ring-[#0083cb] cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3 text-center text-slate-500 font-mono text-[11px]">
                          {item.orderNumber}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800 text-[11px]">
                          {item.supplier}
                        </td>
                        <td className="py-3 px-4 font-arabic text-right dir-rtl font-medium text-slate-800">
                          <span dir="rtl">{item.supplierMedicineName}</span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900">
                          <span
                            className={
                              isUnlinked
                                ? 'text-amber-600 font-semibold italic'
                                : item.currentMapping.match(/[\u0600-\u06FF]/)
                                ? 'font-arabic'
                                : ''
                            }
                          >
                            {item.currentMapping}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => openEditModal(item)}
                            className="p-1.5 rounded-full text-[#0083cb] hover:bg-sky-50 transition"
                            title="Edit this mapping"
                          >
                            <Pencil className="w-3.5 h-3.5" />
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
              Showing {filteredCorrections.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredCorrections.length)} of {filteredCorrections.length} entries
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

      {/* Edit Mapping Dialog */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-scaleIn">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">
                Edit Medicine Mapping #{editingItem.orderNumber}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                  Supplier
                </label>
                <div className="p-2 bg-slate-50 rounded border border-slate-200 text-xs font-bold text-slate-800">
                  {editingItem.supplier}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                  Supplier Raw Title
                </label>
                <div className="p-2 bg-slate-50 rounded border border-slate-200 text-xs font-arabic text-slate-800 dir-rtl text-right">
                  {editingItem.supplierMedicineName}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Master Catalog Medicine
                </label>
                <input
                  type="text"
                  required
                  value={newMappingValue}
                  onChange={(e) => setNewMappingValue(e.target.value)}
                  placeholder="e.g. AZHA C SERUM (295) or Adwistadine 5mg..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0083cb]"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Editing this record creates a trace entry in Medicine Mapping Logs with Dr. Heba Admin attribution.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#0066cc] hover:bg-[#0055b3] rounded shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
