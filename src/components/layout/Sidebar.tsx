import React from 'react';
import { ClusterLogo } from '../common/ClusterLogo';
import {
  Layers,
  Sliders,
  History,
  Mic,
  Bug,
  ShieldCheck,
  Smartphone,
  Cpu,
  Database,
  Scale,
  Activity,
  Award,
  Building2,
} from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  labelAr?: string;
  icon: React.ElementType;
  section: 'core' | 'mobile' | 'rai' | 'stakeholders';
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  activeScreen,
  setActiveScreen,
  setSidebarOpen,
}) => {
  const navItems: NavItem[] = [
    // 1. Existing Screens from Screenshots
    {
      id: 'mappings',
      label: 'Medicine Mappings',
      labelAr: 'ربط الأدوية',
      icon: Layers,
      section: 'core',
    },
    {
      id: 'corrections',
      label: 'Medicine Corrections',
      labelAr: 'تصحيح ربط الأدوية',
      icon: Sliders,
      section: 'core',
    },
    {
      id: 'mapping_logs',
      label: 'Medicine Mapping Logs',
      labelAr: 'سجلات تعديل الربط',
      icon: History,
      section: 'core',
    },
    {
      id: 'extracted_logs',
      label: 'Extracted Medicine Logs',
      labelAr: 'سجلات استخراج الأدوية',
      icon: Mic,
      section: 'core',
    },
    {
      id: 'error_logs',
      label: 'Error Logs',
      labelAr: 'سجلات الأخطاء',
      icon: Bug,
      section: 'core',
    },
    {
      id: 'roles',
      label: 'Roles and Permissions',
      labelAr: 'الأدوار والصلاحيات',
      icon: ShieldCheck,
      section: 'core',
    },

    // 2. Mobile View
    {
      id: 'mobile_pharmacy',
      label: 'Mobile Pharmacy Home',
      labelAr: 'واجهة الصيدلية المحمولة',
      icon: Smartphone,
      section: 'mobile',
      badge: 'Voice AI',
    },

    // 3. Additional RAI Pages from Competition Feedback
    {
      id: 'ai_models',
      label: 'AI Models & Clara Cards',
      labelAr: 'بطاقات النماذج وكلارا',
      icon: Cpu,
      section: 'rai',
    },
    {
      id: 'data_retention',
      label: 'Data Usage & Retention',
      labelAr: 'استخدام البيانات والاحتفاظ',
      icon: Database,
      section: 'rai',
    },
    {
      id: 'governance',
      label: 'AI Governance & RACI',
      labelAr: 'الحوكمة والمسؤولية',
      icon: Scale,
      section: 'rai',
    },
    {
      id: 'monitoring',
      label: 'Monitoring & Feedback',
      labelAr: 'المراقبة وحلقة التغذية',
      icon: Activity,
      section: 'rai',
    },
    {
      id: 'showcase',
      label: 'Responsible AI Showcase',
      labelAr: 'حالات التميز المسؤولة',
      icon: Award,
      section: 'rai',
    },

    // 4. Multi-stakeholder Directories
    {
      id: 'directories',
      label: 'Stakeholder Directories',
      labelAr: 'دليل الشركاء والموردين',
      icon: Building2,
      section: 'stakeholders',
    },
  ];

  return (
    <aside
      className={`bg-[#154b9e] text-white flex flex-col transition-all duration-300 z-20 flex-shrink-0 select-none shadow-xl ${
        sidebarOpen ? 'w-64 absolute inset-y-0 left-0 md:relative' : 'w-14 sm:w-16'
      }`}
    >
      <div className="h-[72px] border-b border-white/15 flex items-center justify-center px-3 overflow-hidden shrink-0">
        <ClusterLogo compact={!sidebarOpen} />
      </div>

      {/* Navigation list */}
      <nav className="flex-1 overflow-y-auto py-2 px-1.5 space-y-1">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;

          // Section divider lines if sidebar is open
          const isFirstOfSection =
            sidebarOpen &&
            (index === 0 || navItems[index - 1].section !== item.section);

          let sectionLabel = '';
          if (isFirstOfSection) {
            if (item.section === 'core') sectionLabel = 'CATALOGUE OPERATIONS';
            if (item.section === 'mobile') sectionLabel = 'MOBILE EXPERIENCE';
            if (item.section === 'rai') sectionLabel = 'RESPONSIBLE AI';
            if (item.section === 'stakeholders') sectionLabel = 'ECOSYSTEM';
          }

          return (
            <React.Fragment key={item.id}>
              {isFirstOfSection && (
                <div className="pt-3 pb-1 px-2.5">
                  <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    {sectionLabel}
                  </p>
                </div>
              )}
              <button
                onClick={() => { setActiveScreen(item.id); if (window.innerWidth < 768) setSidebarOpen(false); }}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                title={!sidebarOpen ? `${item.label} (${item.labelAr})` : undefined}
                className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-md transition-all duration-150 relative group text-left ${
                  isActive
                    ? 'bg-[#0083cb] text-white shadow-md font-medium'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {/* Active Cyan left-bar accent if collapsed */}
                {isActive && !sidebarOpen && (
                  <div className="absolute left-0 top-1 bottom-1 w-1 bg-cyan-400 rounded-r" />
                )}

                <div className="flex-shrink-0 flex items-center justify-center w-6 h-6">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`} />
                </div>

                {sidebarOpen && (
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <span className="text-xs truncate tracking-tight">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ml-1.5 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-[#184470] text-cyan-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Footer info in sidebar */}
      {sidebarOpen && (
        <div className="p-3 border-t border-[#14365b] bg-[#10418c] text-[11px] text-slate-400">
          <div className="flex items-center justify-between">
            <span>Cluster RAI Demo</span>
            <span className="text-cyan-400 font-mono">v1.0</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Egyptian Pharmaceutical ERP
          </div>
        </div>
      )}
    </aside>
  );
};
