import { useState, useEffect } from 'react';
import { Bell, RefreshCw, Smartphone, Monitor, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { useDemoData } from '../../context/DemoDataContext';
import { ClusterLogo } from '../common/ClusterLogo';
interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
}
export function Header({ sidebarOpen, setSidebarOpen, activeScreen, setActiveScreen }: HeaderProps) {
  const { resetDemoData, errorLogs, extractedLogs } = useDemoData();
  const [now, setNow] = useState(new Date());
  const [panel, setPanel] = useState<'notifications' | 'profile' | null>(null);
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);
  const pending = extractedLogs.filter(log => log.reviewStatus === 'Pending Review').length;
  const unresolved = errorLogs.filter(log => log.status === 'unresolved').length;
  return (
    <header className="relative shrink-0 h-[88px] bg-gradient-to-r from-[#154b9e] via-[#0878be] to-[#00a2dc] text-white flex items-center justify-between px-3 sm:px-5 gap-3 z-30 shadow-sm">
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'} aria-expanded={sidebarOpen} className="p-2 rounded-md hover:bg-white/15">
          {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>
        <ClusterLogo className="hidden sm:inline-block" />
        <div className="hidden lg:flex gap-1 bg-white/10 p-1 rounded-md text-xs">
          <button onClick={() => setActiveScreen('mappings')} className={`flex gap-2 items-center px-3 py-2 rounded ${activeScreen !== 'mobile_pharmacy' ? 'bg-white text-blue-700' : 'hover:bg-white/10'}`}><Monitor size={15} /> Admin portal</button>
          <button onClick={() => setActiveScreen('mobile_pharmacy')} className={`flex gap-2 items-center px-3 py-2 rounded ${activeScreen === 'mobile_pharmacy' ? 'bg-white text-blue-700' : 'hover:bg-white/10'}`}><Smartphone size={15} /> Pharmacy app</button>
        </div>
      </div>
      <div className="hidden 2xl:flex absolute left-1/2 -translate-x-1/2 flex-col items-center pointer-events-none">
        <span className="text-2xl font-bold">{now.toLocaleTimeString('en-US', {hour:'numeric', minute:'2-digit', timeZone:'Africa/Cairo'})}</span>
        <span className="text-sm">{now.toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric', timeZone:'Africa/Cairo'})}</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="text-[10px] sm:text-xs bg-white/15 border border-white/25 rounded px-2 py-1 whitespace-nowrap">Demo · Mock data</span>
        <button onClick={() => {if (window.confirm('Restore all original demo records? Your demo edits will be removed.')) resetDemoData();}} title="Reset demo data" aria-label="Reset demo data" className="p-2 rounded hover:bg-white/15"><RefreshCw size={16} /></button>
        <button aria-label="Notifications" aria-expanded={panel === 'notifications'} onClick={() => setPanel(panel === 'notifications' ? null : 'notifications')} className="relative p-2 rounded hover:bg-white/15">
          <Bell size={21} /><span className="absolute -top-1 -right-1 bg-[#ff2a5f] rounded-full min-w-4 px-1 text-[10px]">{pending + unresolved}</span>
        </button>
        <button aria-label="Admin profile" aria-expanded={panel === 'profile'} onClick={() => setPanel(panel === 'profile' ? null : 'profile')} className="w-10 h-10 rounded-full border-2 border-white/80 bg-blue-800 text-xs font-bold shrink-0">HA</button>
      </div>
      {panel && <div className="absolute right-3 top-[78px] w-72 max-w-[calc(100vw-24px)] rounded-lg bg-white text-slate-700 shadow-xl border p-4 text-sm">
        <div className="flex justify-between items-center mb-3"><strong>{panel === 'notifications' ? 'Demo notifications' : 'Administrator'}</strong><button aria-label="Close panel" onClick={() => setPanel(null)}><X size={16}/></button></div>
        {panel === 'notifications' ? <div className="space-y-2">
          <button onClick={() => {setActiveScreen('extracted_logs'); setPanel(null);}} className="w-full text-left p-2 rounded bg-sky-50">{pending} extractions awaiting review</button>
          <button onClick={() => {setActiveScreen('error_logs'); setPanel(null);}} className="w-full text-left p-2 rounded bg-amber-50">{unresolved} unresolved error records</button>
        </div> : <><p className="font-semibold">Dr. Heba Admin</p><p className="text-xs text-slate-500 mt-1">Catalogue administrator · Demo account</p></>}
      </div>}
    </header>
  );
}
