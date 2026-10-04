import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MedicineMapping,
  MedicineCorrection,
  MedicineMappingLog,
  ExtractedMedicineLog,
  ErrorLog,
  RoleDefinition,
  WeeklyQualityReport,
  FeedbackRecord,
  PartnerDirectoryItem,
  PharmacyDirectoryItem,
  SupplierDirectoryItem,
  CustomerDirectoryItem,
} from '../types';
import {
  INITIAL_MEDICINE_MAPPINGS,
  INITIAL_MEDICINE_CORRECTIONS,
  INITIAL_MAPPING_LOGS,
  INITIAL_EXTRACTED_LOGS,
  INITIAL_ERROR_LOGS,
  INITIAL_ROLE_DEFINITIONS,
  WEEKLY_QUALITY_REPORTS,
  INITIAL_FEEDBACK_RECORDS,
  INITIAL_PARTNERS_DIRECTORY,
  INITIAL_PHARMACIES_DIRECTORY,
  INITIAL_SUPPLIERS_DIRECTORY,
  INITIAL_CUSTOMERS_DIRECTORY,
} from '../data/mockData';

export type DirectoryKind = 'pharmacies' | 'suppliers' | 'customers' | 'partners';
export type DirectoryRecord = PharmacyDirectoryItem | SupplierDirectoryItem | CustomerDirectoryItem | PartnerDirectoryItem;

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

export interface MobileCartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface DemoDataContextType {
  // Medicine Mappings
  mappings: MedicineMapping[];
  acceptMapping: (id: string) => void;
  acceptAllVisibleMappings: (ids: string[]) => void;
  updateMappingSelection: (id: string, newMapping: string) => void;
  toggleCosmetics: (id: string) => void;
  deleteSelectedMappings: (ids: string[]) => void;

  // Medicine Corrections
  corrections: MedicineCorrection[];
  updateCorrection: (id: string, newCurrentMapping: string) => void;
  bulkRemoveCorrections: (ids: string[]) => void;
  bulkUnlinkCorrections: (ids: string[]) => void;

  // Mapping Logs
  mappingLogs: MedicineMappingLog[];
  addMappingLog: (log: Omit<MedicineMappingLog, 'id' | 'orderNumber' | 'changedAt'>) => void;

  // Extracted Logs
  extractedLogs: ExtractedMedicineLog[];
  updateExtractedLogReview: (id: string, status: ExtractedMedicineLog['reviewStatus'], notes?: string) => void;

  recordVoiceReview: (items: Array<{rawText: string; suggestedMatch: string; confidence: number; acceptedQuantity: number; accepted: boolean}>) => void;

  // Error Logs
  errorLogs: ErrorLog[];
  resolveError: (id: string) => void;
  unresolveError: (id: string) => void;

  // Roles & Permissions
  roles: RoleDefinition[];
  updateRolePermissions: (roleId: string, updatedGroups: RoleDefinition['groups']) => void;

  // Quality & Feedback
  weeklyReports: WeeklyQualityReport[];
  feedbackRecords: FeedbackRecord[];
  addFeedbackRecord: (record: Omit<FeedbackRecord, 'id' | 'reportedDate'>) => void;
  updateFeedbackStatus: (id: string, newStatus: FeedbackRecord['status']) => void;

  // Governance Release Pause State
  isReleasePaused: boolean;
  toggleReleasePause: () => void;

  // Mobile Voice Order & Cart
  mobileCart: MobileCartItem[];
  addToMobileCart: (items: MobileCartItem[]) => void;
  clearMobileCart: () => void;

  // Directories
  pharmacies: PharmacyDirectoryItem[];
  suppliers: SupplierDirectoryItem[];
  customers: CustomerDirectoryItem[];
  partners: PartnerDirectoryItem[];
  addPartner: (partner: Omit<PartnerDirectoryItem, 'id'>) => void;

  saveDirectoryRecord: (kind: DirectoryKind, record: DirectoryRecord) => void;

  // Global State Helpers
  toasts: ToastMessage[];
  showToast: (type: ToastMessage['type'], title: string, message: string) => void;
  dismissToast: (id: string) => void;
  resetDemoData: () => void;
}

const DemoDataContext = createContext<DemoDataContextType | undefined>(undefined);

const STORAGE_KEY = 'cluster_demo_state_v1';
function readSaved(key: string): unknown {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : null; }
  catch { return null; }
}
function persist(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Continue in memory if storage is unavailable. */ }
}

export const DemoDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mappings, setMappings] = useState<MedicineMapping[]>(() => {
    const saved = readSaved(`${STORAGE_KEY}_mappings`);
    return Array.isArray(saved) ? saved : INITIAL_MEDICINE_MAPPINGS;
  });

  const [corrections, setCorrections] = useState<MedicineCorrection[]>(() => {
    const saved = readSaved(`${STORAGE_KEY}_corrections`);
    return Array.isArray(saved) ? saved : INITIAL_MEDICINE_CORRECTIONS;
  });

  const [mappingLogs, setMappingLogs] = useState<MedicineMappingLog[]>(() => {
    const saved = readSaved(`${STORAGE_KEY}_mappingLogs`);
    return Array.isArray(saved) ? saved : INITIAL_MAPPING_LOGS;
  });

  const [extractedLogs, setExtractedLogs] = useState<ExtractedMedicineLog[]>(() => {
    const saved = readSaved(`${STORAGE_KEY}_extractedLogs`);
    return Array.isArray(saved) ? saved : INITIAL_EXTRACTED_LOGS;
  });

  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>(() => {
    const saved = readSaved(`${STORAGE_KEY}_errorLogs`);
    return Array.isArray(saved) ? saved : INITIAL_ERROR_LOGS;
  });

  const [roles, setRoles] = useState<RoleDefinition[]>(() => {
    const saved = readSaved(`${STORAGE_KEY}_roles`);
    return Array.isArray(saved) ? saved : INITIAL_ROLE_DEFINITIONS;
  });

  const [feedbackRecords, setFeedbackRecords] = useState<FeedbackRecord[]>(() => {
    const saved = readSaved(`${STORAGE_KEY}_feedback`);
    return Array.isArray(saved) ? saved : INITIAL_FEEDBACK_RECORDS;
  });

  const [partners, setPartners] = useState<PartnerDirectoryItem[]>(() => {
    const saved = readSaved(`${STORAGE_KEY}_partners`);
    return Array.isArray(saved) ? saved : INITIAL_PARTNERS_DIRECTORY;
  });

  const [pharmacies, setPharmacies] = useState<PharmacyDirectoryItem[]>(() => {
    const saved = readSaved(`${STORAGE_KEY}_pharmacies`);
    return Array.isArray(saved) ? saved : INITIAL_PHARMACIES_DIRECTORY;
  });
  const [suppliers, setSuppliers] = useState<SupplierDirectoryItem[]>(() => {
    const saved = readSaved(`${STORAGE_KEY}_suppliers`);
    return Array.isArray(saved) ? saved : INITIAL_SUPPLIERS_DIRECTORY;
  });
  const [customers, setCustomers] = useState<CustomerDirectoryItem[]>(() => {
    const saved = readSaved(`${STORAGE_KEY}_customers`);
    return Array.isArray(saved) ? saved : INITIAL_CUSTOMERS_DIRECTORY;
  });
  useEffect(() => persist(`${STORAGE_KEY}_pharmacies`, pharmacies), [pharmacies]);
  useEffect(() => persist(`${STORAGE_KEY}_suppliers`, suppliers), [suppliers]);
  useEffect(() => persist(`${STORAGE_KEY}_customers`, customers), [customers]);

  const [isReleasePaused, setIsReleasePaused] = useState<boolean>(() => {
    const saved = readSaved(`${STORAGE_KEY}_releasePaused`);
    return typeof saved === 'boolean' ? saved : false;
  });

  const [mobileCart, setMobileCart] = useState<MobileCartItem[]>(() => {
    const saved = readSaved(`${STORAGE_KEY}_mobileCart`);
    return Array.isArray(saved) ? saved : [
      { id: 'cart-1', name: 'Panadol Extra 24 Tablets', quantity: 2, price: 96.0 },
    ];
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    persist(`${STORAGE_KEY}_mappings`, mappings);
  }, [mappings]);

  useEffect(() => {
    persist(`${STORAGE_KEY}_corrections`, corrections);
  }, [corrections]);

  useEffect(() => {
    persist(`${STORAGE_KEY}_mappingLogs`, mappingLogs);
  }, [mappingLogs]);

  useEffect(() => {
    persist(`${STORAGE_KEY}_extractedLogs`, extractedLogs);
  }, [extractedLogs]);

  useEffect(() => {
    persist(`${STORAGE_KEY}_errorLogs`, errorLogs);
  }, [errorLogs]);

  useEffect(() => {
    persist(`${STORAGE_KEY}_roles`, roles);
  }, [roles]);

  useEffect(() => {
    persist(`${STORAGE_KEY}_feedback`, feedbackRecords);
  }, [feedbackRecords]);

  useEffect(() => {
    persist(`${STORAGE_KEY}_partners`, partners);
  }, [partners]);

  useEffect(() => {
    persist(`${STORAGE_KEY}_releasePaused`, isReleasePaused);
  }, [isReleasePaused]);

  useEffect(() => {
    persist(`${STORAGE_KEY}_mobileCart`, mobileCart);
  }, [mobileCart]);

  const showToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Medicine Mappings Handlers
  const acceptMapping = (id: string) => {
    const item = mappings.find((m) => m.id === id);
    if (!item || item.status !== 'pending') return;

    setMappings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'accepted' } : m))
    );

    // Create log record
    const newLog: MedicineMappingLog = {
      id: `log-${Date.now()}`,
      orderNumber: mappingLogs.length + 1,
      supplierMedicine: item.supplierMedicineName,
      supplierMedicineCode: `#${Math.floor(1000000 + Math.random() * 900000)}`,
      supplier: item.supplier,
      oldMedicine: item.topSuggestedMedicine,
      oldMedicineCode: `#${Math.floor(10000 + Math.random() * 90000)}`,
      newMedicine: item.selectedMapping,
      newMedicineCode: `#${Math.floor(10000 + Math.random() * 90000)}`,
      changeType: 'Remapped',
      changeDescription: `Mapping confirmed for ${item.selectedMapping}`,
      changedBy: 'Dr. Heba Admin',
      changedByRole: 'Admin',
      changedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      reason: 'Pharmacist manual confirmation from mapping interface',
    };

    setMappingLogs((prev) => [newLog, ...prev]);
    showToast('success', 'Mapping Accepted', `Confirmed: ${item.selectedMapping} for ${item.supplier}`);
  };

  const acceptAllVisibleMappings = (ids: string[]) => {
    const pendingItems = mappings.filter((m) => ids.includes(m.id) && m.status === 'pending');
    if (pendingItems.length === 0) {
      showToast('info', 'No Pending Mappings', 'All visible mappings have already been accepted.');
      return;
    }

    setMappings((prev) => prev.map((m) => (ids.includes(m.id) && m.status === 'pending' ? { ...m, status: 'accepted' } : m)));

    // Create bulk log entries
    const newLogs: MedicineMappingLog[] = pendingItems.map((item, idx) => ({
      id: `log-${Date.now()}-${idx}`,
      orderNumber: mappingLogs.length + idx + 1,
      supplierMedicine: item.supplierMedicineName,
      supplierMedicineCode: `#${Math.floor(1000000 + Math.random() * 900000)}`,
      supplier: item.supplier,
      oldMedicine: item.topSuggestedMedicine,
      oldMedicineCode: `#${Math.floor(10000 + Math.random() * 90000)}`,
      newMedicine: item.selectedMapping,
      newMedicineCode: `#${Math.floor(10000 + Math.random() * 90000)}`,
      changeType: 'Auto-matched',
      changeDescription: `Bulk accepted mapping confirmed by Admin`,
      changedBy: 'Dr. Heba Admin',
      changedByRole: 'Admin',
      changedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      reason: 'Bulk confirmation of visible candidate mappings',
    }));

    setMappingLogs((prev) => [...newLogs, ...prev]);
    showToast('success', 'Bulk Accepted', `Successfully accepted ${pendingItems.length} medicine mappings.`);
  };

  const updateMappingSelection = (id: string, newMapping: string) => {
    setMappings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, selectedMapping: newMapping, status: 'pending' } : m))
    );
    showToast('info', 'Selection Changed', `Updated suggested mapping to: ${newMapping}`);
  };

  const toggleCosmetics = (id: string) => {
    setMappings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isCosmetics: !m.isCosmetics } : m))
    );
  };

  const deleteSelectedMappings = (ids: string[]) => {
    setMappings((prev) => prev.filter((m) => !ids.includes(m.id)));
    showToast('warning', 'Mappings Removed', `Removed ${ids.length} supplier mapping entries.`);
  };

  // Medicine Corrections Handlers
  const updateCorrection = (id: string, newCurrentMapping: string) => {
    const target = corrections.find((c) => c.id === id);
    if (!target) return;

    setCorrections((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, currentMapping: newCurrentMapping, status: 'active', updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) } : c
      )
    );

    // Record in mapping logs
    const newLog: MedicineMappingLog = {
      id: `log-${Date.now()}`,
      orderNumber: mappingLogs.length + 1,
      supplierMedicine: target.supplierMedicineName,
      supplierMedicineCode: `#${Math.floor(1000000 + Math.random() * 900000)}`,
      supplier: target.supplier,
      oldMedicine: target.currentMapping,
      oldMedicineCode: `#${Math.floor(10000 + Math.random() * 90000)}`,
      newMedicine: newCurrentMapping,
      newMedicineCode: `#${Math.floor(10000 + Math.random() * 90000)}`,
      changeType: 'Remapped',
      changeDescription: `Corrected mapping via Correction Center`,
      changedBy: 'Dr. Heba Admin',
      changedByRole: 'Admin',
      changedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      reason: 'Discrepancy adjustment updated by administrator',
    };

    setMappingLogs((prev) => [newLog, ...prev]);
    showToast('success', 'Correction Saved', `Updated to: ${newCurrentMapping}`);
  };

  const bulkRemoveCorrections = (ids: string[]) => {
    setCorrections((prev) => prev.filter((c) => !ids.includes(c.id)));
    showToast('error', 'Bulk Removed', `Deleted ${ids.length} correction entries.`);
  };

  const bulkUnlinkCorrections = (ids: string[]) => {
    corrections.filter(c => ids.includes(c.id) && c.status !== 'unlinked').forEach(c => {
      addMappingLog({ supplierMedicine: c.supplierMedicineName, supplierMedicineCode: c.id, supplier: c.supplier,
        oldMedicine: c.currentMapping, oldMedicineCode: c.mappingId, newMedicine: 'Pending remap', newMedicineCode: '-',
        changeType: 'Unlinked', changeDescription: 'Unlinked by administrator for manual remapping', changedBy: 'Dr. Heba Admin', changedByRole: 'Admin' });
    });
    setCorrections((prev) =>
      prev.map((c) => (ids.includes(c.id) ? { ...c, status: 'unlinked', currentMapping: '[UNLINKED - PENDING REMAP]' } : c))
    );
    showToast('warning', 'Bulk Unlinked', `Unlinked ${ids.length} mappings. Supplier items returned to reconciliation queue.`);
  };

  const addMappingLog = (log: Omit<MedicineMappingLog, 'id' | 'orderNumber' | 'changedAt'>) => {
    const newEntry: MedicineMappingLog = {
      ...log,
      id: `log-${Date.now()}`,
      orderNumber: mappingLogs.length + 1,
      changedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setMappingLogs((prev) => [newEntry, ...prev]);
  };

  // Extracted Logs Handlers
  const updateExtractedLogReview = (id: string, status: ExtractedMedicineLog['reviewStatus'], notes?: string) => {
    setExtractedLogs((prev) =>
      prev.map((log) => (log.id === id ? { ...log, reviewStatus: status, reviewerNotes: notes || log.reviewerNotes } : log))
    );
    showToast('success', 'Extraction Reviewed', `Marked Log #${id} as ${status}`);
  };

  const recordVoiceReview: DemoDataContextType['recordVoiceReview'] = (items) => {
    const id = crypto.randomUUID();
    const accepted = items.filter(item => item.accepted);
    const record: ExtractedMedicineLog = {
      id, logId: `VOICE-${Date.now()}`, type: 'Audio', pharmacy: 'Demo Pharmacy - Nasr City', pharmacyId: 'DEMO-VOICE',
      extractedMedicinesCount: items.length, matchedMedicinesCount: accepted.length,
      createdAt: new Date().toISOString().replace('T',' ').slice(0,19),
      sourceDetails: { audioDuration: '00:03 (simulated)', dialectOrFormat: 'Egyptian Arabic demo transcript', deviceType: 'Pharmacy app demo' },
      extractedItems: items.map(({accepted, ...item}) => ({...item, acceptedQuantity: accepted ? item.acceptedQuantity : 0, matchStatus: accepted ? 'matched' : 'unmatched'})),
      reviewStatus: accepted.length ? 'Verified' : 'Rejected',
      reviewerNotes: `Demo pharmacist reviewed ${items.length} items: ${accepted.length} accepted, ${items.length - accepted.length} rejected. Accepted quantities are recorded per item. No audio was recorded.`,
    };
    setExtractedLogs(rows => [record, ...rows]);
  };

  // Error Logs Handlers
  const resolveError = (id: string) => {
    setErrorLogs((prev) =>
      prev.map((err) => (err.id === id ? { ...err, status: 'resolved' } : err))
    );
    showToast('success', 'Error Resolved', `Marked issue as resolved. Stat cards recalculated.`);
  };

  const unresolveError = (id: string) => {
    setErrorLogs((prev) =>
      prev.map((err) => (err.id === id ? { ...err, status: 'unresolved' } : err))
    );
    showToast('info', 'Error Re-opened', `Moved back to unresolved list.`);
  };

  // Roles & Permissions Handlers
  const updateRolePermissions = (roleId: string, updatedGroups: RoleDefinition['groups']) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === roleId ? { ...r, groups: updatedGroups } : r))
    );
    showToast('success', 'Permissions Saved', `Role permissions successfully updated.`);
  };

  // Feedback & Reports
  const addFeedbackRecord = (record: Omit<FeedbackRecord, 'id' | 'reportedDate'>) => {
    const newEntry: FeedbackRecord = {
      ...record,
      id: `fb-${Date.now()}`,
      reportedDate: new Date().toISOString().substring(0, 10),
    };
    setFeedbackRecords((prev) => [newEntry, ...prev]);
    showToast('success', 'Feedback Registered', `Created feedback ticket ${record.ticketId}`);
  };

  const updateFeedbackStatus = (id: string, newStatus: FeedbackRecord['status']) => {
    setFeedbackRecords((prev) =>
      prev.map((fb) => (fb.id === id ? { ...fb, status: newStatus } : fb))
    );
    showToast('info', 'Status Updated', `Ticket status set to: ${newStatus}`);
  };

  const toggleReleasePause = () => {
    const next = !isReleasePaused;
    setIsReleasePaused(next);
    showToast(next ? 'warning' : 'success', next ? 'Demo release paused' : 'Demo release resumed', 'Updated the simulated governance release status.');
  };

  // Mobile Cart
  const addToMobileCart = (items: MobileCartItem[]) => {
    setMobileCart((prev) => [...prev, ...items]);
    showToast('success', 'Items Added to Cart', `Added ${items.length} medicines to pharmacy order basket.`);
  };

  const clearMobileCart = () => {
    setMobileCart([]);
    showToast('info', 'Cart Cleared', 'Pharmacy shopping cart emptied.');
  };

  // Partners
  const addPartner = (partner: Omit<PartnerDirectoryItem, 'id'>) => {
    const newEntry: PartnerDirectoryItem = {
      ...partner,
      id: `part-${Date.now()}`,
    };
    setPartners((prev) => [...prev, newEntry]);
    showToast('success', 'Partner Added', `Registered partner ${partner.partnerName}`);
  };

  const saveDirectoryRecord = (kind: DirectoryKind, record: DirectoryRecord) => {
    function upsert<T extends DirectoryRecord>(rows: T[], item: T): T[] {
      return rows.some(row => row.id === item.id) ? rows.map(row => row.id === item.id ? item : row) : [...rows, item];
    }
    switch (kind) {
      case 'pharmacies': setPharmacies(rows => upsert(rows, record as PharmacyDirectoryItem)); break;
      case 'suppliers': setSuppliers(rows => upsert(rows, record as SupplierDirectoryItem)); break;
      case 'customers': setCustomers(rows => upsert(rows, record as CustomerDirectoryItem)); break;
      case 'partners': setPartners(rows => upsert(rows, record as PartnerDirectoryItem)); break;
    }
    showToast('success', 'Directory saved', 'The demo record is saved in this browser.');
  };

  // Reset demo state
  const resetDemoData = () => {
    Object.keys(localStorage).filter(key => key.startsWith(STORAGE_KEY)).forEach(key => localStorage.removeItem(key));
    setMappings(INITIAL_MEDICINE_MAPPINGS);
    setCorrections(INITIAL_MEDICINE_CORRECTIONS);
    setMappingLogs(INITIAL_MAPPING_LOGS);
    setExtractedLogs(INITIAL_EXTRACTED_LOGS);
    setErrorLogs(INITIAL_ERROR_LOGS);
    setRoles(INITIAL_ROLE_DEFINITIONS);
    setFeedbackRecords(INITIAL_FEEDBACK_RECORDS);
    setPartners(INITIAL_PARTNERS_DIRECTORY);
    setPharmacies(INITIAL_PHARMACIES_DIRECTORY);
    setSuppliers(INITIAL_SUPPLIERS_DIRECTORY);
    setCustomers(INITIAL_CUSTOMERS_DIRECTORY);
    setIsReleasePaused(false);
    setMobileCart([
      { id: 'cart-1', name: 'Panadol Extra 24 Tablets', quantity: 2, price: 96.0 },
    ]);
    showToast('info', 'Demo State Reset', 'Restored initial realistic mock dataset.');
  };

  return (
    <DemoDataContext.Provider
      value={{
        mappings,
        acceptMapping,
        acceptAllVisibleMappings,
        updateMappingSelection,
        toggleCosmetics,
        deleteSelectedMappings,

        corrections,
        updateCorrection,
        bulkRemoveCorrections,
        bulkUnlinkCorrections,

        mappingLogs,
        addMappingLog,

        extractedLogs,
        updateExtractedLogReview,
        recordVoiceReview,

        errorLogs,
        resolveError,
        unresolveError,

        roles,
        updateRolePermissions,

        weeklyReports: WEEKLY_QUALITY_REPORTS,
        feedbackRecords,
        addFeedbackRecord,
        updateFeedbackStatus,

        isReleasePaused,
        toggleReleasePause,

        mobileCart,
        addToMobileCart,
        clearMobileCart,

        pharmacies,
        suppliers,
        customers,
        partners,
        addPartner,
        saveDirectoryRecord,

        toasts,
        showToast,
        dismissToast,
        resetDemoData,
      }}
    >
      {children}
    </DemoDataContext.Provider>
  );
};

export const useDemoData = () => {
  const context = useContext(DemoDataContext);
  if (!context) {
    throw new Error('useDemoData must be used within a DemoDataProvider');
  }
  return context;
};
