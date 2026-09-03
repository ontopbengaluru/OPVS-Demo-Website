/**
 * OPVS – verification.js
 * Public verification page logic. Reads ?code= and shows valid/expired/invalid.
 */

function verificationPageInit() {
  const code = opvsGetParam('code');
  const el = document.getElementById('verificationResult');
  if (!el) return;

  if (!code) {
    showInvalid(el, null);
    return;
  }

  const record = OPVS_DATA.verificationCodes[code];
  if (!record) {
    showInvalid(el, code);
    return;
  }

  const batch = OPVS_DATA.batches.find(b => b.id === record.batchId);
  if (!batch) {
    showInvalid(el, code);
    return;
  }

  if (record.status === 'expired') {
    showExpired(el, code, batch);
  } else {
    showValid(el, code, batch);
  }
}

function showValid(el, code, batch) {
  const history = OPVS_DATA.verificationHistory.filter(h => h.code === code).slice(0, 8);
  const historyRows = history.map(h => `
    <tr>
      <td>${h.date}</td>
      <td><span class="badge bg-success">${h.result}</span></td>
      <td>${h.location}</td>
    </tr>`).join('');

  el.innerHTML = `
    <div class="verify-result verify-valid">
      <div class="verify-icon-wrap valid">
        <i class="bi bi-shield-check"></i>
      </div>
      <h2 class="verify-title valid-title">✓ Product Verification Successful</h2>
      <p class="verify-subtitle">Congratulations! You have verified a genuine product from <strong>Ontop Pharmaceuticals Pvt. Ltd.</strong></p>

      <div class="verify-table-wrapper">
        <table class="table verify-info-table">
          <tbody>
            <tr><th>Verification Code</th><td><code class="fs-6">${code}</code></td></tr>
            <tr><th>Unique Product Identification Code</th><td>${batch.productCode}</td></tr>
            <tr><th>Generic Name</th><td>${batch.genericName}</td></tr>
            <tr><th>Brand Name</th><td>${batch.brandName}</td></tr>
            <tr><th>Manufacturer</th><td>${batch.manufacturerName}</td></tr>
            <tr><th>Manufacturer Address</th><td>${batch.manufacturerAddress}</td></tr>
            <tr><th>Batch No.</th><td><strong>${batch.batchNo}</strong></td></tr>
            <tr><th>Mfg. Date</th><td>${batch.mfgDate}</td></tr>
            <tr><th>Exp. Date</th><td>${batch.expDate}</td></tr>
            <tr><th>Manufacturing Licence No.</th><td><code>${batch.licenceNumber}</code></td></tr>
            <tr><th>Dosage Form</th><td>${batch.dosageForm}</td></tr>
            <tr><th>Pack Size</th><td>${batch.packSize}</td></tr>
            <tr><th>Market</th><td>${batch.market}</td></tr>
          </tbody>
        </table>
      </div>

      <div class="verify-count-box valid-count">
        <i class="bi bi-bar-chart me-2"></i>
        <strong>This code has been verified ${batch.verificationCount} times.</strong>
        <small class="d-block text-muted mt-1">Demo static data</small>
      </div>

      <details class="mt-4 text-start">
        <summary class="text-muted small" style="cursor:pointer;">
          <i class="bi bi-clock-history me-1"></i>Recent Verification History (Demo Data)
        </summary>
        <div class="table-responsive mt-3">
          <table class="table table-sm table-bordered">
            <thead class="table-light">
              <tr><th>Date / Time</th><th>Result</th><th>Location</th></tr>
            </thead>
            <tbody>${historyRows}</tbody>
          </table>
          <small class="text-muted"><i class="bi bi-info-circle me-1"></i>Showing last 8 of ${batch.verificationCount} verifications. Static demo data.</small>
        </div>
      </details>
    </div>`;
}

function showExpired(el, code, batch) {
  el.innerHTML = `
    <div class="verify-result verify-expired">
      <div class="verify-icon-wrap expired">
        <i class="bi bi-exclamation-triangle"></i>
      </div>
      <h2 class="verify-title expired-title">⚠ Verification Link Expired</h2>
      <p class="verify-subtitle">This product verification link has expired. The product expiry date has passed.</p>

      <div class="alert alert-warning verify-status-banner">
        <strong>Verification Status: EXPIRED</strong><br>
        The product verification record is no longer valid because the product expiry date has passed.
      </div>

      <div class="verify-table-wrapper">
        <table class="table verify-info-table">
          <tbody>
            <tr><th>Verification Code</th><td><code>${code}</code></td></tr>
            <tr><th>Product</th><td>${batch.productName}</td></tr>
            <tr><th>Batch No.</th><td><strong>${batch.batchNo}</strong></td></tr>
            <tr><th>Manufacturing Date</th><td>${batch.mfgDate}</td></tr>
            <tr><th>Expiry Date</th><td><span class="text-danger fw-bold">${batch.expDate}</span></td></tr>
            <tr><th>Status</th><td><span class="badge bg-danger">EXPIRED</span></td></tr>
          </tbody>
        </table>
      </div>

      <div class="verify-count-box expired-count">
        <i class="bi bi-info-circle me-2"></i>
        This code was verified ${batch.verificationCount} times before expiry.
      </div>

      <a href="verify.html" class="btn btn-warning mt-4">
        <i class="bi bi-arrow-left me-2"></i>Return to Verification Page
      </a>
    </div>`;
}

function showInvalid(el, code) {
  el.innerHTML = `
    <div class="verify-result verify-invalid">
      <div class="verify-icon-wrap invalid">
        <i class="bi bi-x-circle"></i>
      </div>
      <h2 class="verify-title invalid-title">✕ Verification Code Not Found</h2>
      <p class="verify-subtitle">
        The verification code <strong>${code ? `"${code}"` : 'provided'}</strong> could not be found. 
        Please verify the code or scan the QR code again.
      </p>

      <div class="alert alert-danger verify-status-banner">
        <strong>Verification Status: INVALID</strong><br>
        No product record matches the provided verification code. 
        If you believe this is an error, please contact the retailer or manufacturer.
      </div>

      <div class="verify-invalid-tips">
        <h6 class="mb-3"><i class="bi bi-lightbulb me-2"></i>What to do?</h6>
        <ul class="list-unstyled">
          <li class="mb-2"><i class="bi bi-check2 me-2 text-primary"></i>Check the QR code on the product carton and try scanning again.</li>
          <li class="mb-2"><i class="bi bi-check2 me-2 text-primary"></i>Ensure the code is entered exactly as printed.</li>
          <li class="mb-2"><i class="bi bi-check2 me-2 text-primary"></i>Contact the retailer if the issue persists.</li>
          <li class="mb-2"><i class="bi bi-exclamation-triangle me-2 text-warning"></i>A code that cannot be verified may indicate a counterfeit product.</li>
        </ul>
      </div>

      <a href="verify.html" class="btn btn-outline-secondary mt-3">
        <i class="bi bi-arrow-left me-2"></i>Return to Verification Page
      </a>
    </div>`;
}

// ─── Standalone verify landing (no code param) ────────────────────────────────
function verifyLandingInit() {
  const el = document.getElementById('verificationResult');
  if (!el) return;
  el.innerHTML = `
    <div class="verify-result verify-landing">
      <div class="verify-icon-wrap neutral">
        <i class="bi bi-qr-code-scan"></i>
      </div>
      <h2 class="verify-title">Product Verification</h2>
      <p class="verify-subtitle">Scan the QR code on your product carton, or enter the verification code below.</p>
      <div class="input-group mt-4 mb-3" style="max-width:420px;margin:auto;">
        <input type="text" id="manualCode" class="form-control form-control-lg text-center font-mono" 
               placeholder="Enter verification code…" maxlength="20"
               style="letter-spacing:2px;text-transform:uppercase;">
        <button class="btn btn-primary btn-lg" onclick="manualVerify()">
          <i class="bi bi-search me-1"></i>Verify
        </button>
      </div>
      <p class="text-muted small">
        <i class="bi bi-info-circle me-1"></i>
        Demo codes: <code>X7K92M4P</code> (valid) · <code>OLD8X29P</code> (expired) · Any other code (invalid)
      </p>
    </div>`;
}

function manualVerify() {
  const code = document.getElementById('manualCode')?.value?.trim()?.toUpperCase();
  if (!code) { opvsToast('Please enter a verification code.', 'warning'); return; }
  window.location.href = `verify.html?code=${code}`;
}
