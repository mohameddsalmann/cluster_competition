import React, { useState, useEffect, useRef } from 'react';
import { DemoDataProvider } from './context/DemoDataContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';

// Page components
import { MedicineMappingsPage } from './pages/MedicineMappingsPage';
import { MedicineCorrectionsPage } from './pages/MedicineCorrectionsPage';
import { MedicineMappingLogsPage } from './pages/MedicineMappingLogsPage';
import { ExtractedMedicineLogsPage } from './pages/ExtractedMedicineLogsPage';
import { ErrorLogsPage } from './pages/ErrorLogsPage';
import { RolesPermissionsPage } from './pages/RolesPermissionsPage';
import { MobilePharmacyHome } from './pages/MobilePharmacyHome';
import { AiModelsSystemCardsPage } from './pages/AiModelsSystemCardsPage';
import { DataUsageRetentionPage } from './pages/DataUsageRetentionPage';
import { AiGovernancePage } from './pages/AiGovernancePage';
import { MonitoringFeedbackPage } from './pages/MonitoringFeedbackPage';
import { ResponsibleAiShowcasePage } from './pages/ResponsibleAiShowcasePage';
import { SupplierStoresPage } from './pages/SupplierStoresPage';
import { PortalPage } from './pages/PortalPage';
import { StakeholderDirectoriesPage } from './pages/StakeholderDirectoriesPage';

export const AppContent: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const screens = ['dashboard','suppliers','pharmacies','orders','deal_orders','order_packages','faqs','string_processor','areas','mappings', 'corrections', 'mapping_logs', 'extracted_logs', 'error_logs', 'roles', 'mobile_pharmacy', 'ai_models', 'data_retention', 'governance', 'monitoring', 'showcase', 'directories'];
  const fromHash = () => { const key = window.location.hash.slice(1); return screens.includes(key) ? key : 'suppliers'; };
  const [activeScreen, setScreen] = useState(fromHash);
  const setActiveScreen = (screen: string) => { setScreen(screen); window.location.hash = screen; };
  useEffect(() => {
    const onHashChange = () => setScreen(fromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => { mainRef.current?.scrollTo({top:0}); }, [activeScreen]);

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'suppliers': return <SupplierStoresPage />;
      case 'pharmacies': return <StakeholderDirectoriesPage title="Pharmacies" />;
      case 'dashboard': case 'orders': case 'deal_orders': case 'order_packages': case 'faqs': case 'string_processor': case 'areas': return <PortalPage screen={activeScreen} onNavigate={setActiveScreen} />;
      case 'mappings':
        return <MedicineMappingsPage onNavigateToLogs={() => setActiveScreen('mapping_logs')} />;
      case 'corrections':
        return <MedicineCorrectionsPage />;
      case 'mapping_logs':
        return <MedicineMappingLogsPage />;
      case 'extracted_logs':
        return <ExtractedMedicineLogsPage />;
      case 'error_logs':
        return <ErrorLogsPage />;
      case 'roles':
        return <RolesPermissionsPage />;
      case 'mobile_pharmacy':
        return <MobilePharmacyHome />;
      case 'ai_models':
        return <AiModelsSystemCardsPage />;
      case 'data_retention':
        return <DataUsageRetentionPage />;
      case 'governance':
        return <AiGovernancePage />;
      case 'monitoring':
        return <MonitoringFeedbackPage />;
      case 'showcase':
        return <ResponsibleAiShowcasePage onNavigateToScreen={(screen) => setActiveScreen(screen)} />;
      case 'directories':
        return <StakeholderDirectoriesPage />;
      default:
        return <MedicineMappingsPage onNavigateToLogs={() => setActiveScreen('mapping_logs')} />;
    }
  };

  return (
    <div className="h-dvh overflow-hidden bg-[#f6f8fa] flex antialiased">
      {sidebarOpen && <button aria-label="Close navigation overlay" onClick={() => setSidebarOpen(false)} className="md:hidden fixed inset-0 bg-slate-900/40 z-30" />}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
        <main ref={mainRef} className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden relative bg-[#f6f8fa]">
          {['ai_models','data_retention','governance','monitoring','showcase'].includes(activeScreen) && <div className="bg-blue-50 border-b border-blue-100 px-4 sm:px-6 py-2 text-[11px] text-blue-800">Illustrative demo: policies, owners, review history and operational metrics are sample records. The documented matching-model evaluation is identified separately.</div>}
          <div key={activeScreen}>{renderActiveScreen()}</div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <DemoDataProvider>
      <AppContent />
    </DemoDataProvider>
  );
}
