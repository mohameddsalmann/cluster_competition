# Cluster Pharmacy Administration Demo

A frontend-only React + TypeScript application using local mock records. It follows the Cluster screenshot identity and includes catalogue operations, the pharmacy app, responsible AI pages, and stakeholder directories.

## Run

```powershell
npm install
node node_modules/vite/bin/vite.js --host localhost --port 5173
```

For a production preview:

```powershell
npm run build
node node_modules/vite/bin/vite.js preview --host localhost --port 5173
```

Stop an existing server on that port before starting another one. A preview serves the last production build; rebuild after changing source files.

## Verify

```powershell
npm run check:mock
npm run build
```

The mock integrity check verifies record IDs, extraction detail/count consistency, confidence ranges, mapping choices, permission IDs, and the documented model evaluation distinction.

## Project organization

- `src/components/layout/`: header, sidebar and page headings.
- `src/components/common/`: Cluster branding and toast messages.
- `src/pages/`: the 13 application screens.
- `src/context/DemoDataContext.tsx`: shared mock state, persistence and interactions.
- `src/data/mockData.ts`: original demo fixtures and illustrative AI records.
- `src/types/`: record definitions.
- `src/utils/`: CSV export helper.
- `public/brand/`: supplied Cluster logo used by the application.
- `references/ui/`: original website screenshots.
- `references/feedback/`: competition feedback screenshots.
- `references/model/`: supplied matching model card.
- `scripts/`: repeatable mock-data checks.

The original logo files remain in the project root. Unused duplicate reference screenshots are excluded from public application assets.

## Demo behavior

Navigation uses URL hashes so screens survive reload and support browser history. Demo changes persist in browser local storage. Reset restores the original fixtures and removes only Cluster demo storage keys.

Bulk acceptance affects only visible pending mappings. Corrections and unlink actions create mapping history. Errors can be resolved individually or in selected groups; dashboard totals reflect actual error records. Extraction counts reflect the detailed items. Voice orders simulate transcription, pharmacist review and cart additions, and create a review log. Search and category selection work in the pharmacy view. All four directory types support searching, filtering, details, creating, editing and persistence. Mapping history supports selected CSV exports.

AI governance, policy dates, named stakeholders, provider/version metadata, operational metrics and partnerships are illustrative. The supplied matching model card reports 99.31% cosine accuracy on a triplet evaluation; no production matching accuracy is claimed. Roles configure mock permissions and do not implement real authorization. No APIs, real recording, external order submission or AI inference are connected. Pharmacy order history is session-only; the cart persists.

The primary sidebar follows the supplied CTO dashboard reference: Dashboard, Stakeholder, Orders, Settings, Tools and Locations. Medicine Management and Responsible AI remain available in the Administration submenus. The Suppliers page reproduces the reference table columns with fictional store/contact names and different totals. Demo reset and Pharmacy App shortcuts are in the profile menu.
