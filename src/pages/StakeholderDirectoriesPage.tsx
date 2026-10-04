import { useState, useMemo } from 'react';
import { Search, Plus, Eye, Pencil, X, Building2, Store, Users, Handshake } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { useDemoData, DirectoryKind, DirectoryRecord } from '../context/DemoDataContext';
import { INITIAL_PHARMACIES_DIRECTORY, INITIAL_SUPPLIERS_DIRECTORY, INITIAL_CUSTOMERS_DIRECTORY, INITIAL_PARTNERS_DIRECTORY } from '../data/mockData';

const tabs = [
  {key: 'pharmacies', label: 'Pharmacies', icon: Store, columns: ['nameEn','district','governorate','managerName','phone','status'], template: INITIAL_PHARMACIES_DIRECTORY[0]},
  {key: 'suppliers', label: 'Suppliers', icon: Building2, columns: ['nameEn','integrationMethod','catalogueItemCount','warehouseCity','contactPerson','status'], template: INITIAL_SUPPLIERS_DIRECTORY[0]},
  {key: 'customers', label: 'Customers', icon: Users, columns: ['name','customerType','preferredPharmacy','city','anonymizedIdentifier','lastInteraction'], template: INITIAL_CUSTOMERS_DIRECTORY[0]},
  {key: 'partners', label: 'Partners', icon: Handshake, columns: ['partnerName','partnerType','collaborationStartDate','jointActivity','activityDate','contactRole'], template: INITIAL_PARTNERS_DIRECTORY[0]},
] as const;
const choices: Record<string,string[]> = {
  tier: ['Community','Hospital','Chain Branch'],
  integrationMethod: ['API Automated','Daily Excel/CSV','Manual Entry'],
  customerType: ['Retail Patron','Chronic Medication Member','Institutional Account'],
  partnerType: ['Reverse Logistics & Expired Stock','Eco-friendly Pharma Waste','Independent Testing Lab','Pharmacy Syndicate Liaison'],
};
function label(key: string) { return key.replace(/([A-Z])/g, ' $1').replace(/^./, char => char.toUpperCase()).replace('Name En','English name').replace('Name Ar','Arabic name'); }
function values(row: DirectoryRecord) { return row as unknown as Record<string, string | number>; }

export function StakeholderDirectoriesPage({title = 'Stakeholder Directories'}: {title?:string}) {
  const data = useDemoData();
  const [active, setActive] = useState<DirectoryKind>('pharmacies');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<{mode: 'view' | 'edit' | 'create'; row: DirectoryRecord} | null>(null);
  const config = tabs.find(tab => tab.key === active)!;
  const rows: DirectoryRecord[] = data[active];
  const statuses = Array.from(new Set(rows.map(row => String(values(row).status || values(row).customerType))));
  const filtered = useMemo(() => rows.filter(row => {
    const record = values(row);
    return Object.values(record).join(' ').toLowerCase().includes(search.trim().toLowerCase()) && (filter === 'all' || (record.status || record.customerType) === filter);
  }), [rows, search, filter]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / 10));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * 10, currentPage * 10);
  const openCreate = () => {
    const draft: Record<string,string | number> = {};
    for (const [key, value] of Object.entries(config.template)) {
      draft[key] = key === 'id' ? crypto.randomUUID() : key === 'code' ? `${active.slice(0,3).toUpperCase()}-${String(rows.length + 1).padStart(3,'0')}` : typeof value === 'number' ? 0 : choices[key] ? choices[key][0] : /Date|Since|Interaction/.test(key) ? new Date().toISOString().slice(0,10) : key === 'status' ? String(value) : key === 'disclaimer' ? 'Fictional illustrative demo organization.' : '';
    }
    setDialog({mode:'create', row: draft as unknown as DirectoryRecord});
  };
  const save = (event: React.FormEvent) => {
    event.preventDefault();
    if (!dialog) return;
    data.saveDirectoryRecord(active, dialog.row);
    setDialog(null);
  };
  const setField = (key: string, value: string) => {
    if (!dialog) return;
    const isNumber = typeof values(config.template)[key] === 'number';
    setDialog({...dialog, row: {...dialog.row, [key]: isNumber ? Number(value) : value} as DirectoryRecord});
  };
  return <div className="pb-12">
    <PageHeader title={title} breadcrumbs={['Dashboard','Ecosystem','Directories']} actionSlot={<button className="cluster-button" onClick={openCreate}><Plus size={15}/> Add {active === 'pharmacies' ? 'pharmacy' : active.slice(0,-1)}</button>}/>
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-5">
      <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-xs text-sky-900">Pharmacies, suppliers, customers and collaboration partners. All records, organizations and contacts in this demo are fictional.</div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Directory categories">{tabs.map(tab => <button role="tab" aria-selected={active === tab.key} key={tab.key} onClick={() => {setActive(tab.key); setSearch(''); setFilter('all'); setPage(1);}} className={`flex items-center gap-2 text-xs font-semibold px-4 py-3 rounded-md border ${active === tab.key ? 'bg-[#0083cb] border-[#0083cb] text-white' : 'bg-white border-slate-200 text-slate-600'}`}><tab.icon size={16}/>{tab.label}<span className="opacity-70">{data[tab.key].length}</span></button>)}</div>
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 flex flex-wrap gap-3 items-center justify-between border-b">
          <div className="relative w-full sm:w-80"><Search size={16} className="absolute left-3 top-3 text-slate-400"/><input aria-label="Search directory" className="cluster-input pl-9" placeholder={`Search ${active}...`} value={search} onChange={event => {setSearch(event.target.value); setPage(1);}}/></div>
          <select aria-label="Filter directory status" className="cluster-input w-auto" value={filter} onChange={event => {setFilter(event.target.value); setPage(1);}}><option value="all">All statuses / types</option>{statuses.map(status => <option key={status}>{status}</option>)}</select>
        </div>
        <div className="overflow-x-auto"><table className="w-full text-left text-xs min-w-[850px]"><thead className="bg-slate-50 text-slate-400 uppercase text-[10px]"><tr><th className="p-4">Code</th>{config.columns.map(key => <th key={key} className="p-4">{label(key)}</th>)}<th className="p-4">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">
          {visible.map(row => <tr key={row.id} className="hover:bg-slate-50"><td className="p-4 text-slate-400 font-mono">{values(row).code}</td>{config.columns.map((key,index) => <td key={key} className={`p-4 ${index === 0 ? 'font-semibold text-slate-800' : 'text-slate-600'}`}><span dir="auto">{String(values(row)[key] ?? '')}</span>{index === 0 && values(row).nameAr && <span dir="rtl" className="block text-blue-600 mt-1 font-arabic font-normal">{values(row).nameAr}</span>}</td>)}<td className="p-4"><div className="flex gap-2"><button aria-label={`View ${values(row).nameEn || values(row).name || values(row).partnerName}`} className="text-slate-500 hover:text-blue-600 p-1" onClick={() => setDialog({mode:'view',row})}><Eye size={16}/></button><button aria-label={`Edit ${values(row).nameEn || values(row).name || values(row).partnerName}`} className="text-sky-600 p-1" onClick={() => setDialog({mode:'edit',row})}><Pencil size={16}/></button></div></td></tr>)}
          {!visible.length && <tr><td colSpan={config.columns.length+2} className="p-12 text-center text-slate-400">No records match your search or filters.</td></tr>}
        </tbody></table></div>
        <div className="flex flex-wrap gap-3 justify-between items-center px-4 py-3 border-t text-xs text-slate-500"><span>{filtered.length ? (currentPage-1)*10+1 : 0}–{Math.min(currentPage*10,filtered.length)} of {filtered.length} records</span><div className="flex items-center gap-3"><button disabled={currentPage===1} onClick={() => setPage(currentPage-1)} className="disabled:opacity-40">Previous</button><span>{currentPage} / {totalPages}</span><button disabled={currentPage===totalPages} onClick={() => setPage(currentPage+1)} className="disabled:opacity-40">Next</button></div></div>
      </div>
    </div>
    {dialog && <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4"><section role="dialog" aria-modal="true" aria-labelledby="directory-dialog-title" className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85dvh] overflow-y-auto"><div className="p-5 border-b flex justify-between"><h2 id="directory-dialog-title" className="font-semibold">{dialog.mode === 'view' ? 'Record details' : dialog.mode === 'edit' ? 'Edit record' : 'Create record'} · {config.label}</h2><button aria-label="Close directory dialog" onClick={() => setDialog(null)}><X size={18}/></button></div>
      <form onSubmit={save} className="p-5"><div className="grid sm:grid-cols-2 gap-4">{Object.entries(values(dialog.row)).filter(([key]) => key !== 'id').map(([key,value]) => {
        const selectChoices = key === 'status' ? active === 'pharmacies' ? ['Active','Under Review','Suspended'] : active === 'suppliers' ? ['Verified','Syncing','Inactive'] : ['Active Partnership','Pilot Stage'] : choices[key];
        return <label key={key} className={`block text-xs text-slate-500 ${key === 'jointActivity' || key === 'disclaimer' ? 'sm:col-span-2' : ''}`}>{label(key)}{dialog.mode === 'view' ? <span dir="auto" className="block text-sm text-slate-800 mt-1">{value}</span> : selectChoices ? <select className="cluster-input mt-1" value={value} onChange={event => setField(key,event.target.value)}>{selectChoices.map(option => <option key={option}>{option}</option>)}</select> : <input dir="auto" required className="cluster-input mt-1" type={typeof value === 'number' ? 'number' : /Date|Since|Interaction/.test(key) ? 'date' : 'text'} min={typeof value === 'number' ? 0 : undefined} value={value} onChange={event => setField(key,event.target.value)}/>}</label>;
      })}</div><div className="flex justify-end gap-3 mt-6"><button type="button" onClick={() => setDialog(null)} className="text-xs text-slate-500 px-3 py-2">Close</button>{dialog.mode !== 'view' && <button className="cluster-button" type="submit">Save record</button>}</div></form>
    </section></div>}
  </div>;
}
