/**
 * OPVS – batches.js
 * Batch list, add-batch, batch-details, and QA approval page logic.
 */

// ─── BATCH LIST PAGE ─────────────────────────────────────────────────────────
function batchesPageInit() {
  const user = OPVS_AUTH.requireLogin();
  if (!user) return;
  opvsRenderSidebar('batches.html');
  opvsRenderTopbar('Batch Management', [
    { label: 'Dashboard', href: 'dashboard.html' },
    { label: 'Batch Management' }
  ]);
  renderBatchTable();
}

function renderBatchTable() {
  const tbody = document.getElementById('batchTableBody');
  if (!tbody) return;

  const rows = OPVS_STATE.batches.map((b, i) => {
    const actions = batchActions(b);
    return `
      <tr>
        <td>${i + 1}</td>
        <td>
          <div class="fw-semibold">${b.productName}</div>
          <small class="text-muted">${b.genericName.substring(0, 40)}…</small>
        </td>
        <td><code>${b.productCode}</code></td>
        <td><strong>${b.batchNo}</strong></td>
        <td>${b.mfgDate}</td>
        <td>${b.expDate}</td>
        <td>${opvsBatchStatusBadge(b.batchStatus)}</td>
        <td>${opvsQrStatusBadge(b.qrStatus)}</td>
        <td class="text-center">
          ${b.verificationCount > 0
            ? `<span class="badge bg-info text-dark">${b.verificationCount}</span>`
            : '<span class="text-muted">0</span>'}
        </td>
        <td class="action-col">${actions}</td>
      </tr>`;
  }).join('');

  tbody.innerHTML = rows;
}

function batchActions(b) {
  const btns = [];
  btns.push(`<a href="batch-details.html?id=${b.id}" class="btn btn-sm btn-outline-primary" title="View"><i class="bi bi-eye"></i> View</a>`);

  if (b.batchStatus === 'Draft' || b.batchStatus === 'Pending QA Approval') {
    btns.push(`<a href="add-batch.html?edit=${b.id}" class="btn btn-sm btn-outline-secondary" title="Edit"><i class="bi bi-pencil"></i> Edit</a>`);
  }
  if (b.batchStatus === 'Pending QA Approval') {
    btns.push(`<a href="qa-approval.html?id=${b.id}" class="btn btn-sm btn-outline-warning" title="Approve"><i class="bi bi-clipboard2-check"></i> QA Review</a>`);
  }
  if (b.batchStatus === 'Approved' && b.qrStatus === 'Not Generated') {
    btns.push(`<a href="qr-generation.html?id=${b.id}" class="btn btn-sm btn-outline-success" title="Generate Link"><i class="bi bi-qr-code"></i> Generate Link</a>`);
  }
  if (b.verificationCode) {
    btns.push(`<a href="verify.html?code=${b.verificationCode}" target="_blank" class="btn btn-sm btn-outline-info" title="Public View"><i class="bi bi-box-arrow-up-right"></i></a>`);
  }
  return `<div class="d-flex gap-1 flex-wrap">${btns.join('')}</div>`;
}

// ─── ADD BATCH PAGE ───────────────────────────────────────────────────────────
function addBatchPageInit() {
  const user = OPVS_AUTH.requireRole(['Administrator']);
  if (!user) return;
  opvsRenderSidebar('add-batch.html');
  opvsRenderTopbar('Add New Batch', [
    { label: 'Dashboard', href: 'dashboard.html' },
    { label: 'Batch Management', href: 'batches.html' },
    { label: 'Add Batch' }
  ]);

  const editId = opvsGetParam('edit');
  if (editId) {
    const batch = OPVS_STATE.batches.find(b => b.id == editId);
    if (batch) prefillBatchForm(batch);
    document.getElementById('formTitle').textContent = 'Edit Batch';
    document.getElementById('batchStatusField').value = batch.batchStatus;
  }
}

function prefillBatchForm(b) {
  const fields = {
    'field-productName': b.productName,
    'field-productCode': b.productCode,
    'field-genericName': b.genericName,
    'field-brandName': b.brandName,
    'field-manufacturer': b.manufacturerName,
    'field-address': b.manufacturerAddress,
    'field-licence': b.licenceNumber,
    'field-batchNo': b.batchNo,
    'field-mfgDate': b.mfgDate,
    'field-expDate': b.expDate,
    'field-packSize': b.packSize,
    'field-dosageForm': b.dosageForm,
    'field-market': b.market
  };
  Object.entries(fields).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  });
}

function saveDraft() {
  opvsToast('Batch saved as Draft successfully.', 'success');
}

function submitForQA() {
  const editId = opvsGetParam('edit');
  const batchNo = document.getElementById('field-batchNo')?.value || 'New Batch';

  opvsConfirm(
    'Submit for QA Approval',
    `Are you sure you want to submit batch "${batchNo}" for QA approval? This will lock the record.`,
    () => {
      if (editId) {
        const batch = OPVS_STATE.batches.find(b => b.id == editId);
        if (batch) batch.batchStatus = 'Pending QA Approval';
      }
      opvsToast('Batch submitted for QA Approval.', 'info');
      setTimeout(() => { window.location.href = 'batches.html'; }, 1500);
    }
  );
}

// ─── BATCH DETAILS PAGE ───────────────────────────────────────────────────────
function batchDetailsPageInit() {
  const user = OPVS_AUTH.requireLogin();
  if (!user) return;
  opvsRenderSidebar('batches.html');

  const id = opvsGetParam('id');
  const batch = OPVS_STATE.batches.find(b => b.id == id);

  if (!batch) {
    document.getElementById('batchDetailsContent').innerHTML = '<div class="alert alert-danger">Batch not found.</div>';
    return;
  }

  opvsRenderTopbar(`Batch: ${batch.batchNo}`, [
    { label: 'Dashboard', href: 'dashboard.html' },
    { label: 'Batch Management', href: 'batches.html' },
    { label: batch.batchNo }
  ]);

  renderBatchDetails(batch);
}

function renderBatchDetails(b) {
  const el = document.getElementById('batchDetailsContent');
  if (!el) return;

  const qaSection = b.approvedBy ? `
    <div class="row g-3">
      <div class="col-md-4"><div class="detail-label">Approved By</div><div class="detail-value">${b.approvedBy}</div></div>
      <div class="col-md-4"><div class="detail-label">Approval Date</div><div class="detail-value">${b.approvedDate}</div></div>
      <div class="col-md-12"><div class="detail-label">QA Remarks</div><div class="detail-value">${b.qaRemarks}</div></div>
    </div>` : '<p class="text-muted">Awaiting QA approval.</p>';

  const qrSection = b.verificationCode ? `
    <div class="row g-3">
      <div class="col-md-6"><div class="detail-label">Verification Code</div><div class="detail-value"><code class="fs-5">${b.verificationCode}</code></div></div>
      <div class="col-md-6"><div class="detail-label">QR Status</div><div class="detail-value">${opvsQrStatusBadge(b.qrStatus)}</div></div>
      <div class="col-12"><div class="detail-label">Verification URL</div><div class="detail-value"><a href="verify.html?code=${b.verificationCode}" target="_blank">${b.verificationUrl}</a></div></div>
      <div class="col-md-4"><div class="detail-label">Link Generated</div><div class="detail-value">${b.linkGeneratedDate}</div></div>
      <div class="col-md-4"><div class="detail-label">Verification Count</div><div class="detail-value"><span class="badge bg-info text-dark fs-6">${b.verificationCount}</span></div></div>
    </div>` : '<p class="text-muted">Verification link not yet generated.</p>';

  el.innerHTML = `
    <!-- Product Info -->
    <div class="detail-card">
      <div class="detail-card-header"><i class="bi bi-capsule me-2"></i>Product Information</div>
      <div class="detail-card-body">
        <div class="row g-3">
          <div class="col-md-4"><div class="detail-label">Product Name</div><div class="detail-value fw-bold">${b.productName}</div></div>
          <div class="col-md-4"><div class="detail-label">Unique Product Identification Code</div><div class="detail-value"><code>${b.productCode}</code></div></div>
          <div class="col-md-4"><div class="detail-label">Brand Name</div><div class="detail-value">${b.brandName}</div></div>
          <div class="col-12"><div class="detail-label">Generic Name</div><div class="detail-value">${b.genericName}</div></div>
          <div class="col-md-4"><div class="detail-label">Dosage Form</div><div class="detail-value">${b.dosageForm}</div></div>
          <div class="col-md-4"><div class="detail-label">Pack Size</div><div class="detail-value">${b.packSize}</div></div>
          <div class="col-md-4"><div class="detail-label">Market</div><div class="detail-value">${b.market}</div></div>
        </div>
      </div>
    </div>

    <!-- Manufacturer Info -->
    <div class="detail-card">
      <div class="detail-card-header"><i class="bi bi-building me-2"></i>Manufacturer Information</div>
      <div class="detail-card-body">
        <div class="row g-3">
          <div class="col-md-6"><div class="detail-label">Manufacturer</div><div class="detail-value fw-bold">${b.manufacturerName}</div></div>
          <div class="col-md-6"><div class="detail-label">Manufacturing Licence No.</div><div class="detail-value"><code>${b.licenceNumber}</code></div></div>
          <div class="col-12"><div class="detail-label">Address</div><div class="detail-value">${b.manufacturerAddress}</div></div>
        </div>
      </div>
    </div>

    <!-- Batch Info -->
    <div class="detail-card">
      <div class="detail-card-header"><i class="bi bi-box-seam me-2"></i>Batch Information</div>
      <div class="detail-card-body">
        <div class="row g-3">
          <div class="col-md-3"><div class="detail-label">Batch Number</div><div class="detail-value fw-bold fs-5">${b.batchNo}</div></div>
          <div class="col-md-3"><div class="detail-label">Manufacturing Date</div><div class="detail-value">${b.mfgDate}</div></div>
          <div class="col-md-3"><div class="detail-label">Expiry Date</div><div class="detail-value">${b.expDate}</div></div>
          <div class="col-md-3"><div class="detail-label">Status</div><div class="detail-value">${opvsBatchStatusBadge(b.batchStatus)}</div></div>
        </div>
      </div>
    </div>

    <!-- QA Info -->
    <div class="detail-card">
      <div class="detail-card-header"><i class="bi bi-clipboard2-check me-2"></i>QA Approval Information</div>
      <div class="detail-card-body">${qaSection}</div>
    </div>

    <!-- QR Info -->
    <div class="detail-card">
      <div class="detail-card-header"><i class="bi bi-qr-code me-2"></i>Verification / QR Information</div>
      <div class="detail-card-body">${qrSection}</div>
    </div>

    <div class="d-flex gap-2 mt-3">
      <a href="batches.html" class="btn btn-secondary"><i class="bi bi-arrow-left me-1"></i>Back to List</a>
      ${b.batchStatus === 'Pending QA Approval' ? `<a href="qa-approval.html?id=${b.id}" class="btn btn-warning"><i class="bi bi-clipboard2-check me-1"></i>QA Review</a>` : ''}
      ${b.batchStatus === 'Approved' && b.qrStatus === 'Not Generated' ? `<a href="qr-generation.html?id=${b.id}" class="btn btn-success"><i class="bi bi-qr-code me-1"></i>Generate QR Link</a>` : ''}
    </div>`;
}

// ─── QA APPROVAL PAGE ────────────────────────────────────────────────────────
function qaApprovalPageInit() {
  const user = OPVS_AUTH.requireLogin();
  if (!user) return;
  opvsRenderSidebar('qa-approval.html');
  opvsRenderTopbar('QA Batch Approval', [
    { label: 'Dashboard', href: 'dashboard.html' },
    { label: 'QA Approval' }
  ]);

  const id = opvsGetParam('id');
  renderQAPendingList(id);
}

function renderQAPendingList(selectedId) {
  const pending = OPVS_STATE.batches.filter(b => b.batchStatus === 'Pending QA Approval');
  const listEl = document.getElementById('qaPendingList');

  if (!pending.length) {
    if (listEl) listEl.innerHTML = '<div class="alert alert-success"><i class="bi bi-check-circle me-2"></i>No batches pending QA approval.</div>';
    return;
  }

  if (listEl) {
    listEl.innerHTML = pending.map(b => `
      <div class="card qa-batch-card mb-2 ${selectedId == b.id ? 'selected' : ''}" onclick="loadQABatch(${b.id})" style="cursor:pointer;">
        <div class="card-body p-3">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <div class="fw-bold">${b.batchNo}</div>
              <small class="text-muted">${b.productName} | ${b.mfgDate}</small>
            </div>
            ${opvsBatchStatusBadge(b.batchStatus)}
          </div>
        </div>
      </div>`).join('');
  }

  const initId = selectedId || pending[0].id;
  loadQABatch(initId);
}

function loadQABatch(id) {
  const batch = OPVS_STATE.batches.find(b => b.id == id);
  if (!batch) return;

  const el = document.getElementById('qaDetailPanel');
  if (!el) return;

  el.innerHTML = `
    <div class="qa-detail-header d-flex justify-content-between align-items-center mb-4">
      <div>
        <h5 class="mb-1"><i class="bi bi-clipboard2-check me-2 text-warning"></i>Batch Pending QA Approval</h5>
        <span class="badge badge-pending fs-6">${batch.batchNo}</span>
      </div>
      ${opvsBatchStatusBadge(batch.batchStatus)}
    </div>

    <div class="detail-card mb-3">
      <div class="detail-card-header">Product & Batch Information</div>
      <div class="detail-card-body">
        <div class="row g-3">
          <div class="col-md-3"><div class="detail-label">Batch No.</div><div class="detail-value fw-bold">${batch.batchNo}</div></div>
          <div class="col-md-3"><div class="detail-label">Product</div><div class="detail-value">${batch.productName}</div></div>
          <div class="col-md-3"><div class="detail-label">Mfg. Date</div><div class="detail-value">${batch.mfgDate}</div></div>
          <div class="col-md-3"><div class="detail-label">Exp. Date</div><div class="detail-value">${batch.expDate}</div></div>
          <div class="col-12"><div class="detail-label">Generic Name</div><div class="detail-value">${batch.genericName}</div></div>
          <div class="col-md-6"><div class="detail-label">Manufacturer</div><div class="detail-value">${batch.manufacturerName}</div></div>
          <div class="col-md-6"><div class="detail-label">Licence No.</div><div class="detail-value"><code>${batch.licenceNumber}</code></div></div>
          <div class="col-12"><div class="detail-label">Address</div><div class="detail-value">${batch.manufacturerAddress}</div></div>
        </div>
      </div>
    </div>

    <div class="detail-card mb-3">
      <div class="detail-card-header"><i class="bi bi-list-check me-2"></i>QA Verification Checklist</div>
      <div class="detail-card-body">
        <div class="checklist">
          ${[
            'Product information verified',
            'Batch number verified',
            'Manufacturing date verified',
            'Expiry date verified',
            'Manufacturing licence verified',
            'Product identification code verified',
            'QR / link information verified',
            'Packaging information verified'
          ].map((item, i) => `
            <div class="form-check checklist-item mb-2">
              <input class="form-check-input" type="checkbox" id="check${i}" onchange="checkAllChecked()">
              <label class="form-check-label" for="check${i}">${item}</label>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <div class="detail-card mb-3">
      <div class="detail-card-header">QA Remarks</div>
      <div class="detail-card-body">
        <textarea id="qaRemarks" class="form-control" rows="3" placeholder="Enter QA remarks (required for rejection)…"></textarea>
      </div>
    </div>

    <div class="d-flex gap-3">
      <button id="btnApprove" class="btn btn-success btn-lg" onclick="approveBatch(${batch.id})" disabled>
        <i class="bi bi-check-circle me-2"></i>Approve Batch
      </button>
      <button class="btn btn-danger btn-lg" onclick="rejectBatch(${batch.id})">
        <i class="bi bi-x-circle me-2"></i>Reject Batch
      </button>
      <a href="batches.html" class="btn btn-secondary btn-lg ms-auto">
        <i class="bi bi-arrow-left me-1"></i>Back
      </a>
    </div>`;
}

function checkAllChecked() {
  const checks = document.querySelectorAll('.checklist-item input[type=checkbox]');
  const allChecked = Array.from(checks).every(c => c.checked);
  const btn = document.getElementById('btnApprove');
  if (btn) btn.disabled = !allChecked;
}

function approveBatch(id) {
  const remarks = document.getElementById('qaRemarks')?.value || 'All information verified. Batch approved.';
  opvsConfirm('Approve Batch', 'Are you sure you want to approve this batch? This action cannot be undone.', () => {
    const batch = OPVS_STATE.batches.find(b => b.id == id);
    if (batch) {
      batch.batchStatus = 'Approved';
      batch.approvedBy = OPVS_AUTH.currentUser()?.username || 'qa';
      batch.approvedDate = opvsCurrentTime();
      batch.qaRemarks = remarks || 'All information verified. Batch approved.';
    }
    OPVS_STATE.auditTrail.unshift({
      datetime: opvsCurrentTime(),
      user: OPVS_AUTH.currentUser()?.username || 'qa',
      role: 'QA Officer',
      activity: 'Batch Approved',
      batch: batch?.batchNo || '',
      details: 'QA checklist completed. Batch approved.',
      ip: '192.168.1.25'
    });

    showApprovalSuccess(batch);
  });
}

function showApprovalSuccess(batch) {
  const el = document.getElementById('qaDetailPanel');
  if (!el) return;
  el.innerHTML = `
    <div class="text-center py-5">
      <div class="approval-success-icon mb-4">
        <i class="bi bi-check-circle-fill text-success" style="font-size:5rem;"></i>
      </div>
      <h3 class="text-success mb-2">Batch Approved Successfully</h3>
      <p class="text-muted mb-4">Batch <strong>${batch.batchNo}</strong> has been approved by QA. You can now generate the verification link.</p>
      <div class="d-flex gap-3 justify-content-center">
        <a href="qr-generation.html?id=${batch.id}" class="btn btn-success btn-lg">
          <i class="bi bi-qr-code me-2"></i>Generate Verification Link
        </a>
        <a href="batches.html" class="btn btn-outline-secondary btn-lg">
          <i class="bi bi-table me-2"></i>Batch List
        </a>
      </div>
    </div>`;
  opvsToast('Batch approved successfully!', 'success');

  const listEl = document.getElementById('qaPendingList');
  if (listEl) {
    const pending = OPVS_STATE.batches.filter(b => b.batchStatus === 'Pending QA Approval');
    if (!pending.length) listEl.innerHTML = '<div class="alert alert-success mt-2"><i class="bi bi-check-circle me-2"></i>No pending batches.</div>';
  }
}

function rejectBatch(id) {
  const remarks = document.getElementById('qaRemarks')?.value;
  if (!remarks || remarks.trim() === '') {
    opvsToast('Please enter rejection remarks before rejecting.', 'warning');
    return;
  }
  opvsConfirm('Reject Batch', 'Are you sure you want to reject this batch?', () => {
    const batch = OPVS_STATE.batches.find(b => b.id == id);
    if (batch) {
      batch.batchStatus = 'Rejected';
      batch.qaRemarks = remarks;
    }
    opvsToast('Batch has been rejected.', 'danger');
    setTimeout(() => { window.location.href = 'batches.html'; }, 1500);
  });
}
