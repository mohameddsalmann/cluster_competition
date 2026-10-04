import React, { useState, useEffect, useRef } from 'react';
import { useDemoData } from '../context/DemoDataContext';
import { ClusterLogo } from '../components/common/ClusterLogo';
import {
  Menu,
  ShoppingCart,
  Bell,
  Search,
  Mic,
  Check,
  X,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  ShoppingBag,
  Info,
} from 'lucide-react';

const MOBILE_CATALOGUE = [
  {id:'panadol',name:'Panadol Extra 24 Tablets',nameAr:'بنادول اكسترا 24 قرص',price:48,category:'مسكنات'},
  {id:'cataflam',name:'Cataflam 50 mg 20 Tablets',nameAr:'كتافلام 50 مجم 20 قرص',price:42,category:'مسكنات'},
  {id:'concor',name:'Concor 5 mg 30 Tablets',nameAr:'كونكور 5 مجم 30 قرص',price:75,category:'ضغط الدم'},
  {id:'norvasc',name:'Norvasc 5 mg 10 Tablets',nameAr:'نورفاسك 5 مجم 10 أقراص',price:62,category:'ضغط الدم'},
  {id:'cream',name:'Glamy Lab Hydra Intense 50 g',nameAr:'جلامي لاب هيدرا انتنس 50 جم',price:290,category:'العناية بالبشرة'},
  {id:'gauze',name:'Sterile Gauze 10 Packs',nameAr:'شاش معقم 10 عبوات',price:35,category:'مستلزمات'},
];

interface ExtractedVoiceItem {
  id: string;
  nameAr: string;
  nameEn: string;
  quantity: number;
  unitPrice: number;
  confidence: number;
  status: 'accepted' | 'rejected';
}

export const MobilePharmacyHome: React.FC = () => {
  const { mobileCart, addToMobileCart, clearMobileCart, recordVoiceReview, suppliers, showToast } = useDemoData();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [panel, setPanel] = useState<'menu'|'notifications'|'orders'|'suppliers'|'profile'|null>(null);
  const [orders, setOrders] = useState([{id:'DEMO-1028',total:426,status:'تم التسليم'}, {id:'DEMO-1032',total:312,status:'قيد التجهيز'}]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const cancelRecording = () => { timers.current.forEach(clearTimeout); timers.current = []; setVoiceState('idle'); };
  const visibleProducts = MOBILE_CATALOGUE.filter(product => (category === 'all' || product.category === category) && `${product.name} ${product.nameAr}`.toLowerCase().includes(search.trim().toLowerCase()));

  // Voice recording simulation states: 'idle' | 'recording' | 'transcribing' | 'review' | 'added'
  const [voiceState, setVoiceState] = useState<'idle' | 'recording' | 'transcribing' | 'review' | 'added'>('idle');
  const [showCartDrawer, setShowCartDrawer] = useState(false);

  // Mock extracted items from simulated speech: "محتاج خمس علب بنادول اكسترا و اتنين كتافلام 50 و علبة واحدة كونكور 5"
  const [extractedItems, setExtractedItems] = useState<ExtractedVoiceItem[]>([
    {
      id: 'v-1',
      nameAr: 'بنادول اكسترا 24 قرص سريع المفعول',
      nameEn: 'Panadol Extra 24 Tablets',
      quantity: 5,
      unitPrice: 48.0,
      confidence: 0.99,
      status: 'accepted',
    },
    {
      id: 'v-2',
      nameAr: 'كتافلام 50 مجم مسكن ومضاد للالتهاب 20 قرص',
      nameEn: 'Cataflam 50 mg 20 Tablets',
      quantity: 2,
      unitPrice: 42.0,
      confidence: 0.97,
      status: 'accepted',
    },
    {
      id: 'v-3',
      nameAr: 'كونكور 5 مجم لعلاج ضغط الدم 30 قرص',
      nameEn: 'Concor 5 mg 30 Tablets',
      quantity: 1,
      unitPrice: 75.0,
      confidence: 0.96,
      status: 'accepted',
    },
  ]);

  // Voice recording simulation triggers
  const startSimulatedRecording = () => {
    if (voiceState === 'recording' || voiceState === 'transcribing') return;
    timers.current.forEach(clearTimeout);
    setExtractedItems(items => items.map((item,index) => ({...item, quantity: [5,2,1][index], status:'accepted'})));
    setVoiceState('recording');
    timers.current = [setTimeout(() => setVoiceState('transcribing'), 2200), setTimeout(() => setVoiceState('review'), 3400)];
  };

  const handleQuantityChange = (id: string, delta: number) => {
    setExtractedItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      })
    );
  };

  const handleToggleStatus = (id: string) => {
    setExtractedItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          status: item.status === 'accepted' ? 'rejected' : 'accepted',
        };
      })
    );
  };

  const handleCommitVoiceOrder = () => {
    const acceptedList = extractedItems.filter((i) => i.status === 'accepted');
    if (acceptedList.length === 0) {
      recordVoiceReview(extractedItems.map(item => ({rawText:item.nameAr, suggestedMatch:item.nameEn, confidence:item.confidence, acceptedQuantity:0, accepted:false})));
      showToast('info', 'Voice order rejected', 'The pharmacist rejected all suggestions. The decision was logged.');
      setVoiceState('idle');
      return;
    }

    addToMobileCart(
      acceptedList.map((item) => ({
        id: `cart-${Date.now()}-${item.id}`,
        name: item.nameEn,
        quantity: item.quantity,
        price: item.unitPrice * item.quantity,
      }))
    );
    recordVoiceReview(extractedItems.map(item => ({rawText:item.nameAr, suggestedMatch:item.nameEn, confidence:item.confidence, acceptedQuantity:item.quantity, accepted:item.status === 'accepted'})));
    setVoiceState('added');
  };

  const totalCartCount = mobileCart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = mobileCart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="w-full min-h-[calc(100vh-76px)] bg-[#eef2f6] p-2 sm:p-6 flex flex-col items-center justify-start font-sans">
      {/* Simulation Notice Banner */}
      <div className="max-w-md w-full mb-3 bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex items-center justify-between text-xs text-amber-800 shadow-2xs">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Mobile Preview:</strong> Egyptian Arabic Voice Order Simulator (Mock Flow)
          </span>
        </div>
        <span className="text-[10px] uppercase font-bold bg-amber-200/60 px-1.5 py-0.5 rounded">
          Simulation
        </span>
      </div>

      {/* Mobile Device Frame */}
      <div className="w-full max-w-[420px] bg-[#f8fafc] rounded-3xl shadow-2xl border-4 border-slate-700/80 overflow-hidden flex flex-col min-h-[760px] relative">
        {/* Device Status Bar */}
        <div className="w-full bg-[#0052b4] text-white text-[11px] px-6 pt-2 pb-1 flex items-center justify-between font-mono select-none">
          <span>9:41</span>
          <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto" />
          <div className="flex items-center gap-1.5 text-[10px]">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Mobile App Header matching Screenshot 7 */}
        <div className="w-full bg-[#0052b4] text-white px-5 pt-3 pb-8 flex items-center justify-between relative shadow-md">
          {/* Hamburger Menu (Left) */}
          <button
            type="button"
            className="p-1 text-white hover:bg-white/10 rounded-lg transition"
            title="القائمة الرئيسية"
            onClick={() => setPanel('menu')}
          >
            <Menu className="w-7 h-7" />
          </button>

          <ClusterLogo className="!w-[105px] !h-[32px] [&_img]:!h-[32px]" />
          {/* Right Icons: Pocket/Notification & Cart */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="p-1 text-white hover:bg-white/10 rounded-lg transition relative"
              title="الإشعارات"
              onClick={() => setPanel('notifications')}
            >
              <Bell className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={() => setShowCartDrawer(true)}
              className="p-1 text-white hover:bg-white/10 rounded-lg transition relative"
              title="سلة المشتريات"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-[#ff2a5f] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Floating Pill Search Bar Overlapping Header matching Screenshot 7 */}
        <div className="px-5 -mt-5 z-10">
          <div className="w-full bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center px-4 py-3 gap-3">
            <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="ابحث عن دواء..."
              aria-label="Search pharmacy products"
              value={search}
              onChange={event => setSearch(event.target.value)}
              className="w-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none bg-transparent"
            />
          </div>
        </div>

        {/* App Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-arabic" dir="rtl">
          {/* Voice Order Hero Banner matching Screenshot 7 */}
          <div className="relative rounded-2xl bg-gradient-to-r from-[#003980] via-[#0054b4] to-[#007cd8] text-white p-4 shadow-lg overflow-hidden border border-blue-400/20">
            {/* Background sparkle accents */}
            <div className="absolute top-2 right-2 text-cyan-300 opacity-60">
              <Sparkles className="w-4 h-4" />
            </div>

            <div className="flex items-center justify-between gap-3">
              {/* Left Side (in RTL): Mascot Illustration / Pharmacist Avatar */}
              <div className="w-32 h-32 relative flex-shrink-0 flex items-center justify-center">
                {/* Real photo fallback / mascot graphics */}
                <div className="w-28 h-28 rounded-full bg-sky-400/20 p-1 flex items-center justify-center relative">
                  {/* Stylized Clara Pharmacist Mascot SVG */}
                  <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-md">
                    <circle cx="50" cy="45" r="35" fill="#38bdf8" />
                    {/* Glasses */}
                    <rect x="25" y="32" width="22" height="16" rx="4" fill="none" stroke="#facc15" strokeWidth="3" />
                    <rect x="53" y="32" width="22" height="16" rx="4" fill="none" stroke="#facc15" strokeWidth="3" />
                    <line x1="47" y1="40" x2="53" y2="40" stroke="#facc15" strokeWidth="3" />
                    {/* Eyes */}
                    <circle cx="36" cy="40" r="3" fill="#ffffff" />
                    <circle cx="64" cy="40" r="3" fill="#ffffff" />
                    {/* Smile */}
                    <path d="M40 56 Q50 66 60 56" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
                    {/* White Lab Coat */}
                    <path d="M22 80 L35 60 L65 60 L78 80 Z" fill="#ffffff" />
                    {/* Microphone */}
                    <rect x="18" y="55" width="10" height="20" rx="5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="23" y1="75" x2="23" y2="85" stroke="#475569" strokeWidth="2" />
                    {/* Thumbs up badge */}
                    <circle cx="78" cy="65" r="10" fill="#facc15" />
                    <path d="M75 65 L77 68 L82 62" stroke="#000000" strokeWidth="2" fill="none" />
                  </svg>
                </div>
              </div>

              {/* Right Side (in RTL): Headline, Subtitle, and Action Button */}
              <div className="flex-1 flex flex-col items-start text-right space-y-2">
                <h2 className="text-2xl font-black text-[#facc15] tracking-tight drop-shadow-sm">
                  اطلب بصوتك
                </h2>
                <p className="text-xs text-white/95 leading-relaxed font-medium">
                  قول اللي عايزه وكلارا هتلاقيهولك
                </p>

                <button
                  type="button"
                  onClick={startSimulatedRecording}
                  disabled={voiceState === 'recording' || voiceState === 'transcribing'}
                  className="mt-1 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border-2 border-white text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer backdrop-blur-xs"
                >
                  <Mic className="w-4 h-4 text-[#facc15] animate-pulse" />
                  <span>ابدأ التسجيل</span>
                </button>
              </div>
            </div>

            {/* Carousel Indicators matching Screenshot 7 */}
            <div className="flex items-center justify-center gap-1.5 mt-3">
              <span className="w-2 h-2 rounded-full bg-white/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#0083cb] ring-1 ring-white/60" />
            </div>
          </div>

          <section className="space-y-3">
            <div className="flex flex-wrap gap-2">{['all',...new Set(MOBILE_CATALOGUE.map(product => product.category))].map(value => <button key={value} onClick={() => setCategory(value)} className={`text-[10px] rounded-full px-3 py-2 border ${category === value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-600'}`}>{value === 'all' ? 'كل الأقسام' : value}</button>)}</div>
            <div className="space-y-2">{visibleProducts.map(product => <div key={product.id} className="bg-white rounded-xl border p-3 flex items-center justify-between gap-2 text-xs"><div><strong>{product.nameAr}</strong><p dir="ltr" className="text-[10px] text-slate-400 mt-1">{product.name}</p><p className="text-blue-600 mt-1">{product.price.toFixed(2)} ج.م / عبوة</p></div><button aria-label={`Add ${product.name}`} onClick={() => addToMobileCart([{id:crypto.randomUUID(),name:product.name,quantity:1,price:product.price}])} className="p-2 bg-sky-50 text-sky-600 rounded-lg"><Plus size={16}/></button></div>)}{!visibleProducts.length && <p className="p-4 text-center text-xs text-slate-400">لا توجد منتجات مطابقة للبحث</p>}</div>
          </section>

          {/* Pharmacist Quick Reorder Recommendations */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                توقعات كلارا لنواقص الصيدلية
              </span>
              <span className="text-[10px] bg-blue-200/70 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                منطقة مدينة نصر
              </span>
            </div>
            <p className="text-[11px] text-blue-700 leading-tight">
              بناءً على طلبات حي مدينة نصر هذا الأسبوع، يُتوقع نقص في <strong>Concor 5mg</strong> و <strong>Cataflam 50mg</strong>.
            </p>
          </div>
        </div>

        {panel && <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4"><section role="dialog" aria-modal="true" aria-label="Pharmacy app panel" dir="rtl" className="bg-white w-full max-w-[420px] rounded-2xl p-5 max-h-[85dvh] overflow-auto text-sm"><div className="flex justify-between mb-4"><strong>{({menu:'القائمة',notifications:'الإشعارات',orders:'الطلبيات التجريبية',suppliers:'الموردين',profile:'حساب الصيدلية'})[panel]}</strong><button aria-label="Close pharmacy panel" onClick={() => setPanel(null)}><X size={18}/></button></div>
          {panel === 'menu' && <div className="grid gap-2">{(['orders','suppliers','profile'] as const).map(value => <button className="p-3 bg-sky-50 rounded text-right" key={value} onClick={() => setPanel(value)}>{({orders:'الطلبيات',suppliers:'الموردين',profile:'حسابي'})[value]}</button>)}</div>}
          {panel === 'notifications' && <p className="bg-sky-50 p-3 rounded">كلارا جاهزة لمراجعة الطلبات الصوتية. جميع الإشعارات والبيانات تجريبية.</p>}
          {panel === 'orders' && orders.map(order => <div className="border rounded p-3 mb-2" key={order.id}><strong dir="ltr">{order.id}</strong><p className="text-xs text-slate-500 mt-1">{order.status} · {order.total.toFixed(2)} ج.م</p></div>)}
          {panel === 'suppliers' && suppliers.map(supplier => <div className="border rounded p-3 mb-2" key={supplier.id}><strong>{supplier.nameAr}</strong><p className="text-xs text-slate-500 mt-1">{supplier.warehouseCity} · {supplier.catalogueItemCount} منتج</p></div>)}
          {panel === 'profile' && <div className="space-y-2"><p>صيدلية تجريبية · مدينة نصر</p><p className="text-xs text-slate-500">حساب صيدلي للمراجعة والشراء التجريبي</p><span className="text-xs text-blue-600">Demo · Mock data</span></div>}
        </section></div>}

        {/* Bottom Navigation Bar */}
        <div className="w-full bg-white border-t border-slate-200 px-6 py-2 flex items-center justify-between text-slate-400 z-10">
          <button onClick={() => {setSearch(''); setCategory('all'); setPanel(null);}} className="flex flex-col items-center text-[#0066cc] font-bold text-[10px]">
            <span className="text-lg">🏠</span>
            <span>الرئيسية</span>
          </button>
          <button onClick={() => setPanel('orders')} className="flex flex-col items-center hover:text-[#0066cc] text-[10px]">
            <span className="text-lg">📋</span>
            <span>الطلبيات</span>
          </button>
          <button
            onClick={startSimulatedRecording}
            className="w-12 h-12 -mt-5 rounded-full bg-gradient-to-r from-[#0052b4] to-[#009ee3] text-white flex items-center justify-center shadow-lg hover:scale-105 transition"
            title="تسجيل صوتي"
          >
            <Mic className="w-6 h-6" />
          </button>
          <button onClick={() => setPanel('suppliers')} className="flex flex-col items-center hover:text-[#0066cc] text-[10px]">
            <span className="text-lg">📦</span>
            <span>الموردين</span>
          </button>
          <button onClick={() => setPanel('profile')} className="flex flex-col items-center hover:text-[#0066cc] text-[10px]">
            <span className="text-lg">👤</span>
            <span>حسابي</span>
          </button>
        </div>

        {/* Interactive Voice Flow Bottom Sheet / Modal */}
        {voiceState !== 'idle' && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex flex-col justify-end">
            <div className="bg-white rounded-t-3xl p-5 shadow-2xl space-y-4 max-h-[85%] overflow-y-auto animate-slideUp font-arabic" dir="rtl">
              {/* Sheet Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-sky-100 text-[#0083cb] flex items-center justify-center font-bold">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      طلب صوتي ذكي عبر كلارا
                    </h3>
                    <span className="text-[10px] text-amber-600 font-semibold block">
                      محاكاة تفاعلية (Simulation Mode)
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={cancelRecording}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* State 1: Recording Animation */}
              {voiceState === 'recording' && (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-[#0083cb] text-white flex items-center justify-center animate-pulse shadow-xl">
                      <Mic className="w-10 h-10" />
                    </div>
                    <div className="absolute inset-0 rounded-full border-4 border-[#0083cb] animate-ping opacity-30" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      جاري الاستماع لصوتك بالعامية المصرية...
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      "محتاج خمس علب بنادول اكسترا و اتنين كتافلام 50 و علبة كونكور 5"
                    </p>
                  </div>
                </div>
              )}

              {/* State 2: Transcribing Animation */}
              {voiceState === 'transcribing' && (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                  <Sparkles className="w-10 h-10 text-[#0083cb] animate-spin" />
                  <h4 className="font-bold text-slate-800 text-sm">
                    كلارا تقوم باستخراج الأدوية ومطابقة الجرعات...
                  </h4>
                  <p className="text-xs text-slate-400">
                    نموذج Arabic Pharma-Match (Fine-tuned Jina-v3)
                  </p>
                </div>
              )}

              {/* State 3: Pharmacist Review & Decision Gate */}
              {voiceState === 'review' && (
                <div className="space-y-3">
                  <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-900">
                    <span className="font-bold block mb-0.5">النص الصوتي المُلتقط:</span>
                    <span className="italic">"محتاج خمس علب بنادول اكسترا و اتنين كتافلام 50 و علبة واحدة كونكور 5"</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-slate-700">الأدوية المستخرجة (راجع قبل الإضافة):</span>
                    <span className="text-[10px] text-emerald-600 font-bold">100% قرار صيدلي</span>
                  </div>

                  <div className="space-y-2">
                    {extractedItems.map((item) => {
                      const isAccepted = item.status === 'accepted';

                      return (
                        <div
                          key={item.id}
                          className={`p-3 rounded-xl border transition ${
                            isAccepted
                              ? 'bg-white border-slate-200 shadow-2xs'
                              : 'bg-slate-50 border-slate-200 opacity-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h5 className="font-bold text-slate-800 text-xs leading-snug">
                                {item.nameAr}
                              </h5>
                              <div className="text-[10px] text-slate-500 font-sans mt-0.5" dir="ltr">
                                {item.nameEn}
                              </div>
                              <div className="text-[11px] font-bold text-[#0083cb] mt-1">
                                {item.unitPrice} ج.م / علبة
                              </div>
                            </div>

                            {/* Accept / Reject toggle */}
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(item.id)}
                              className={`p-1.5 rounded-lg border text-xs font-bold transition ${
                                isAccepted
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                                  : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                              }`}
                              title={isAccepted ? 'استبعاد هذا الدواء' : 'قبول هذا الدواء'}
                            >
                              {isAccepted ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                            </button>
                          </div>

                          {/* Quantity control */}
                          {isAccepted && (
                            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                              <span className="text-slate-500 text-[11px]">الكمية المطلوبة:</span>
                              <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-0.5">
                                <button
                                  type="button"
                                  aria-label={`Decrease ${item.nameEn} quantity`}
                                  onClick={() => handleQuantityChange(item.id, -1)}
                                  className="w-6 h-6 rounded bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center font-bold"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center font-bold text-slate-800 font-mono">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  aria-label={`Increase ${item.nameEn} quantity`}
                                  onClick={() => handleQuantityChange(item.id, 1)}
                                  className="w-6 h-6 rounded bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center font-bold"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={handleCommitVoiceOrder}
                    className="w-full py-3 rounded-xl bg-[#0066cc] hover:bg-[#0055b3] text-white font-bold text-xs shadow-lg transition active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>إضافة الأدوية المقبولة إلى السلة</span>
                  </button>
                </div>
              )}

              {/* State 4: Success confirmation */}
              {voiceState === 'added' && (
                <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">
                    تمت إضافة الطلبية المقبولة إلى سلة الشراء بنجاح!
                  </h4>
                  <p className="text-xs text-slate-500">
                    يمكنك استكمال الطلب أو تكرار التسجيل الصوتي.
                  </p>
                  <div className="flex items-center gap-2 pt-2 w-full">
                    <button
                      type="button"
                      onClick={cancelRecording}
                      className="flex-1 py-2 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                    >
                      إغلاق
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setVoiceState('idle');
                        setShowCartDrawer(true);
                      }}
                      className="flex-1 py-2 text-xs font-semibold bg-[#0066cc] text-white rounded-lg hover:bg-[#0055b3]"
                    >
                      عرض السلة
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cart Drawer */}
        {showCartDrawer && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex flex-col justify-end">
            <div className="bg-white rounded-t-3xl p-5 shadow-2xl space-y-4 max-h-[85%] overflow-y-auto animate-slideUp font-arabic" dir="rtl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#0083cb]" />
                  <h3 className="text-sm font-bold text-slate-800">
                    سلة مشتريات الصيدلية ({totalCartCount} صنف)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCartDrawer(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {mobileCart.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  السلة فارغة حالياً. استخدم الطلب الصوتي لإضافة أدوية.
                </div>
              ) : (
                <div className="space-y-2">
                  {mobileCart.map((item) => (
                    <div key={item.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-800">{item.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          الكمية: {item.quantity} علبة
                        </div>
                      </div>
                      <div className="font-bold text-slate-900">
                        {item.price.toFixed(2)} ج.م
                      </div>
                    </div>
                  ))}

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between font-bold text-sm text-slate-900">
                    <span>الإجمالي المقدر:</span>
                    <span className="text-[#0066cc] font-mono">{totalCartPrice.toFixed(2)} ج.م</span>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={clearMobileCart}
                      className="px-3 py-2 text-xs font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl flex items-center gap-1 border border-rose-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>تفريغ</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOrders(rows => [{id:`DEMO-${Date.now().toString().slice(-6)}`,total:totalCartPrice,status:'قيد التجهيز'},...rows]);
                        showToast('success', 'Demo order created', 'Saved a simulated pharmacy order.');
                        clearMobileCart();
                        setShowCartDrawer(false);
                      }}
                      className="flex-1 py-2 text-xs font-bold bg-[#0066cc] text-white hover:bg-[#0055b3] rounded-xl shadow-md"
                    >
                      تأكيد طلب تجريبي
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
