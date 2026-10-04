import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { AI_COMPONENTS_DATA } from '../data/mockData';
import {
  Cpu,
  Brain,
  ShieldAlert,
  History,
  CheckCircle2,
  Info,
  Layers,
  Mic,
  Camera,
  LineChart,
} from 'lucide-react';
import { AIComponentCard } from '../types';

export const AiModelsSystemCardsPage: React.FC = () => {
  const [selectedCardId, setSelectedCardId] = useState<string>(AI_COMPONENTS_DATA[0].id);

  const selectedCard = AI_COMPONENTS_DATA.find((c) => c.id === selectedCardId) || AI_COMPONENTS_DATA[0];

  const getRoleIcon = (role: AIComponentCard['role']) => {
    switch (role) {
      case 'medicine_matching':
        return Layers;
      case 'speech_recognition':
        return Mic;
      case 'image_extraction':
        return Camera;
      case 'recommendation':
        return LineChart;
      default:
        return Cpu;
    }
  };

  return (
    <div className="w-full pb-16">
      <PageHeader
        title="AI Models & Clara System Cards"
        breadcrumbs={['Dashboard', 'Governance', 'AI Model Registry & Cards']}
      />

      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 space-y-6">
        {/* Banner Explaining Competition Q6 Compliance & Model Card Authority */}
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 text-xs text-sky-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                Clara System Architecture & Transparent Model Registry (Q6 RAI Playbook)
              </h3>
              <p className="text-slate-600 mt-0.5">
                Full documentation covering purpose, intended users, inputs/outputs, human oversight gates, fairness evaluations, and change history. The Medicine Matching model faithfully reflects the documented <code className="font-mono bg-sky-100 px-1 py-0.5 rounded text-sky-800">Model_Card.md.txt</code>.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-[#0083cb] text-white text-[11px] font-bold whitespace-nowrap shadow-xs">
            System card · Demo v1.0
          </span>
        </div>

        <section className="bg-white border border-slate-200 rounded-lg p-5">
          <h2 className="font-semibold text-slate-800 mb-3">Clara system card</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs leading-relaxed">
            <div><strong>Purpose and users</strong><p className="text-slate-500 mt-1">Help pharmacists and catalogue administrators translate voice, image and supplier inputs into reviewed product matches and procurement orders.</p></div>
            <div><strong>Inputs and outputs</strong><p className="text-slate-500 mt-1">Arabic/English voice transcripts, supplier images and catalogue names enter extraction and matching. Outputs are candidate products and draft order lines.</p></div>
            <div><strong>Human oversight</strong><p className="text-slate-500 mt-1">A pharmacist accepts, modifies or rejects each suggestion. Reviews and mapping corrections are recorded. The demo governance owner can pause simulated releases.</p></div>
            <div><strong>Limits and fairness</strong><p className="text-slate-500 mt-1">Noise, blurry images, dialect differences, shorthand, look-alike names and package sizes can produce incorrect candidates. No diagnosis, prescribing or automatic therapeutic substitution.</p></div>
            <div><strong>Components and evaluation</strong><p className="text-slate-500 mt-1">Speech recognition → image/text extraction → medicine matching → procurement suggestions. The supplied matching card reports triplet cosine accuracy; the other evaluations are illustrative.</p></div>
            <div><strong>Ownership and change control</strong><p className="text-slate-500 mt-1">Demo accountable owner: Eng. Tarek Mansour. Technical owner: AI lead. Demo version 1.0 introduces pharmacist review, audit history and a correction feedback workflow.</p></div>
          </div>
        </section>

        {/* Component Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {AI_COMPONENTS_DATA.map((comp) => {
            const Icon = getRoleIcon(comp.role);
            const isSelected = comp.id === selectedCardId;

            return (
              <button
                key={comp.id}
                type="button"
                onClick={() => setSelectedCardId(comp.id)}
                className={`p-4 rounded-lg border text-left transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-[#0083cb] shadow-md ring-2 ring-[#0083cb]/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#0083cb]" />
                )}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-sky-50 text-[#0083cb]' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        comp.status === 'current'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {comp.status.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-xs line-clamp-1">
                    {comp.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {comp.purpose}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-mono">{comp.version}</span>
                  {comp.isSampleDataOnly ? (
                    <span className="text-amber-600 font-medium">Demo metadata</span>
                  ) : (
                    <span className="text-emerald-600 font-bold">Model_Card.md.txt</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Card Deep Dive */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] overflow-hidden">
          {/* Card Header */}
          <div className="p-6 bg-gradient-to-r from-slate-900 to-[#0b2848] text-white flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[10px] uppercase font-bold tracking-wider">
                  Component Card
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  Provider: {selectedCard.provider}
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight mt-1 text-white">
                {selectedCard.name}
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                {selectedCard.purpose}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300">Developer:</span>
                <span className="text-xs font-bold text-cyan-300 bg-white/10 px-2.5 py-1 rounded">
                  {selectedCard.developer}
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Last Validated: {selectedCard.lastUpdated}
              </span>
            </div>
          </div>

          {/* Card Body Grid */}
          <div className="p-6 space-y-6 text-xs text-slate-700">
            {/* Core Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Base Model Architecture
                </span>
                <span className="font-mono font-bold text-slate-800 text-xs mt-1 block">
                  {selectedCard.baseModel}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Current Version & Status
                </span>
                <span className="font-bold text-slate-800 text-xs mt-1 block">
                  {selectedCard.version} ({selectedCard.status})
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Input Stream / Format
                </span>
                <span className="text-slate-700 text-xs mt-1 block line-clamp-2">
                  {selectedCard.inputs}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Primary Model Output
                </span>
                <span className="text-slate-700 text-xs mt-1 block line-clamp-2">
                  {selectedCard.outputs}
                </span>
              </div>
            </div>

            {/* Human Oversight & Out of Scope */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-lg space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900 text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Mandatory Human Oversight (Pharmacist Gate)</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {selectedCard.humanOversight}
                </p>
                <div className="pt-2 text-[11px] text-emerald-800 font-semibold">
                  Intended Users: {selectedCard.intendedUsers.join(' • ')}
                </div>
              </div>

              <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-lg space-y-2">
                <div className="flex items-center gap-2 font-bold text-rose-900 text-xs uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Explicitly Out-of-Scope (Disallowed Use Cases)</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  {selectedCard.outOfScope.map((item, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Evaluation & Production Distinction (Crucial for Q6 & Model Card) */}
            <div className="border border-slate-200 rounded-lg p-5 bg-gradient-to-br from-slate-50 to-white space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Brain className="w-4 h-4 text-[#0083cb]" />
                  Quantitative Evaluation & Validation Metrics
                </h3>
                {selectedCard.isSampleDataOnly && (
                  <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                    Sample Evaluation Data
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-white border border-slate-200 rounded-md">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Documented Benchmark Metric
                  </span>
                  <div className="text-2xl font-extrabold text-[#0066cc] mt-1 font-mono">
                    {selectedCard.evaluation.metricValue}
                  </div>
                  <span className="text-[11px] text-slate-600 block mt-0.5 font-medium">
                    {selectedCard.evaluation.metricName}
                  </span>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-md col-span-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Cross-Validation & Methodology Details
                  </span>
                  <p className="text-slate-800 font-semibold mt-1">
                    {selectedCard.evaluation.validationType}
                  </p>
                  <p className="text-slate-600 mt-1 text-[11px]">
                    {selectedCard.evaluation.datasetDetails}
                  </p>
                </div>
              </div>

              {/* Explicit distinction between documented Triplet evaluation vs production precision */}
              <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-md text-amber-900">
                <span className="font-bold block text-xs mb-1">
                  Responsible AI Clarification & Reality Distinction:
                </span>
                <p className="text-xs leading-relaxed">
                  {selectedCard.evaluation.productionBenchmarkNote}
                </p>
              </div>
            </div>

            {/* Limitations & Fairness Risks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-200 rounded-lg space-y-2 bg-white">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Known Technical Limitations & Failure Modes
                </h4>
                <ul className="space-y-1.5">
                  {selectedCard.knownLimitations.map((lim, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-600">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{lim}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 border border-slate-200 rounded-lg space-y-2 bg-white">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Fairness, Dialect & Ecosystem Risks
                </h4>
                <ul className="space-y-1.5">
                  {selectedCard.fairnessRisks.map((risk, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-600">
                      <span className="text-purple-500 font-bold">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Version Change History */}
            <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-2">
                <History className="w-4 h-4 text-slate-500" />
                Audited Change History & Retraining Logs
              </h4>
              <div className="divide-y divide-slate-100">
                {selectedCard.changeHistory.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                        {item.version}
                      </span>
                      <span className="text-slate-700 text-xs">
                        {item.summary}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>{item.author}</span>
                      <span className="font-mono">{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
