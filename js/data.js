/**
 * OPVS – Ontop Pharma Product Verification System
 * data.js – Hard-coded demo data (static prototype, no database)
 */

const OPVS_DATA = {

  // ──────────────────────────────────────────────────────────────────────────
  // PRODUCTS
  // ──────────────────────────────────────────────────────────────────────────
  products: [
    {
      id: 1,
      productCode: "ONT-NORM-001",
      productName: "NORMAXIN",
      genericName: "CLIDINIUM BROMIDE, CHLORDIAZEPOXIDE & DICYCLOMINE HYDROCHLORIDE TABLETS",
      brandName: "NORMAXIN",
      dosageForm: "Tablets",
      packSize: "10 Tablets",
      market: "India",
      status: "Active"
    }
  ],

  // ──────────────────────────────────────────────────────────────────────────
  // MANUFACTURERS
  // ──────────────────────────────────────────────────────────────────────────
  manufacturers: [
    {
      id: 1,
      name: "Ontop Pharmaceuticals Pvt. Ltd.",
      address: "Plot No. 120/B, S. V. Co-operative Industrial Area, IDA Bollaram, Telangana",
      licenceNumber: "23/SRD/TS/2017/F/G",
      country: "India",
      state: "Telangana",
      status: "Active"
    }
  ],

  // ──────────────────────────────────────────────────────────────────────────
  // BATCHES
  // ──────────────────────────────────────────────────────────────────────────
  batches: [
    {
      id: 1,
      batchNo: "HNX12345",
      productId: 1,
      productName: "NORMAXIN",
      productCode: "ONT-NORM-001",
      genericName: "CLIDINIUM BROMIDE, CHLORDIAZEPOXIDE & DICYCLOMINE HYDROCHLORIDE TABLETS",
      brandName: "NORMAXIN",
      manufacturerId: 1,
      manufacturerName: "Ontop Pharmaceuticals Pvt. Ltd.",
      manufacturerAddress: "Plot No. 120/B, S. V. Co-operative Industrial Area, IDA Bollaram, Telangana",
      licenceNumber: "23/SRD/TS/2017/F/G",
      mfgDate: "01-Aug-2026",
      expDate: "31-Jul-2028",
      packSize: "10 Tablets",
      dosageForm: "Tablets",
      market: "India",
      batchStatus: "Approved",
      qrStatus: "Active",
      verificationCode: "X7K92M4P",
      verificationUrl: "https://verify.ontoppharma.com/21/X7K92M4P",
      verificationCount: 18,
      approvedBy: "qa",
      approvedDate: "03-Sep-2026 09:30",
      qaRemarks: "All information verified. Batch approved for QR generation.",
      linkGeneratedDate: "03-Sep-2026 09:35",
      createdBy: "admin",
      createdDate: "03-Sep-2026 09:00"
    },
    {
      id: 2,
      batchNo: "HNX12346",
      productId: 1,
      productName: "NORMAXIN",
      productCode: "ONT-NORM-001",
      genericName: "CLIDINIUM BROMIDE, CHLORDIAZEPOXIDE & DICYCLOMINE HYDROCHLORIDE TABLETS",
      brandName: "NORMAXIN",
      manufacturerId: 1,
      manufacturerName: "Ontop Pharmaceuticals Pvt. Ltd.",
      manufacturerAddress: "Plot No. 120/B, S. V. Co-operative Industrial Area, IDA Bollaram, Telangana",
      licenceNumber: "23/SRD/TS/2017/F/G",
      mfgDate: "01-Sep-2026",
      expDate: "31-Aug-2028",
      packSize: "10 Tablets",
      dosageForm: "Tablets",
      market: "India",
      batchStatus: "Pending QA Approval",
      qrStatus: "Not Generated",
      verificationCode: null,
      verificationUrl: null,
      verificationCount: 0,
      approvedBy: null,
      approvedDate: null,
      qaRemarks: null,
      linkGeneratedDate: null,
      createdBy: "admin",
      createdDate: "03-Sep-2026 09:45"
    },
    {
      id: 3,
      batchNo: "HNX00099",
      productId: 1,
      productName: "NORMAXIN",
      productCode: "ONT-NORM-001",
      genericName: "CLIDINIUM BROMIDE, CHLORDIAZEPOXIDE & DICYCLOMINE HYDROCHLORIDE TABLETS",
      brandName: "NORMAXIN",
      manufacturerId: 1,
      manufacturerName: "Ontop Pharmaceuticals Pvt. Ltd.",
      manufacturerAddress: "Plot No. 120/B, S. V. Co-operative Industrial Area, IDA Bollaram, Telangana",
      licenceNumber: "23/SRD/TS/2017/F/G",
      mfgDate: "01-Aug-2023",
      expDate: "31-Jul-2025",
      packSize: "10 Tablets",
      dosageForm: "Tablets",
      market: "India",
      batchStatus: "Approved",
      qrStatus: "Expired",
      verificationCode: "OLD8X29P",
      verificationUrl: "https://verify.ontoppharma.com/21/OLD8X29P",
      verificationCount: 7,
      approvedBy: "qa",
      approvedDate: "05-Aug-2023 11:00",
      qaRemarks: "All information verified. Approved.",
      linkGeneratedDate: "05-Aug-2023 11:15",
      createdBy: "admin",
      createdDate: "04-Aug-2023 10:00"
    }
  ],

  // ──────────────────────────────────────────────────────────────────────────
  // VERIFICATION RECORDS (public-facing lookup by code)
  // ──────────────────────────────────────────────────────────────────────────
  verificationCodes: {
    "X7K92M4P": {
      status: "valid",
      batchId: 1
    },
    "OLD8X29P": {
      status: "expired",
      batchId: 3
    }
  },

  // ──────────────────────────────────────────────────────────────────────────
  // VERIFICATION HISTORY (for active batch)
  // ──────────────────────────────────────────────────────────────────────────
  verificationHistory: [
    { date: "03-Sep-2026 09:21", code: "X7K92M4P", result: "Successful", location: "Hyderabad, India" },
    { date: "03-Sep-2026 10:04", code: "X7K92M4P", result: "Successful", location: "Mumbai, India" },
    { date: "03-Sep-2026 10:32", code: "X7K92M4P", result: "Successful", location: "Delhi, India" },
    { date: "03-Sep-2026 11:05", code: "X7K92M4P", result: "Successful", location: "Bangalore, India" },
    { date: "03-Sep-2026 11:48", code: "X7K92M4P", result: "Successful", location: "Chennai, India" },
    { date: "03-Sep-2026 12:15", code: "X7K92M4P", result: "Successful", location: "Pune, India" },
    { date: "03-Sep-2026 13:00", code: "X7K92M4P", result: "Successful", location: "Kolkata, India" },
    { date: "03-Sep-2026 13:30", code: "X7K92M4P", result: "Successful", location: "Ahmedabad, India" },
    { date: "03-Sep-2026 14:10", code: "X7K92M4P", result: "Successful", location: "Jaipur, India" },
    { date: "03-Sep-2026 14:45", code: "X7K92M4P", result: "Successful", location: "Surat, India" },
    { date: "03-Sep-2026 15:20", code: "X7K92M4P", result: "Successful", location: "Lucknow, India" },
    { date: "03-Sep-2026 15:55", code: "X7K92M4P", result: "Successful", location: "Nagpur, India" },
    { date: "03-Sep-2026 16:30", code: "X7K92M4P", result: "Successful", location: "Indore, India" },
    { date: "03-Sep-2026 17:00", code: "X7K92M4P", result: "Successful", location: "Bhopal, India" },
    { date: "03-Sep-2026 17:35", code: "X7K92M4P", result: "Successful", location: "Visakhapatnam, India" },
    { date: "03-Sep-2026 18:05", code: "X7K92M4P", result: "Successful", location: "Patna, India" },
    { date: "03-Sep-2026 18:40", code: "X7K92M4P", result: "Successful", location: "Vadodara, India" },
    { date: "03-Sep-2026 19:10", code: "X7K92M4P", result: "Successful", location: "Coimbatore, India" }
  ],

  // ──────────────────────────────────────────────────────────────────────────
  // AUDIT TRAIL
  // ──────────────────────────────────────────────────────────────────────────
  auditTrail: [
    { datetime: "03-Sep-2026 09:00", user: "admin", role: "Administrator", activity: "Batch Created", batch: "HNX12345", details: "New batch record created in DRAFT status.", ip: "192.168.1.10" },
    { datetime: "03-Sep-2026 09:10", user: "admin", role: "Administrator", activity: "Submitted for QA Approval", batch: "HNX12345", details: "Batch submitted for QA review.", ip: "192.168.1.10" },
    { datetime: "03-Sep-2026 09:30", user: "qa", role: "QA Officer", activity: "Batch Approved", batch: "HNX12345", details: "QA checklist completed. Batch approved.", ip: "192.168.1.25" },
    { datetime: "03-Sep-2026 09:35", user: "admin", role: "Administrator", activity: "Verification Link Generated", batch: "HNX12345", details: "Verification code X7K92M4P generated. URL activated.", ip: "192.168.1.10" },
    { datetime: "03-Sep-2026 09:21", user: "Public", role: "Public User", activity: "QR Verified", batch: "HNX12345", details: "Verification successful. Code: X7K92M4P", ip: "103.24.55.12" },
    { datetime: "03-Sep-2026 09:45", user: "admin", role: "Administrator", activity: "Batch Created", batch: "HNX12346", details: "New batch record created in DRAFT status.", ip: "192.168.1.10" },
    { datetime: "03-Sep-2026 10:00", user: "admin", role: "Administrator", activity: "Submitted for QA Approval", batch: "HNX12346", details: "Batch submitted for QA review.", ip: "192.168.1.10" },
    { datetime: "03-Sep-2026 10:04", user: "Public", role: "Public User", activity: "QR Verified", batch: "HNX12345", details: "Verification successful. Code: X7K92M4P", ip: "122.45.67.89" },
    { datetime: "03-Sep-2026 10:32", user: "Public", role: "Public User", activity: "QR Verified", batch: "HNX12345", details: "Verification successful. Code: X7K92M4P", ip: "49.205.33.11" },
    { datetime: "05-Aug-2023 10:00", user: "admin", role: "Administrator", activity: "Batch Created", batch: "HNX00099", details: "New batch record created.", ip: "192.168.1.10" },
    { datetime: "05-Aug-2023 10:30", user: "admin", role: "Administrator", activity: "Submitted for QA Approval", batch: "HNX00099", details: "Batch submitted for QA review.", ip: "192.168.1.10" },
    { datetime: "05-Aug-2023 11:00", user: "qa", role: "QA Officer", activity: "Batch Approved", batch: "HNX00099", details: "QA checklist completed. Batch approved.", ip: "192.168.1.25" },
    { datetime: "05-Aug-2023 11:15", user: "admin", role: "Administrator", activity: "Verification Link Generated", batch: "HNX00099", details: "Verification code OLD8X29P generated.", ip: "192.168.1.10" },
    { datetime: "31-Jul-2025 00:01", user: "System", role: "System", activity: "Link Expired", batch: "HNX00099", details: "Verification link expired as product expiry date passed.", ip: "System" }
  ],

  // ──────────────────────────────────────────────────────────────────────────
  // USERS (demo credentials)
  // ──────────────────────────────────────────────────────────────────────────
  users: [
    { username: "admin", password: "admin123", role: "Administrator", fullName: "System Administrator", department: "IT" },
    { username: "qa",    password: "qa123",    role: "QA",            fullName: "QA Officer",           department: "Quality Assurance" }
  ],

  // ──────────────────────────────────────────────────────────────────────────
  // DASHBOARD KPIs
  // ──────────────────────────────────────────────────────────────────────────
  kpis: {
    totalBatches: 3,
    pendingQA: 1,
    approved: 2,
    activeLinks: 1,
    expiredLinks: 1,
    totalVerifications: 25
  }
};
