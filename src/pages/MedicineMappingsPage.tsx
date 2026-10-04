import React, { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { useDemoData } from '../context/DemoDataContext';
import { Search, FileText, Check, Trash2, ArrowUpDown, ChevronDown } from 'lucide-react';

interface MedicineMappingsPageProps {
  onNavigateToLogs?: () => void;
}

export const MedicineMappingsPage: React.FC<MedicineMappingsPageProps> = ({
  onNavigateToLogs,
}) => {
  const {
    mappings,
    acceptMapping,
    acceptAllVisibleMappings,
    updateMappingSelection,
    toggleCosmetics,
    deleteSelectedMappings,
  } = useDemoData();

  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [supplierFilter, setSupplierFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Suppliers list for filter
  const suppliers = useMemo(() => {
    return Array.from(new Set(mappings.map((m) => m.supplier)));
  }, [mappings]);

  // Filtered & Paginated records
  const filteredMappings = useMemo(() => {
    return mappings.filter((item) => {
      const matchSearch =
        item.supplierMedicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.topSuggestedMedicine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.selectedMapping.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSupplier =
        supplierFilter === 'all' || item.supplier === supplierFilter;

      const matchStatus =
        statusFilter === 'all' || item.status === statusFilter;

      return matchSearch && matchSupplier && matchStatus;
    });
  }, [mappings, searchTerm, supplierFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredMappings.length / pageSize));
  useEffect(() => { setCurrentPage(page => Math.min(page, totalPages)); }, [totalPages]);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMappings.slice(start, start + pageSize);
  }, [filteredMappings, currentPage, pageSize]);

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

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Delete ${selectedIds.length} selected mapping item(s)?`)) {
      deleteSelectedMappings(selectedIds);
      setSelectedIds([]);
    }
  };

  const pendingVisibleCount = paginatedData.filter((m) => m.status === 'pending').length;

  return (
    <div className="w-full pb-16">
      <PageHeader
        title="Medicine Mappings"
        breadcrumbs={['Dashboard', 'Medicine Mappings']}
        actionSlot={
          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200 rounded hover:bg-rose-100 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected ({selectedIds.length})</span>
              </button>
            )}
            {onNavigateToLogs && (
              <button
                onClick={onNavigateToLogs}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded transition"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>View Logs</span>
              </button>
            )}
          </div>
        }
      />

      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 space-y-4">
        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] overflow-hidden">
          {/* Card Top Toolbar */}
          <div className="p-4 border-b border-[#e2e8f0] flex flex-wrap items-center justify-between gap-3 bg-white">
            <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
              {/* Search Input */}
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
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f8fafc] border border-slate-200 rounded text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0083cb] focus:border-[#0083cb]"
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

              {/* Supplier Filter */}
              <select
                value={supplierFilter}
                onChange={(e) => {
                  setSupplierFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 bg-[#f8fafc] border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0083cb]"
              >
                <option value="all">All Suppliers</option>
                {suppliers.map((sup) => (
                  <option key={sup} value={sup}>
                    {sup}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 bg-[#f8fafc] border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0083cb]"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
              </select>
            </div>

            {/* Right action: Accept All Visible Mappings */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => acceptAllVisibleMappings(paginatedData.map(item => item.id))}
                className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-white bg-[#0066cc] hover:bg-[#0055b3] rounded shadow-sm transition active:scale-[0.98]"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Accept All Visible Mappings</span>
                {pendingVisibleCount > 0 && (
                  <span className="bg-white/20 px-1.5 py-0.2 rounded-full text-[10px]">
                    {pendingVisibleCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#fafbfc] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-3 w-10 text-center">#</th>
                  <th className="py-3 px-4">SUPPLIER</th>
                  <th className="py-3 px-4">SUPPLIER MEDICINE NAME</th>
                  <th className="py-3 px-3 text-center">QUANTITY</th>
                  <th className="py-3 px-3 text-center">COSMETICS</th>
                  <th className="py-3 px-4">TOP SUGGESTED MEDICINE</th>
                  <th className="py-3 px-4 min-w-[240px]">MAPPING DROPDOWN</th>
                  <th className="py-3 px-3 text-center">ACTION</th>
                  <th className="py-3 px-3 text-center">
                    <span className="block text-[10px] leading-tight">SELECT FOR<br />DELETION</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9] text-xs">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      No matching medicine mappings found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    const isDropdownOpen = openDropdownId === item.id;
                    const isAccepted = item.status === 'accepted';

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-[#f8fafc] transition ${
                          isAccepted ? 'bg-emerald-50/30' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-center text-slate-500 font-medium font-mono text-[11px]">
                          {item.orderNumber}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800 text-[11px] tracking-tight">
                          {item.supplier}
                        </td>
                        <td className="py-3 px-4 font-arabic text-right dir-rtl font-medium text-[#0066cc] cursor-pointer hover:underline">
                          <span dir="rtl">{item.supplierMedicineName}</span>
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-slate-700">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {/* Cosmetics toggle pill */}
                          <button
                            type="button"
                            onClick={() => toggleCosmetics(item.id)}
                            className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 mx-auto ${
                              item.isCosmetics ? 'bg-[#0083cb]' : 'bg-slate-200'
                            }`}
                          >
                            <div
                              className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${
                                item.isCosmetics ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">
                          <div className="flex items-center gap-1.5">
                            <span className={item.topSuggestedMedicine.match(/[\u0600-\u06FF]/) ? 'font-arabic' : ''}>
                              {item.topSuggestedMedicine}
                            </span>
                            <span
                              className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-sky-50 text-sky-700 border border-sky-100"
                              title={`Matcher Confidence: ${(item.confidenceScore * 100).toFixed(0)}%`}
                            >
                              {(item.confidenceScore * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 relative">
                          {/* Mapping Dropdown Selector */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenDropdownId(isDropdownOpen ? null : item.id)
                              }
                              className="w-full flex items-center justify-between gap-2 px-2.5 py-1 text-xs bg-white border border-slate-200 hover:border-slate-300 rounded text-slate-700 text-left font-medium shadow-2xs"
                            >
                              <span className="truncate max-w-[200px]">
                                {item.selectedMapping}
                              </span>
                              <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            </button>

                            {/* Dropdown Menu matching screenshot */}
                            {isDropdownOpen && (
                              <>
                                <div
                                  className="fixed inset-0 z-40"
                                  onClick={() => setOpenDropdownId(null)}
                                />
                                <div className="absolute left-0 top-full mt-1 w-80 bg-white border border-slate-200 rounded-md shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 max-h-64 overflow-y-auto">
                                  <div className="p-1.5 bg-[#0066cc] text-white text-[11px] font-semibold px-3">
                                    Plausible Matches ({item.availableOptions.length})
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateMappingSelection(item.id, item.topSuggestedMedicine);
                                      setOpenDropdownId(null);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs font-semibold text-[#0066cc] bg-blue-50/50 hover:bg-blue-100/60 flex items-center justify-between"
                                  >
                                    <span>Use Default Mapping</span>
                                    <span className="text-[10px] text-blue-500 font-mono">
                                      ({item.topSuggestedPrice} EGP)
                                    </span>
                                  </button>
                                  {item.availableOptions.map((opt, i) => (
                                    <button
                                      key={i}
                                      type="button"
                                      onClick={() => {
                                        updateMappingSelection(item.id, opt.name);
                                        setOpenDropdownId(null);
                                      }}
                                      className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between transition ${
                                        item.selectedMapping === opt.name
                                          ? 'bg-sky-50/60 font-semibold text-sky-800'
                                          : 'text-slate-700'
                                      }`}
                                    >
                                      <span className="truncate pr-2">{opt.name}</span>
                                      <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">
                                        ({opt.price} EGP)
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {isAccepted ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-700">
                              <Check className="w-3 h-3" /> Accepted
                            </span>
                          ) : (
                            <button
                              onClick={() => acceptMapping(item.id)}
                              className="px-2.5 py-1 text-xs font-semibold text-[#0066cc] bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition"
                            >
                              Accept
                            </button>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(item.id)}
                            className="w-4 h-4 rounded border-slate-300 text-[#0083cb] focus:ring-[#0083cb] cursor-pointer"
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination & Footer */}
          <div className="p-3 border-t border-[#e2e8f0] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 bg-[#fafbfc]">
            <div>
              Showing {filteredMappings.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredMappings.length)} of {filteredMappings.length} entries
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
    </div>
  );
};
