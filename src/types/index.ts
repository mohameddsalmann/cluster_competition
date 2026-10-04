// Types for Cluster Pharmacy Administration Demo

export interface MedicineMapping {
  id: string;
  orderNumber: number;
  supplier: string;
  supplierMedicineName: string;
  price: number;
  quantity: number;
  isCosmetics: boolean;
  topSuggestedMedicine: string;
  topSuggestedPrice: number;
  selectedMapping: string;
  availableOptions: Array<{ name: string; price: number }>;
  status: 'pending' | 'accepted' | 'rejected';
  confidenceScore: number;
  updatedAt?: string;
}

export interface MedicineCorrection {
  id: string;
  orderNumber: number;
  supplier: string;
  supplierMedicineName: string;
  supplierPrice: number;
  supplierQty: number;
  currentMapping: string;
  mappingId: string;
  updatedAt: string;
  status: 'active' | 'unlinked' | 'flagged';
  notes?: string;
}

export interface MedicineMappingLog {
  id: string;
  orderNumber: number;
  supplierMedicine: string;
  supplierMedicineCode: string;
  supplier: string;
  oldMedicine: string;
  oldMedicineCode: string;
  newMedicine: string;
  newMedicineCode: string;
  changeType: 'Remapped' | 'Unlinked' | 'Auto-matched' | 'Manual-override';
  changeDescription: string;
  changedBy: string;
  changedByRole: string;
  changedAt: string;
  reason?: string;
}

export interface ExtractedMedicineLog {
  id: string;
  logId: string;
  type: 'Audio' | 'Image';
  pharmacy: string;
  pharmacyId: string;
  extractedMedicinesCount: number;
  matchedMedicinesCount: number;
  createdAt: string;
  sourceDetails: {
    audioDuration?: string;
    imageResolution?: string;
    dialectOrFormat?: string;
    deviceType?: string;
  };
  extractedItems: Array<{
    rawText: string;
    suggestedMatch: string;
    confidence: number;
    matchStatus: 'matched' | 'unmatched' | 'manual_review';
    acceptedQuantity?: number;
  }>;
  reviewStatus: 'Pending Review' | 'Verified' | 'Corrected' | 'Rejected';
  reviewerNotes?: string;
}

export interface ErrorLog {
  id: string;
  orderNumber: number;
  errorMessage: string;
  errorDetails: string;
  type: string;
  controller: string;
  action: string;
  user: string;
  userType: 'Pharmacy' | 'Supplier' | 'Admin' | 'System';
  occurrences: number;
  status: 'unresolved' | 'resolved';
  firstOccurred: string;
  lastOccurred: string;
  stackTrace?: string;
}

export interface RoleGroupPermission {
  groupKey: string;
  groupLabel: string;
  permissions: Array<{
    id: string;
    key: string;
    label: string;
    granted: boolean;
  }>;
}

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  userCount: number;
  isSystem: boolean;
  groups: RoleGroupPermission[];
}

// RAI: Model Card & System Card types
export interface AIComponentCard {
  id: string;
  name: string;
  role: 'speech_recognition' | 'image_extraction' | 'medicine_matching' | 'recommendation';
  provider: string;
  baseModel: string;
  version: string;
  status: 'current' | 'superseded' | 'in_validation';
  developer: string;
  lastUpdated: string;
  purpose: string;
  intendedUsers: string[];
  outOfScope: string[];
  inputs: string;
  outputs: string;
  humanOversight: string;
  knownLimitations: string[];
  fairnessRisks: string[];
  evaluation: {
    metricName: string;
    metricValue: string;
    validationType: string;
    datasetDetails: string;
    productionBenchmarkNote: string;
  };
  changeHistory: Array<{
    version: string;
    date: string;
    author: string;
    summary: string;
  }>;
  isSampleDataOnly: boolean;
}

// RAI: Data Map & Retention types
export interface DataMapRecord {
  id: string;
  category: string;
  fieldName: string;
  purpose: string;
  accessRoles: string[];
  storageLocation: string;
  retentionPeriod: string;
  usedForAiTraining: boolean;
  anonymizationTechnique: string;
  legalBasis: string;
}

export interface DistrictDemandSummary {
  district: string;
  governorate: string;
  topMedicine: string;
  category: string;
  monthlyPacksDemanded: number;
  trendPercentage: number;
  participatingPharmaciesCount: number; // aggregated, no names!
  activeSuppliersCount: number;
  lastSyncDate: string;
}

// RAI: Governance & RACI types
export interface GovernanceMember {
  roleTitle: string;
  name: string;
  title: string;
  avatarColor: string;
  raciStatus: {
    aiModelRelease: 'Accountable' | 'Responsible' | 'Consulted' | 'Informed';
    fairnessAudit: 'Accountable' | 'Responsible' | 'Consulted' | 'Informed';
    dataRetentionPolicy: 'Accountable' | 'Responsible' | 'Consulted' | 'Informed';
    incidentResponse: 'Accountable' | 'Responsible' | 'Consulted' | 'Informed';
  };
  pauseAuthority: boolean;
  bio: string;
}

export interface GovernanceReviewRecord {
  id: string;
  reviewDate: string;
  period: string;
  chairperson: string;
  attendees: string[];
  status: 'Approved' | 'Action Required' | 'Release Paused';
  decisions: string[];
  concernsRaised: string[];
  nextReviewDate: string;
}

// RAI: Monitoring & Feedback
export interface WeeklyQualityReport {
  id: string;
  weekLabel: string;
  dateRange: string;
  matchingQualityScore: number;
  totalExtractions: number;
  correctionRate: number;
  extractionFailures: number;
  unresolvedIssuesCount: number;
  reviewerNotes: string;
  trendsSummary: string;
}

export interface FeedbackRecord {
  id: string;
  ticketId: string;
  reportedDate: string;
  reportedBy: string;
  assignedOwner: string;
  status: 'Under Investigation' | 'Fix Deployed' | 'Closed' | 'Retraining Scheduled';
  issueDescription: string;
  investigationFindings: string;
  correctiveAction: string;
  followUpResult: string;
  relatedMedicineFamily: string;
}

// RAI: Showcase Hero Cases
export interface ShowcaseCase {
  id: string;
  title: string;
  titleAr: string;
  tagline: string;
  pillar: string;
  summary: string;
  demonstratedMechanism: string;
  metrics: Array<{ label: string; value: string; note: string }>;
  interactiveSteps: Array<{
    stepNumber: number;
    title: string;
    description: string;
    stateData: any;
  }>;
  referenceLinks: Array<{ label: string; screenKey: string }>;
}

// Stakeholder Directories
export interface PharmacyDirectoryItem {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string;
  licenseNumber: string;
  district: string;
  governorate: string;
  managerName: string;
  phone: string;
  tier: 'Community' | 'Hospital' | 'Chain Branch';
  activeSince: string;
  monthlyOrdersAvg: number;
  status: 'Active' | 'Under Review' | 'Suspended';
}

export interface SupplierDirectoryItem {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string;
  commercialRegistration: string;
  integrationMethod: 'API Automated' | 'Daily Excel/CSV' | 'Manual Entry';
  catalogueItemCount: number;
  contactPerson: string;
  phone: string;
  warehouseCity: string;
  status: 'Verified' | 'Syncing' | 'Inactive';
}

export interface CustomerDirectoryItem {
  id: string;
  code: string;
  name: string;
  customerType: 'Retail Patron' | 'Chronic Medication Member' | 'Institutional Account';
  preferredPharmacy: string;
  city: string;
  totalPrescriptionsFilled: number;
  lastInteraction: string;
  anonymizedIdentifier: string;
}

export interface PartnerDirectoryItem {
  id: string;
  code: string;
  partnerName: string;
  partnerType: 'Reverse Logistics & Expired Stock' | 'Eco-friendly Pharma Waste' | 'Independent Testing Lab' | 'Pharmacy Syndicate Liaison';
  collaborationStartDate: string;
  contactRole: string;
  contactPerson: string;
  jointActivity: string;
  activityDate: string;
  disclaimer: string;
  status: 'Active Partnership' | 'Pilot Stage';
}
