# Ontop Pharma Product Verification System (OPVS)
### Static Demo Prototype – v1.0

---

## 1. How to Run the Demo

**No web server or installation required.**

Simply open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari).

```
File > Open File > index.html
```

Or double-click `index.html` in Windows Explorer.

> ⚠️ **Note**: The QR code download feature requires the page to be served from `localhost` or an HTTPS connection due to browser Canvas restrictions. For a full demo, use VS Code Live Server or any local HTTP server:
> ```
> npx serve .
> ```

---

## 2. Demo Credentials

| Role | Username | Password |
|---|---|---|
| Administrator | `admin` | `admin123` |
| QA Officer | `qa` | `qa123` |

Use the **Fill Admin** / **Fill QA** quick-fill buttons on the login page for convenience.

---

## 3. Available Demo Batches

| Batch No. | Product | Status | QR Status | Verif. Code | Verif. Count |
|---|---|---|---|---|---|
| HNX12345 | NORMAXIN | ✅ Approved | 🟢 Active | X7K92M4P | 18 |
| HNX12346 | NORMAXIN | ⏳ Pending QA | ⬜ Not Generated | — | 0 |
| HNX00099 | NORMAXIN | ✅ Approved | 🔴 Expired | OLD8X29P | 7 |

---

## 4. Verification URL Examples

### ✅ Valid – Active Product Verification
```
verify.html?code=X7K92M4P
```
**Result**: Product Verification Successful. Genuine product from Ontop Pharmaceuticals Pvt. Ltd.

### ⚠️ Expired – Expired Product
```
verify.html?code=OLD8X29P
```
**Result**: Verification Link Expired. Product expiry date (31-Jul-2025) has passed.

### ✕ Invalid – Unknown Code
```
verify.html?code=INVALID123
```
**Result**: Verification Code Not Found.

---

## 5. Demo Scenarios (Management Presentation)

### Demo 1: Admin – Add Batch
1. Login as `admin / admin123 / Administrator`
2. Click **Add New Batch** → Pre-filled NORMAXIN form
3. Click **Save Draft** → Success toast notification
4. Click **Submit for QA Approval** → Status changes to Pending QA

### Demo 2: QA – Approve Batch
1. Logout → Login as `qa / qa123 / QA Officer`
2. Click **Pending Approval** in sidebar
3. Review batch HNX12346 details
4. Check all 8 QA checklist items → **Approve Batch** button activates
5. Click **Approve Batch** → Batch approved, prompt to generate QR

### Demo 3: Admin – Generate QR
1. Login as `admin`
2. **QR / Verification Links** → Select approved batch
3. Click **Activate Verification Link & Generate QR**
4. Copy URL / Download QR

### Demo 4: Valid Product Verification
- Open: `verify.html?code=X7K92M4P`
- Shows: ✓ Product Verification Successful (green)

### Demo 5: Expired Product Verification
- Open: `verify.html?code=OLD8X29P`
- Shows: ⚠ Verification Link Expired (amber)

### Demo 6: Invalid Product Verification
- Open: `verify.html?code=INVALID123`
- Shows: ✕ Verification Code Not Found (red)

### Demo 7: Audit Trail
- Navigate to **Audit Trail** in sidebar
- Shows complete activity log with filters

---

## 6. Features That Are Simulated (Demo Only)

| Feature | Demo Behaviour |
|---|---|
| Login / Authentication | JavaScript credential check, sessionStorage |
| Batch Save / Submit | In-memory state update (OPVS_STATE) |
| QA Approval | Updates in-memory batch object |
| QR Generation | Client-side qrcode.js |
| Verification URL | Hard-coded demo URL; not internet-connected |
| Audit Trail | Static hard-coded records |
| Reports | Static table; export shows demo toast |
| Public Verification | JavaScript lookup in hard-coded OPVS_DATA |
| Verification Count | Static number (18 / 7) |
| Role-Based Access | Redirect logic only, no real security |

---

## 7. Features Requiring Backend/Database in Production

| Feature | Production Requirement |
|---|---|
| Real authentication | JWT/OAuth2, password hashing (bcrypt) |
| Batch data persistence | PostgreSQL / MySQL database |
| Real verification URL | HTTPS domain + URL routing (e.g., verify.ontoppharma.com) |
| QA workflow enforcement | Server-side status machine |
| Audit log integrity | Immutable database audit table |
| Real-time verification count | Database counter, increment per scan |
| Report generation | Server-side PDF/Excel generation |
| Email notifications | SMTP / notification service |
| Record locking after approval | Database-level write restrictions |
| 21 CFR Part 11 / electronic signature | Digital signature infrastructure |
| HTTPS / SSL | Web server with SSL certificate |
| Role-based access control | Backend middleware / permissions |
| QR code batch printing | Print API / label integration |

---

## 8. File Structure

```
qr static website/
├── index.html          ← Login page
├── dashboard.html      ← Admin/QA dashboard
├── batches.html        ← Batch list with filters
├── add-batch.html      ← Add / edit batch form
├── batch-details.html  ← Batch detail view
├── qa-approval.html    ← QA review & approval
├── qr-generation.html  ← QR & link generation
├── verify.html         ← Public verification (valid/expired/invalid)
├── audit-trail.html    ← Audit log
├── products.html       ← Product master
├── manufacturer.html   ← Manufacturer details
├── reports.html        ← Reports dashboard
│
├── css/
│   └── style.css       ← Complete design system
│
├── js/
│   ├── data.js         ← Hard-coded demo data
│   ├── auth.js         ← Demo auth (sessionStorage)
│   ├── app.js          ← Shared: sidebar, topbar, toasts, badges
│   ├── batches.js      ← Batch list, details, QA approval logic
│   ├── verification.js ← Public verification page logic
│   └── qr.js          ← QR code generation logic
│
└── README.md           ← This file
```

---

## 9. Technology Stack

| Component | Technology |
|---|---|
| Structure | HTML5 |
| Styling | Bootstrap 5.3.3 + Custom CSS (Inter font) |
| Icons | Bootstrap Icons 1.11.3 |
| QR Generation | qrcode.js v1.0.0 (CDN) |
| State | JavaScript (in-memory + sessionStorage) |
| External dependencies | CDN only (no npm/build required) |

---

## 10. Disclaimer

> **Demo Prototype | Static UI | No Production Database Connected**
> 
> This is a static UI prototype for demonstration purposes only.
> The login, approval, QR generation, and verification behaviour are entirely simulated using JavaScript.
> No real authentication, database, or server-side processing is involved.
> This prototype must NOT be used in production without a proper backend, database, and security implementation.

---

*Ontop Pharmaceuticals Pvt. Ltd. | OPVS Demo v1.0 | © 2026*
