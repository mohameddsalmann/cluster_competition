import { useState, useEffect } from 'react';
import { Bell, Menu, X, CircleUserRound, Smartphone, RefreshCw } from 'lucide-react';
import { useDemoData } from '../../context/DemoDataContext';
interface HeaderProps { sidebarOpen:boolean; setSidebarOpen:(open:boolean)=>void; activeScreen:string; setActiveScreen:(screen:string)=>void; }
export function Header({sidebarOpen,setSidebarOpen,setActiveScreen}:HeaderProps) {
  const {resetDemoData,errorLogs,extractedLogs}=useDemoData();
  const [now,setNow]=useState(new Date());
  const [panel,setPanel]=useState<'notifications'|'profile'|null>(null);
  useEffect(()=>{const timer=setInterval(()=>setNow(new Date()),30000);return()=>clearInterval(timer);},[]);
  const pending=extractedLogs.filter(log=>log.reviewStatus==='Pending Review').length;
  const unresolved=errorLogs.filter(log=>log.status==='unresolved').length;
  return <header className="h-[76px] shrink-0 relative bg-gradient-to-r from-[#1557a7] via-[#087dbb] to-[#00a0d1] flex items-center justify-end px-4 sm:px-6 text-white z-30">
    <button aria-label={sidebarOpen?'Close navigation':'Open navigation'} onClick={()=>setSidebarOpen(!sidebarOpen)} className="md:hidden absolute left-3 p-2"><Menu size={19}/></button>
    <div className={`absolute left-1/2 ${sidebarOpen ? 'md:-ml-[95px]' : 'md:-ml-[28px]'} -translate-x-1/2 flex flex-col items-center text-center`}><span className="text-[21px] font-bold leading-tight">{now.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit',timeZone:'Africa/Cairo'})}</span><span className="text-[13px] mt-1 text-white/95">{now.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'Africa/Cairo'})}</span></div>
    <div className="flex items-center gap-5 sm:gap-6">
      <button aria-label="Notifications" aria-expanded={panel==='notifications'} onClick={()=>setPanel(panel==='notifications'?null:'notifications')} className="relative p-1 text-[#083f64]"><Bell size={19}/><span className="absolute -top-2 -right-1 bg-[#fc4c80] rounded-full min-w-[17px] h-[17px] px-1 text-white text-[9px] font-bold flex items-center justify-center">{pending+unresolved}</span></button>
      <button aria-label="Admin profile" aria-expanded={panel==='profile'} onClick={()=>setPanel(panel==='profile'?null:'profile')} className="w-[46px] h-[46px] rounded-full bg-[#eaf0ef] flex items-center justify-center text-[#b4c0c6]"><CircleUserRound size={29} strokeWidth={1.5}/></button>
    </div>
    {panel&&<div className="absolute top-[68px] right-3 w-72 max-w-[calc(100vw-24px)] p-4 rounded-lg shadow-xl bg-white text-slate-700 border text-sm"><div className="flex items-center justify-between mb-3"><strong>{panel==='notifications'?'Notifications':'Administrator'}</strong><button aria-label="Close panel" onClick={()=>setPanel(null)}><X size={16}/></button></div>
      {panel==='notifications'?<div className="space-y-2"><button className="w-full p-2 bg-sky-50 text-left rounded" onClick={()=>{setActiveScreen('extracted_logs');setPanel(null);}}>{pending} extractions awaiting review</button><button className="w-full p-2 bg-amber-50 text-left rounded" onClick={()=>{setActiveScreen('error_logs');setPanel(null);}}>{unresolved} unresolved error records</button></div>:<div className="space-y-3"><div><p className="font-semibold">Dr. Heba Admin</p><p className="text-xs text-slate-400 mt-1">Demo · Mock data</p></div><button className="flex gap-2 text-xs items-center" onClick={()=>{setActiveScreen('mobile_pharmacy');setPanel(null);}}><Smartphone size={15}/>Pharmacy app</button><button className="flex gap-2 text-xs items-center" onClick={()=>{if(window.confirm('Restore the original mock records and remove demo edits?')) resetDemoData();setPanel(null);}}><RefreshCw size={15}/>Reset demo data</button></div>}
    </div>}
  </header>;
}
