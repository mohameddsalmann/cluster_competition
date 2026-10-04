import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { SHOWCASE_CASES } from '../data/mockData';
import {
  Award,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Info,
  Layers,
  Mic,
  RefreshCw,
} from 'lucide-react';
import { ShowcaseCase } from '../types';

interface ResponsibleAiShowcasePageProps {
  onNavigateToScreen: (screenId: string) => void;
}

export const ResponsibleAiShowcasePage: React.FC<ResponsibleAiShowcasePageProps> = ({
  onNavigateToScreen,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(SHOWCASE_CASES[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const selectedCase =
    SHOWCASE_CASES.find((c) => c.id === selectedCaseId) || SHOWCASE_CASES[0];

  const handleSelectCase = (id: string) => {
    setSelectedCaseId(id);
    setCurrentStepIndex(0);
  };

  const getCaseIcon = (id: string) => {
    if (id === 'hero-1') return ShieldCheck;
    if (id === 'hero-2') return Mic;
    return RefreshCw;
  };

  return (
    <div className="w-full pb-16">
      <PageHeader
        title="Responsible AI Showcase & Ecosystem Benchmarks"
        breadcrumbs={['Dashboard', 'Governance', 'Responsible AI Hero Cases']}
      />

      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 space-y-6">
        {/* Compliance Banner referencing Screenshot Q43 */}
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 text-xs text-sky-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                Three Ecosystem Reference Deployments for SME Healthcare AI (Q43 RAI Playbook)
              </h3>
              <p className="text-slate-600 mt-0.5">
                Demonstrates tangible, reproducible architectures that peer pharmaceutical companies can adopt: 1) Pharmacist-in-the-loop with logged decisions; 2) Egyptian-Arabic voice ordering across regional dialects; 3) ERP closed-loop correction feedback.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-[#0083cb] text-white text-[11px] font-bold shadow-xs whitespace-nowrap">
            Illustrative Reference Cases
          </span>
        </div>

        {/* 3 Hero Case Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SHOWCASE_CASES.map((item, idx) => {
            const Icon = getCaseIcon(item.id);
            const isSelected = item.id === selectedCaseId;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectCase(item.id)}
                className={`p-5 rounded-lg border text-left transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-[#0083cb] shadow-md ring-2 ring-[#0083cb]/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                      Hero Case {idx + 1}
                    </span>
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-sky-100 text-[#0083cb]' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug">
                    {item.title}
                  </h3>
                  <h4 className="font-arabic text-xs font-semibold text-slate-500 mt-1 dir-rtl text-right">
                    {item.titleAr}
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {item.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#0083cb] font-semibold">
                  <span>Explore Interactive Walkthrough</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Hero Case Interactive Simulation Experience */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] overflow-hidden">
          {/* Hero Banner Header */}
          <div className="p-6 bg-gradient-to-r from-[#072445] via-[#0d3b6c] to-[#0066cc] text-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-white/20 text-white text-[10px] uppercase font-bold tracking-wider">
                  {selectedCase.pillar}
                </span>
                <h2 className="text-xl font-bold tracking-tight mt-1 text-white">
                  {selectedCase.title}
                </h2>
                <h3 className="text-xs font-arabic text-cyan-200 mt-0.5 dir-rtl text-right">
                  {selectedCase.titleAr}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {selectedCase.referenceLinks.map((link, idx) => (
                  <button
                    key={idx}
                    onClick={() => onNavigateToScreen(link.screenKey)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition backdrop-blur-xs"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-200 mt-3 max-w-4xl leading-relaxed">
              {selectedCase.summary}
            </p>
          </div>

          {/* Key Demonstrated Metrics */}
          <div className="p-6 border-b border-slate-100 bg-[#fafbfc]">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              Illustrative Demo Metrics
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {selectedCase.metrics.map((metric, idx) => (
                <div key={idx} className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    {metric.label}
                  </span>
                  <div className="text-2xl font-extrabold text-[#0066cc] font-mono mt-0.5">
                    {metric.value}
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    {metric.note}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Interactive Workflow */}
          <div className="p-6 space-y-6">
            <div>
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">
                Interactive Multi-Step Technical Walkthrough
              </h4>
              <p className="text-xs text-slate-500">
                Click through each step to observe the mechanism and data flow in action.
              </p>
            </div>

            {/* Stepper Navigation */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              {selectedCase.interactiveSteps.map((step, idx) => {
                const isActive = idx === currentStepIndex;
                const isPassed = idx < currentStepIndex;

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentStepIndex(idx)}
                    className="flex items-center gap-2 text-left group"
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition ${
                        isActive
                          ? 'bg-[#0083cb] text-white shadow-sm ring-2 ring-sky-200'
                          : isPassed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                      }`}
                    >
                      {step.stepNumber}
                    </div>
                    <div className="hidden sm:block">
                      <span className={`text-xs font-bold block ${isActive ? 'text-[#0083cb]' : 'text-slate-700'}`}>
                        {step.title}
                      </span>
                      <span className="text-[10px] text-slate-400">Step {step.stepNumber} of 3</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Step Content Display */}
            {selectedCase.interactiveSteps[currentStepIndex] && (
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-slate-900 text-sm">
                    {selectedCase.interactiveSteps[currentStepIndex].title}
                  </h5>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                    Step {currentStepIndex + 1}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedCase.interactiveSteps[currentStepIndex].description}
                </p>

                <div className="p-3 bg-slate-900 text-cyan-300 rounded-lg font-mono text-[11px] overflow-x-auto">
                  <span className="text-slate-400 block mb-1">// Simulated State Payload:</span>
                  <pre>{JSON.stringify(selectedCase.interactiveSteps[currentStepIndex].stateData, null, 2)}</pre>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    disabled={currentStepIndex === 0}
                    onClick={() => setCurrentStepIndex((p) => Math.max(0, p - 1))}
                    className="px-3 py-1.5 rounded border border-slate-200 bg-white text-xs text-slate-700 disabled:opacity-40 hover:bg-slate-100"
                  >
                    Previous Step
                  </button>

                  <button
                    disabled={currentStepIndex === selectedCase.interactiveSteps.length - 1}
                    onClick={() => setCurrentStepIndex((p) => Math.min(selectedCase.interactiveSteps.length - 1, p + 1))}
                    className="px-4 py-1.5 rounded bg-[#0083cb] text-white text-xs font-semibold disabled:opacity-40 hover:bg-[#0074b3]"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
