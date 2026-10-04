import { useState } from 'react';
import { Home, Store, Building2, ClipboardList, Handshake, Package, MessagesSquare, KeyRound, List, ChevronRight, ChevronsLeft, ChevronsRight, ShieldCheck, Cpu, Layers } from 'lucide-react';
import type { ElementType } from 'react';
import { ClusterLogo } from '../common/ClusterLogo';
interface SidebarProps { sidebarOpen:boolean; setSidebarOpen:(open:boolean)=>void; activeScreen:string; setActiveScreen:(screen:string)=>void; }
interface NavItem { id:string; label:string; icon:ElementType; children?:{id:string;label:string}[]; badge?:string; }
const sections: {label:string;items:NavItem[]}[] = [
  {label:'DASHBOARD',items:[{id:'dashboard',label:'Dashboard',icon:Home}]},
  {label:'STAKEHOLDER',items:[
    {id:'pharmacies',label:'Pharmacies',icon:Store,children:[{id:'pharmacies',label:'All Pharmacies'},{id:'mobile_pharmacy',label:'Pharmacy App'}]},
    {id:'suppliers',label:'Suppliers',icon:Building2,children:[{id:'suppliers',label:'All Suppliers'},{id:'directories',label:'Stakeholder Directory'}]},
  ]},
  {label:'ORDERS',items:[{id:'orders',label:'Orders',icon:ClipboardList,badge:'285'},{id:'deal_orders',label:'Deal Orders',icon:Handshake},{id:'order_packages',label:'Order Packages',icon:Package}]},
  {label:'SETTINGS',items:[{id:'faqs',label:'Q&A',icon:MessagesSquare}]},
  {label:'TOOLS',items:[{id:'string_processor',label:'String Processor',icon:KeyRound}]},
  {label:'LOCATIONS',items:[{id:'areas',label:'Areas',icon:List,children:[{id:'areas',label:'All Areas'},{id:'data_retention',label:'District Demand & Data'}]}]},
];
const additional:NavItem[] = [
  {id:'mappings',label:'Medicines',icon:Layers,children:[{id:'mappings',label:'Medicine Mappings'},{id:'corrections',label:'Mapping Corrections'},{id:'mapping_logs',label:'Mapping Logs'},{id:'extracted_logs',label:'Extraction Logs'},{id:'error_logs',label:'Error Logs'}]},
  {id:'ai_models',label:'Responsible AI',icon:Cpu,children:[{id:'ai_models',label:'Model & System Cards'},{id:'data_retention',label:'Data Usage & Retention'},{id:'governance',label:'Governance & Accountability'},{id:'monitoring',label:'Monitoring & Feedback'},{id:'showcase',label:'Responsible AI Showcase'}]},
  {id:'roles',label:'Roles & Permissions',icon:ShieldCheck},
];
export function Sidebar({sidebarOpen,setSidebarOpen,activeScreen,setActiveScreen}:SidebarProps) {
  const [expanded,setExpanded] = useState<string[]>([]);
  const navigate = (id:string) => {setActiveScreen(id); if(window.innerWidth<768) setSidebarOpen(false);};
  const renderItem = (item:NavItem) => {
    const active = activeScreen===item.id || item.children?.some(child=>child.id===activeScreen);
    const open = expanded.includes(item.id);
    return <div key={item.id}>
      <div className={`flex items-center ${active ? 'bg-[#0c3e82]' : 'hover:bg-white/5'}`}>
        <button aria-label={item.label} aria-current={activeScreen===item.id ? 'page' : undefined} title={!sidebarOpen ? item.label : undefined} onClick={()=>navigate(item.id)} className="flex flex-1 min-w-0 items-center gap-3 px-3 py-[8px] text-left text-[12px] text-[#dbe8fb]">
          <item.icon size={14} strokeWidth={2.6} className="shrink-0"/>
          {sidebarOpen && <><span className={`truncate ${active?'font-semibold text-white':''}`}>{item.label}</span>{item.badge && <span className="bg-[#f5edf4] text-[#ec4e89] rounded-full px-1.5 py-0.5 text-[9px] font-bold">{item.badge}</span>}</>}
        </button>
        {sidebarOpen && item.children && <button aria-label={`Toggle ${item.label} menu`} aria-expanded={open} onClick={()=>setExpanded(ids=>open?ids.filter(id=>id!==item.id):[...ids,item.id])} className="px-3 py-2 text-white/60"><ChevronRight size={12} className={open?'rotate-90':''}/></button>}
      </div>
      {sidebarOpen && item.children && open && <div className="bg-[#10458f] pb-1">{item.children.map(child=><button key={child.id} aria-current={activeScreen===child.id?'page':undefined} onClick={()=>navigate(child.id)} className={`w-full text-left pl-10 pr-3 py-2 text-[11px] ${activeScreen===child.id?'text-white bg-[#0c3e82]':'text-blue-100/80 hover:text-white'}`}>{child.label}</button>)}</div>}
    </div>;
  };
  return <aside className={`bg-[#154fa4] flex flex-col shrink-0 h-full z-40 transition-[width] duration-200 ${sidebarOpen?'w-[190px] absolute left-0 inset-y-0 md:relative':'w-[56px]'} ${activeScreen==='mobile_pharmacy'&&!sidebarOpen?'hidden md:flex':''}`}>
    <div className="h-[52px] shrink-0 border-b border-dashed border-white/15 flex items-center justify-between px-3">
      {sidebarOpen && <ClusterLogo className="!w-[112px] !h-[34px] [&_img]:!h-[34px]"/>}
      <button aria-label={sidebarOpen?'Collapse sidebar':'Expand sidebar'} aria-expanded={sidebarOpen} title={sidebarOpen?'Collapse sidebar':'Expand sidebar'} onClick={()=>setSidebarOpen(!sidebarOpen)} className="p-1 text-blue-100/70 hover:text-white">{sidebarOpen?<ChevronsLeft size={17}/>:<ChevronsRight size={17}/>}</button>
    </div>
    <nav aria-label="Main navigation" className="flex-1 min-h-0 overflow-y-auto pb-4 sidebar-navigation">
      {sections.map(section=><section key={section.label}>{sidebarOpen&&<h2 className="text-[9px] tracking-[.09em] font-semibold text-[#8daacb] px-2 pt-3 pb-1.5">{section.label}</h2>}{section.items.map(renderItem)}</section>)}
      <section className="mt-5 border-t border-dashed border-white/15 pt-2">{sidebarOpen&&<h2 className="text-[9px] tracking-[.09em] font-semibold text-[#8daacb] px-2 pt-2 pb-2">ADMINISTRATION</h2>}{additional.map(renderItem)}</section>
    </nav>
  </aside>;
}
