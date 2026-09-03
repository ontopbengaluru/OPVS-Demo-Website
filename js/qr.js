/**
 * OPVS – qr.js
 * QR code generation and verification link page logic.
 */

function qrPageInit() {
  const user = OPVS_AUTH.requireRole(['Administrator']);
  if (!user) return;
  opvsRenderSidebar('qr-generation.html');
  opvsRenderTopbar('QR & Verification Link', [
    { label: 'Dashboard', href: 'dashboard.html' },
    { label: 'Batch Management', href: 'batches.html' },
    { label: 'QR Generation' }
  ]);

  const id = opvsGetParam('id');
  const batch = OPVS_STATE.batches.find(b => b.id == id);

  if (!batch) {
    document.getElementById('qrContent').innerHTML = '<div class="alert alert-danger">Batch not found.</div>';
    return;
  }

  if (batch.batchStatus !== 'Approved') {
    document.getElementById('qrContent').innerHTML = `
      <div class="alert alert-warning">
        <i class="bi bi-exclamation-triangle me-2"></i>
        Batch must be <strong>Approved</strong> before generating a verification link. 
        Current status: ${opvsBatchStatusBadge(batch.batchStatus)}
      </div>`;
    return;
  }

  renderQRPage(batch);
}

function renderQRPage(batch) {
  const el = document.getElementById('qrContent');
  if (!el) return;

  // Use existing code if already generated, or generate a new demo one
  const code = batch.verificationCode || generateDemoCode();
  const url = batch.verificationUrl || `https://verify.ontoppharma.com/21/${code}`;
  const alreadyGenerated = !!batch.verificationCode;

  el.innerHTML = `
    <div class="row g-4">
      <!-- Left: Batch Info & Link -->
      <div class="col-lg-7">
        <div class="detail-card">
          <div class="detail-card-header"><i class="bi bi-box-seam me-2"></i>Batch Information</div>
          <div class="detail-card-body">
            <div class="row g-3">
              <div class="col-md-4"><div class="detail-label">Product</div><div class="detail-value fw-bold">${batch.productName}</div></div>
              <div class="col-md-4"><div class="detail-label">Batch No.</div><div class="detail-value fw-bold">${batch.batchNo}</div></div>
              <div class="col-md-4"><div class="detail-label">Status</div><div class="detail-value">${opvsBatchStatusBadge(batch.batchStatus)}</div></div>
              <div class="col-md-6"><div class="detail-label">Mfg. Date</div><div class="detail-value">${batch.mfgDate}</div></div>
              <div class="col-md-6"><div class="detail-label">Exp. Date</div><div class="detail-value">${batch.expDate}</div></div>
            </div>
          </div>
        </div>

        <div class="detail-card mt-3">
          <div class="detail-card-header"><i class="bi bi-link-45deg me-2"></i>Verification Link</div>
          <div class="detail-card-body">
            <div class="mb-3">
              <div class="detail-label">Unique Verification Code</div>
              <div class="d-flex align-items-center gap-2 mt-1">
                <span class="verification-code-display" id="verCode">${code}</span>
                ${alreadyGenerated ? opvsQrStatusBadge(batch.qrStatus) : '<span class="badge bg-secondary">Preview</span>'}
              </div>
            </div>
            <div class="mb-3">
              <div class="detail-label">Verification URL</div>
              <div class="input-group mt-1">
                <input type="text" class="form-control font-mono" id="verUrl" value="${url}" readonly>
                <button class="btn btn-outline-secondary" onclick="copyVerificationUrl()" title="Copy">
                  <i class="bi bi-clipboard" id="copyIcon"></i>
                </button>
                <a href="verify.html?code=${code}" target="_blank" class="btn btn-outline-info" title="Preview">
                  <i class="bi bi-box-arrow-up-right"></i>
                </a>
              </div>
              <small class="text-muted mt-1 d-block">
                <i class="bi bi-info-circle me-1"></i>
                Demo URL – static prototype. In production, this would be a real HTTPS endpoint.
              </small>
            </div>
            ${!alreadyGenerated ? `
              <button class="btn btn-success btn-lg w-100 mt-2" onclick="activateLink(${batch.id}, '${code}', '${url}')">
                <i class="bi bi-qr-code me-2"></i>Activate Verification Link & Generate QR
              </button>` : `
              <div class="alert alert-success mb-0">
                <i class="bi bi-check-circle me-2"></i>Verification link is <strong>active</strong>. 
                Generated: ${batch.linkGeneratedDate}
              </div>`}
          </div>
        </div>

        <div class="detail-card mt-3">
          <div class="detail-card-header"><i class="bi bi-info-circle me-2"></i>Why a Short Code?</div>
          <div class="detail-card-body">
            <p class="mb-2 text-muted">
              The verification URL encodes only an 8-character code, not full product information. 
              This solves the <strong>50-character limitation</strong> of carton coding machines while 
              enabling full product authentication via the backend lookup.
            </p>
            <div class="row text-center g-2">
              <div class="col-6">
                <div class="qr-stat-card bg-danger-subtle">
                  <div class="fs-5 fw-bold text-danger">50 chars</div>
                  <div class="small text-muted">Carton machine limit</div>
                </div>
              </div>
              <div class="col-6">
                <div class="qr-stat-card bg-success-subtle">
                  <div class="fs-5 fw-bold text-success">${url.length} chars</div>
                  <div class="small text-muted">Our verification URL</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: QR Code Preview -->
      <div class="col-lg-5">
        <div class="detail-card h-100">
          <div class="detail-card-header"><i class="bi bi-qr-code me-2"></i>QR Code Preview</div>
          <div class="detail-card-body text-center">
            <div class="qr-container mb-3">
              <div id="qrcode"></div>
              <div class="qr-demo-label">Demo QR – Static Prototype</div>
            </div>
            <div class="qr-label mb-4">
              <div class="fw-bold fs-5">${batch.productName}</div>
              <div class="text-muted">Batch: ${batch.batchNo}</div>
              <div class="text-muted small">Mfg: ${batch.mfgDate} | Exp: ${batch.expDate}</div>
            </div>
            <div class="d-grid gap-2">
              <button class="btn btn-primary" onclick="downloadQR('${batch.productName}', '${batch.batchNo}')">
                <i class="bi bi-download me-2"></i>Download QR Code
              </button>
              <a href="verify.html?code=${code}" target="_blank" class="btn btn-outline-info">
                <i class="bi bi-eye me-2"></i>Preview Verification Page
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  // Generate QR code
  setTimeout(() => {
    const qrEl = document.getElementById('qrcode');
    if (qrEl && window.QRCode) {
      new QRCode(qrEl, {
        text: url,
        width: 200,
        height: 200,
        colorDark: '#1a3a5c',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    }
  }, 100);
}

function activateLink(batchId, code, url) {
  opvsConfirm('Activate Verification Link', 'This will activate the verification link and generate the QR code. Continue?', () => {
    const batch = OPVS_STATE.batches.find(b => b.id === batchId);
    if (batch) {
      batch.verificationCode = code;
      batch.verificationUrl = url;
      batch.qrStatus = 'Active';
      batch.linkGeneratedDate = opvsCurrentTime();
    }
    OPVS_STATE.auditTrail.unshift({
      datetime: opvsCurrentTime(),
      user: OPVS_AUTH.currentUser()?.username || 'admin',
      role: 'Administrator',
      activity: 'Verification Link Generated',
      batch: batch?.batchNo || '',
      details: `Verification code ${code} generated. URL activated.`,
      ip: '192.168.1.10'
    });
    opvsToast('Verification link activated!', 'success');
    renderQRPage(batch);
  });
}

function copyVerificationUrl() {
  const url = document.getElementById('verUrl')?.value;
  if (!url) return;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      opvsToast('Verification URL copied to clipboard!', 'success');
      const icon = document.getElementById('copyIcon');
      if (icon) { icon.className = 'bi bi-check'; setTimeout(() => { icon.className = 'bi bi-clipboard'; }, 2000); }
    });
  } else {
    opvsToast('Copy: ' + url, 'info');
  }
}

function downloadQR(productName, batchNo) {
  const canvas = document.querySelector('#qrcode canvas');
  if (!canvas) { opvsToast('QR code not yet rendered.', 'warning'); return; }
  const link = document.createElement('a');
  link.download = `QR_${productName}_${batchNo}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  opvsToast(`QR code downloaded: QR_${productName}_${batchNo}.png`, 'success');
}

function generateDemoCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
