import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { DATA_MAP_RECORDS, DISTRICT_DEMAND_DATA } from '../data/mockData';
import {
  Database,
  ShieldCheck,
  Calendar,
  Lock,
  Search,
  MapPin,
  TrendingUp,
  BarChart3,
  CheckCircle,
  XCircle,
  Info,
} from 'lucide-react';

export const DataUsageRetentionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'datamap' | 'district_demand' | 'schedule'>('datamap');
  const [searchTerm, setSearchTerm] = useState('');
  const [trainingFilter, setTrainingFilter] = useState<'all' | 'used' | 'not_used'>('all');

  const filteredDataMap = DATA_MAP_RECORDS.filter((rec) => {
    const matchSearch =
      rec.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.storageLocation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchTraining =
      trainingFilter === 'all' ||
      (trainingFilter === 'used' && rec.usedForAiTraining) ||
      (trainingFilter === 'not_used' && !rec.usedForAiTraining);

    return matchSearch && matchTraining;
  });

  return (
    <div className="w-full pb-16">
      <PageHeader
        title="Data Usage, Minimization & Retention"
        breadcrumbs={['Dashboard', 'Governance', 'Data Map & Retention Schedule']}
      />

      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 space-y-6">
        {/* Banner with Q20 Compliance context */}
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 text-xs text-sky-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                Data Minimization, Strict Anonymization & Aggregated Analytics (Q20 RAI Playbook)
              </h3>
              <p className="text-slate-600 mt-0.5">
                Illustrative policy v1.2 specifies that patient voice transcripts and prescriptions are never used for AI model training without explicit consent, and district market demand contains zero identifiable pharmacy transactions.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-[#0083cb] text-white text-[11px] font-bold shadow-xs whitespace-nowrap">
              Sample Policy v1.2 (Oct 2026)
            </span>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('datamap')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'datamap'
                ? 'bg-[#0083cb] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Interactive Data Map ({DATA_MAP_RECORDS.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('district_demand')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'district_demand'
                ? 'bg-[#0083cb] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>District-Level Demand View (Zero Pharmacy PII)</span>
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'schedule'
                ? 'bg-[#0083cb] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Formal Retention Schedule v1.2</span>
          </button>
        </div>

        {/* Tab 1: Interactive Data Map */}
        {activeTab === 'datamap' && (
          <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] overflow-hidden space-y-4 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
              <div className="relative w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="search category, purpose or storage..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f8fafc] border border-slate-200 rounded text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0083cb]"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-slate-600">AI Training Usage:</span>
                <select
                  value={trainingFilter}
                  onChange={(e) => setTrainingFilter(e.target.value as any)}
                  className="px-2 py-1 bg-[#f8fafc] border border-slate-200 rounded text-xs text-slate-700"
                >
                  <option value="all">All Fields</option>
                  <option value="used">Used for AI Training</option>
                  <option value="not_used">Excluded from AI Training</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto min-h-[350px]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#e2e8f0] bg-[#fafbfc] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">CATEGORY & FIELD NAME</th>
                    <th className="py-3 px-4 min-w-[240px]">PURPOSE & JUSTIFICATION</th>
                    <th className="py-3 px-4">AUTHORIZED ACCESS ROLES</th>
                    <th className="py-3 px-4">STORAGE LOCATION</th>
                    <th className="py-3 px-4">RETENTION PERIOD</th>
                    <th className="py-3 px-4 text-center">AI TRAINING?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {filteredDataMap.map((rec) => (
                    <tr key={rec.id} className="hover:bg-[#f8fafc] transition">
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {rec.category}
                        </span>
                        <span className="font-bold text-slate-900 text-xs mt-0.5 block">
                          {rec.fieldName}
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-1">
                          Legal: {rec.legalBasis}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 leading-relaxed">
                        <p>{rec.purpose}</p>
                        <div className="mt-1 text-[11px] text-emerald-700 bg-emerald-50/60 px-2 py-1 rounded border border-emerald-100 font-medium">
                          <strong>Anonymization:</strong> {rec.anonymizationTechnique}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {rec.accessRoles.map((role, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Lock className="w-3 h-3 text-slate-400" />
                          <span>{rec.storageLocation}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {rec.retentionPeriod}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {rec.usedForAiTraining ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <CheckCircle className="w-3 h-3" /> Yes (B2B SKU)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <XCircle className="w-3 h-3" /> Excluded (Zero AI Train)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: District Demand (Zero Pharmacy PII) */}
        {activeTab === 'district_demand' && (
          <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] p-6 space-y-6">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>Strict Anonymization Gate:</strong> This demand view aggregates consumption by Egyptian geographic district and therapeutic category. Individual pharmacy names, commercial revenues, and patient identities are strictly stripped from all outputs.
                </span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-200/60 rounded text-[10px] font-bold uppercase">
                Privacy Guaranteed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DISTRICT_DEMAND_DATA.map((dist, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">
                        {dist.district}
                      </h4>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {dist.governorate} Governorate
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+{dist.trendPercentage}%</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Top Demanded Medicine in District
                    </span>
                    <span className="font-bold text-[#0066cc] text-xs block">
                      {dist.topMedicine}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Category: {dist.category}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Monthly Packs</span>
                      <span className="font-bold text-slate-800 font-mono text-sm">
                        {dist.monthlyPacksDemanded.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Sample Group Size</span>
                      <span className="font-semibold text-slate-700">
                        {dist.participatingPharmaciesCount} Pharmacies (Aggregated)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Formal Retention Schedule */}
        {activeTab === 'schedule' && (
          <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] p-6 space-y-5 text-xs text-slate-700">
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-800 text-base">
                  Cluster Enterprise Data Retention Schedule
                </h3>
                <p className="text-slate-500 mt-0.5">
                  Adopted by the AI & Privacy Governance Committee on October 1, 2026.
                </p>
              </div>
              <div className="text-right">
                <span className="block font-bold text-slate-800">Policy Owner: Counselor Ahmed Farouk</span>
                <span className="text-[11px] text-slate-400 font-mono">Next Audit: April 2027</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Automated Purge Protocol
                </h4>
                <p className="leading-relaxed">
                  Audio recordings from voice ordering sessions are automatically scheduled for hard-purge 30 days post order fulfillment. Encrypted cryptographic deletion tokens are written to the audit log to prove compliant data disposal to syndicate auditors.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Model Retraining Sanitization
                </h4>
                <p className="leading-relaxed">
                  Only anonymized drug title synonyms and catalog nomenclature corrections from verified pharmacists are permitted into the fine-tuning pipeline for Arabic Pharma-Match (Jina-v3). Any personal identifiers, telephone numbers, or commercial prices are scrubbed by an automated regex pipeline before embedding generation.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
