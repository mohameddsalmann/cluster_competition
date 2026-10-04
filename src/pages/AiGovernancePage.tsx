import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { useDemoData } from '../context/DemoDataContext';
import { GOVERNANCE_MEMBERS, GOVERNANCE_REVIEWS } from '../data/mockData';
import {
  Scale,
  ShieldAlert,
  PauseCircle,
  PlayCircle,
  Calendar,
  FileText,
  UserCheck,
  CheckCircle2,
  Info,
} from 'lucide-react';

export const AiGovernancePage: React.FC = () => {
  const { isReleasePaused, toggleReleasePause } = useDemoData();

  return (
    <div className="w-full pb-16">
      <PageHeader
        title="AI Governance, Accountability & RACI"
        breadcrumbs={['Dashboard', 'Governance', 'Accountability Structures']}
        actionSlot={
          <button
            type="button"
            onClick={toggleReleasePause}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-bold shadow-xs transition ${
              isReleasePaused
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-rose-600 hover:bg-rose-700 text-white'
            }`}
          >
            {isReleasePaused ? (
              <>
                <PlayCircle className="w-4 h-4" />
                <span>Resume AI Release Pipeline</span>
              </>
            ) : (
              <>
                <PauseCircle className="w-4 h-4" />
                <span>Simulate Emergency Release Pause</span>
              </>
            )}
          </button>
        }
      />

      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 space-y-6">
        {/* Compliance Notice referencing Screenshot Q29 */}
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 text-xs text-sky-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-3">
            <Scale className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                Single Accountable Owner & Monthly AI Review Terms of Reference (Q29 RAI Playbook)
              </h3>
              <p className="text-slate-600 mt-0.5">
                Sample governance structure: accountable executive (<strong>Eng. Tarek Mansour - CEO</strong>). Pharmacist testing lead (<strong>Dr. Heba Admin</strong>) exercises direct pause authority.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-[#0083cb] text-white text-[11px] font-bold shadow-xs whitespace-nowrap">
            Sample Terms of Reference (Oct 2026)
          </span>
        </div>

        {/* Release Pipeline Pause Status Alert Banner */}
        {isReleasePaused && (
          <div className="bg-rose-50 border-l-4 border-rose-600 p-4 rounded-r-lg shadow-sm flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-rose-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-rose-900 text-sm">
                  AI Model Deployment Pipeline is Currently PAUSED
                </h4>
                <p className="text-xs text-rose-700 mt-0.5">
                  Emergency pause triggered under Committee Authority. Automated catalog reconciliation is held in manual validation queue until next monthly review.
                </p>
              </div>
            </div>
            <button
              onClick={toggleReleasePause}
              className="px-3 py-1 bg-white border border-rose-300 text-rose-700 font-bold text-xs rounded hover:bg-rose-100 transition shadow-2xs"
            >
              Resume Deployment
            </button>
          </div>
        )}

        {/* Governance Members Cards */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#0083cb]" />
            Named Committee Members & Defined Responsibilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {GOVERNANCE_MEMBERS.map((member, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full ${member.avatarColor} text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0`}>
                      {member.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 text-xs truncate">
                        {member.name}
                      </h4>
                      <p className="text-[11px] text-[#0083cb] font-semibold truncate">
                        {member.title}
                      </p>
                    </div>
                  </div>

                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 mb-2">
                    {member.roleTitle}
                  </span>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Release Pause Right:</span>
                  <span className={`font-bold ${member.pauseAuthority ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {member.pauseAuthority ? 'Authorized' : 'Advisory'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RACI Responsibility Matrix */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] overflow-hidden">
          <div className="p-4 border-b border-[#e2e8f0] bg-white">
            <h3 className="font-bold text-slate-800 text-sm">
              Comprehensive RACI Responsibility Matrix (Governance Map)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              R = Responsible (Doer), A = Accountable (Single final decision maker), C = Consulted (Two-way input), I = Informed (One-way update).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#fafbfc] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">GOVERNANCE DOMAIN / DECISION</th>
                  {GOVERNANCE_MEMBERS.map((m, idx) => (
                    <th key={idx} className="py-3 px-3 text-center">
                      <span className="block font-bold text-slate-800">{m.name.split(' ')[0]}</span>
                      <span className="block text-[10px] text-slate-400 font-normal">{m.title.split('(')[0]}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                <tr className="hover:bg-[#f8fafc]">
                  <td className="py-3 px-4 font-bold text-slate-800">
                    AI Model Retraining & Production Release
                  </td>
                  {GOVERNANCE_MEMBERS.map((m, idx) => {
                    const status = m.raciStatus.aiModelRelease;
                    return (
                      <td key={idx} className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          status === 'Accountable'
                            ? 'bg-rose-100 text-rose-800 font-extrabold'
                            : status === 'Responsible'
                            ? 'bg-blue-100 text-blue-800'
                            : status === 'Consulted'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {status}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                <tr className="hover:bg-[#f8fafc]">
                  <td className="py-3 px-4 font-bold text-slate-800">
                    Fairness, Accent & Dialect Bias Auditing
                  </td>
                  {GOVERNANCE_MEMBERS.map((m, idx) => {
                    const status = m.raciStatus.fairnessAudit;
                    return (
                      <td key={idx} className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          status === 'Accountable'
                            ? 'bg-rose-100 text-rose-800'
                            : status === 'Responsible'
                            ? 'bg-blue-100 text-blue-800'
                            : status === 'Consulted'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {status}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                <tr className="hover:bg-[#f8fafc]">
                  <td className="py-3 px-4 font-bold text-slate-800">
                    Data Retention & Cryptographic Purge Schedule
                  </td>
                  {GOVERNANCE_MEMBERS.map((m, idx) => {
                    const status = m.raciStatus.dataRetentionPolicy;
                    return (
                      <td key={idx} className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          status === 'Accountable'
                            ? 'bg-rose-100 text-rose-800'
                            : status === 'Responsible'
                            ? 'bg-blue-100 text-blue-800'
                            : status === 'Consulted'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {status}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                <tr className="hover:bg-[#f8fafc]">
                  <td className="py-3 px-4 font-bold text-slate-800">
                    Emergency Incident Response & Release Pause
                  </td>
                  {GOVERNANCE_MEMBERS.map((m, idx) => {
                    const status = m.raciStatus.incidentResponse;
                    return (
                      <td key={idx} className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          status === 'Accountable'
                            ? 'bg-rose-100 text-rose-800'
                            : status === 'Responsible'
                            ? 'bg-blue-100 text-blue-800'
                            : status === 'Consulted'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {status}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Review Records */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] p-6 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#0083cb]" />
            Monthly AI Review Committee Minutes & Audit Logs
          </h3>

          <div className="space-y-4">
            {GOVERNANCE_REVIEWS.map((rev) => (
              <div key={rev.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50/50 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-xs">{rev.period}</span>
                    <span className="font-mono text-[10px] text-slate-400">({rev.reviewDate})</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    rev.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {rev.status}
                  </span>
                </div>

                <div className="text-xs text-slate-700 space-y-1">
                  <p><strong>Chairperson:</strong> {rev.chairperson}</p>
                  <p><strong>Attendees:</strong> {rev.attendees.join(', ')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-2.5 bg-emerald-50 rounded border border-emerald-100 text-emerald-900">
                    <span className="font-bold block text-[11px] mb-1">Key Decisions Approved:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                      {rev.decisions.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-2.5 bg-amber-50 rounded border border-amber-100 text-amber-900">
                    <span className="font-bold block text-[11px] mb-1">Concerns & Action Gates:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                      {rev.concernsRaised.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
