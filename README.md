# Cluster Pharmacy Administration & Responsible AI (RAI) Platform

A high-fidelity frontend demonstration of the **Cluster Pharmaceutical ERP & Administration Portal**, extending the core operations platform with comprehensive **Responsible AI (RAI)** governance, model cards, transparency data maps, and community dispensary mobile voice ordering.

Built with **React 18**, **TypeScript**, **Vite**, and **TailwindCSS**, featuring complete client-side mock data persistence, Arabic/English bilingual typography, and interactive simulated AI workflows.

---

## 📸 Reference Screens & Design Fidelity

The platform strictly adheres to the visual authority of the reference system:
- **Header**: Deep blue-to-cyan gradient (`#0052b4` &rarr; `#0078cf` &rarr; `#009ee3`) with centered time/date, bell notification with badge `28`, and circular mascot avatar.
- **Sidebar**: Narrow dark blue rail (`#09233f`) with white icons, cyan active indicator (`#0083cb`), and expandable multi-section labels.
- **Page Header**: White title strip with clean breadcrumb trails (`Dashboard - ...`).
- **Cards & Data Tables**: Light gray background (`#f1f4f8`), crisp white cards, muted column headers, pale filter controls, and rounded action buttons.

---

## 🚀 Recreated & Extended Screens (13 Functional Pages)

### Core Pharmacy Administration
1. **Medicine Mappings** (`/mappings`)
   - Reconciles supplier catalog entries against standard system medicines.
   - Live dropdown containing plausible alternative candidates with unit prices in EGP.
   - Cosmetics toggle switch, individual acceptance, bulk "Accept All Visible Mappings", and deletion checkboxes.
2. **Medicine Mapping Corrections** (`/corrections`)
   - Current mapped products across suppliers (New Express, Enaya, ALFAROUK, etc.).
   - Interactive **Edit Mapping Dialog**, multi-row selection, **Bulk Remove Checked** (red), and **Bulk Unlink Checked** (purple).
3. **Medicine Mapping Logs** (`/mapping_logs`)
   - Detailed audit trail capturing ID transitions (e.g., ID `#3862` &rarr; `#17861`), change descriptions, and reviewer attribution (`Dr. Heba Admin`).
   - Detailed audit inspection modal with clinical rationale.
4. **Extracted Medicine Logs** (`/extracted_logs`)
   - Logs for Audio (voice dictation) and Image (prescription/invoice OCR) extractions.
   - Human-in-the-Loop review drawer: verify items, mark corrected, or record reviewer notes.
5. **Error Logs** (`/error_logs`)
   - 4 Top Stat Cards: **Total Errors** (`18,684`), **Unresolved** (`18,680`), **Resolved** (`4`), and **Last 7 Days** (`4,990`).
   - Searchable exception table with real-time simulated resolution that dynamically recalculates metrics.
6. **Roles & Permissions** (`/roles`)
   - Hierarchical permission matrix matching the system design: `ROLES`, `ADMINS`, `SETTINGS`, `ORDERS`, `FAQS`, `CATEGORIES`, `SUPPLIERS`, `PHARMACIES`, `MEDICINES`, `COMPLAINTS`, plus RAI extensions (`AI MODELS`, `DATA GOVERNANCE`, `AUDIT & MONITORING`, `PARTNERS`).
   - Group toggles, "Select all", and changes persistence.

### Mobile Experience
7. **Mobile Pharmacy Home** (`/mobile_pharmacy`)
   - Authentic Egyptian pharmacy mobile experience with bilingual Arabic/English interface.
   - Voice Order Hero Banner: Pharmacist mascot & Clara flying companion (`اطلب بصوتك - قول اللي عايزه وكلارا هتلاقيهولك`).
   - Interactive Simulated Voice Flow: **Record &rarr; Transcript &rarr; Pharmacist Accept/Modify/Reject Gate &rarr; Add to Cart**.

### Responsible AI & Governance (Derived from Competition Rubric)
8. **AI Models & Clara System Cards (Q6)** (`/ai_models`)
   - Model registry and detailed system cards for all 4 AI components:
     - **Arabic Pharma-Match (Fine-tuned Jina-v3)**: Direct integration of `Model_Card.md.txt` data (Triplet Loss, 45,724 samples, 99.31% TripletEvaluator validation accuracy by Mohammed Mohsen), with explicit distinction between vector validation and real-world production precision (~94.8%).
     - **Clara Speech Recognizer (ASR)**: Colloquial Egyptian Arabic Whisper fine-tune.
     - **Clara Vision & OCR Engine**: TrOCR + LayoutLMv3 prescription extraction.
     - **Clara Inventory Forecaster**: LightGBM + TFT stock replenishment.
9. **Data Usage, Minimization & Retention (Q20)** (`/data_retention`)
   - Interactive Data Map: Field names, purpose, access roles, storage region, retention, and AI training inclusion/exclusion.
   - Retention schedule with sample adoption date (Oct 2026).
   - **District-Level Demand View**: High-volume medication demand aggregated by Egyptian districts (Nasr City, Haram, Sidi Gaber, Mansoura) with **zero identifiable pharmacy PII**.
10. **AI Governance, Accountability & RACI (Q29)** (`/governance`)
    - Named single accountable owner: **Eng. Tarek Mansour (CEO)**.
    - Committee members: Mohammed Mohsen (AI Lead), Nourhan El-Sayed (Product Lead), Dr. Heba Admin (Domain/Tester Lead), Counselor Ahmed Farouk (Legal Consultant). No unauthorized physician roles invented.
    - Interactive **Simulate Emergency Release Pause** toggle.
11. **Production Monitoring & Feedback (Q33)** (`/monitoring`)
    - 4 sample weekly tester reports.
    - End-to-end closed-loop demonstration: Upstream supplier catalogue formatting changes &rarr; spike in corrections &rarr; reviewer note filed &rarr; parser sanitizer & alias update (v1.4.2) &rarr; corrections dropped back to 2.1%.
    - Form to file new reviewer corrective notes.
12. **Responsible AI Showcase (Q43)** (`/showcase`)
    - Three concrete benchmark hero cases with interactive 3-step walkthroughs and deep links into demo records:
      1. Pharmacist-in-the-loop with logged decisions.
      2. Egyptian Arabic voice ordering across regional dialects.
      3. ERP correction feedback loop.
13. **Multi-Stakeholder Directories (Q46)** (`/directories`)
    - Separate directory tabs for **Pharmacies (ليست الصيدليات)**, **Suppliers (ليست الموردين)**, **Customers (ليست العملاء)**, and **Ecosystem Partners (ليست الشركات)**.
    - Partner records include type (reverse logistics, expired-stock disposal, green pharma recycling), collaboration start date, joint activity, activity date, and contact role.

---

## 🛠 Local Setup & Running Instructions

### Prerequisites
- Node.js (v18 or higher recommended, tested on Node v22.12.0)
- npm (v9 or higher, tested on npm v11.8.0)

### Installation
```bash
git clone https://github.com/mohameddsalmann/cluster_competition.git
cd cluster_competition
npm install
```

### Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173/`.

### Production Build & Preview
```bash
npm run build
npm run preview
```

---

## 🔒 Data Persistence & Reset

- All user actions (accepting mappings, editing corrections, unlinking items, resolving errors, reviewing extractions, adding partners, voice cart items) automatically persist in browser `localStorage`.
- To restore the initial clean demonstration state at any time, click the **Reset Demo** button in the top right header.
