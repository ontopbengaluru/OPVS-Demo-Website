/**
 * OPVS – app.js
 * Shared utilities: sidebar rendering, toasts, badges, breadcrumbs, modals.
 */

// ─── State (in-memory demo mutations) ────────────────────────────────────────
// Allows the demo to show state changes during a session without a database.
const OPVS_STATE = {
  batches: JSON.parse(JSON.stringify(OPVS_DATA.batches)), // deep copy
  auditTrail: JSON.parse(JSON.stringify(OPVS_DATA.auditTrail))
};

// ─── Sidebar HTML ─────────────────────────────────────────────────────────────
function opvsRenderSidebar(activePage) {
  const user = OPVS_AUTH.currentUser();
  if (!user) return;

  const isAdmin = user.role === 'Administrator';
  const isQA    = user.role === 'QA';

  const adminMenuItems = [
    { href: 'dashboard.html',    icon: 'bi-speedometer2',    label: 'Dashboard' },
    { href: 'batches.html',      icon: 'bi-table',           label: 'Batch Management' },
    { href: 'add-batch.html',    icon: 'bi-plus-circle',     label: 'Add Batch' },
    { href: 'qa-approval.html',  icon: 'bi-clipboard2-check',label: 'Pending Approval' },
    { href: 'qr-generation.html',icon: 'bi-qr-code',         label: 'QR / Verification Links' },
    { href: 'audit-trail.html',  icon: 'bi-journal-text',    label: 'Audit Trail' },
    { href: 'products.html',     icon: 'bi-capsule',         label: 'Product Master' },
    { href: 'manufacturer.html', icon: 'bi-building',        label: 'Manufacturer Details' },
    { href: 'reports.html',      icon: 'bi-bar-chart-line',  label: 'Reports' },
  ];

  const qaMenuItems = [
    { href: 'dashboard.html',   icon: 'bi-speedometer2',    label: 'Dashboard' },
    { href: 'qa-approval.html', icon: 'bi-clipboard2-check',label: 'Pending Approval' },
    { href: 'batches.html',     icon: 'bi-table',           label: 'Batch History' },
    { href: 'audit-trail.html', icon: 'bi-journal-text',    label: 'Audit Trail' },
    { href: 'reports.html',     icon: 'bi-bar-chart-line',  label: 'Reports' },
  ];

  const items = isQA ? qaMenuItems : adminMenuItems;

  const menuHtml = items.map(item => {
    const isActive = activePage === item.href ? 'active' : '';
    return `
      <li class="nav-item">
        <a class="nav-link ${isActive}" href="${item.href}">
          <i class="bi ${item.icon} me-2"></i>${item.label}
        </a>
      </li>`;
  }).join('');

  const roleBadge = isQA
    ? '<span class="badge bg-warning text-dark">QA Officer</span>'
    : '<span class="badge bg-primary">Administrator</span>';

  const html = `
    <div class="sidebar d-flex flex-column">
      <div class="sidebar-brand">
        <div class="sidebar-logo">
          <i class="bi bi-shield-check"></i>
        </div>
        <div>
          <div class="sidebar-title">OPVS</div>
          <div class="sidebar-subtitle">Verification System</div>
        </div>
      </div>

      <div class="sidebar-user">
        <div class="user-avatar">${user.username.charAt(0).toUpperCase()}</div>
        <div>
          <div class="user-name">${user.fullName}</div>
          <div class="mt-1">${roleBadge}</div>
        </div>
      </div>

      <nav class="sidebar-nav flex-grow-1">
        <ul class="nav flex-column">
          ${menuHtml}
        </ul>
      </nav>

      <div class="sidebar-footer">
        <a href="#" class="nav-link" onclick="OPVS_AUTH.logout(); return false;">
          <i class="bi bi-box-arrow-left me-2"></i>Logout
        </a>
        <div class="demo-label mt-2">Demo v1.0 | Static Prototype</div>
      </div>
    </div>`;

  const sidebar = document.getElementById('opvs-sidebar');
  if (sidebar) sidebar.innerHTML = html;
}

// ─── Top Navbar ───────────────────────────────────────────────────────────────
function opvsRenderTopbar(pageTitle, breadcrumbs) {
  const user = OPVS_AUTH.currentUser();
  const bc = breadcrumbs || [];
  const bcHtml = bc.map((b, i) => {
    if (i === bc.length - 1) return `<li class="breadcrumb-item active">${b.label}</li>`;
    return `<li class="breadcrumb-item"><a href="${b.href}">${b.label}</a></li>`;
  }).join('');

  const html = `
    <div class="topbar d-flex align-items-center justify-content-between px-4">
      <div>
        <h4 class="topbar-title mb-0">${pageTitle}</h4>
        ${bc.length ? `<nav aria-label="breadcrumb"><ol class="breadcrumb mb-0">${bcHtml}</ol></nav>` : ''}
      </div>
      <div class="d-flex align-items-center gap-3">
        <span class="demo-banner">
          <i class="bi bi-info-circle me-1"></i>Demo System – Static Prototype
        </span>
        <span class="text-muted small"><i class="bi bi-clock me-1"></i>${opvsCurrentTime()}</span>
        <button class="btn btn-sm btn-outline-danger" onclick="OPVS_AUTH.logout()">
          <i class="bi bi-box-arrow-left me-1"></i>Logout
        </button>
      </div>
    </div>`;

  const topbar = document.getElementById('opvs-topbar');
  if (topbar) topbar.innerHTML = html;
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function opvsToast(message, type = 'success', duration = 4000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
  }

  const icons = { success: 'bi-check-circle-fill', danger: 'bi-x-circle-fill', warning: 'bi-exclamation-triangle-fill', info: 'bi-info-circle-fill' };
  const id = 'toast_' + Date.now();

  const html = `
    <div id="${id}" class="toast align-items-center text-white bg-${type} border-0 show" role="alert">
      <div class="d-flex">
        <div class="toast-body">
          <i class="bi ${icons[type] || icons.info} me-2"></i>${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>`;

  container.insertAdjacentHTML('beforeend', html);
  setTimeout(() => { const el = document.getElementById(id); if (el) el.remove(); }, duration);
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function opvsBatchStatusBadge(status) {
  const map = {
    'Draft':               'badge-draft',
    'Pending QA Approval': 'badge-pending',
    'Approved':            'badge-approved',
    'Rejected':            'badge-rejected'
  };
  return `<span class="badge ${map[status] || 'bg-secondary'}">${status}</span>`;
}

function opvsQrStatusBadge(status) {
  const map = {
    'Active':        'badge-active',
    'Not Generated': 'badge-not-generated',
    'Expired':       'badge-expired'
  };
  return `<span class="badge ${map[status] || 'bg-secondary'}">${status}</span>`;
}

// ─── Utilities ────────────────────────────────────────────────────────────────
function opvsCurrentTime() {
  return new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function opvsGetParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function opvsConfirm(title, message, onConfirm) {
  document.getElementById('confirmModalTitle').textContent = title;
  document.getElementById('confirmModalBody').textContent = message;
  document.getElementById('confirmModalBtn').onclick = () => {
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
    modal.hide();
    onConfirm();
  };
  new bootstrap.Modal(document.getElementById('confirmModal')).show();
}

// ─── Confirm Modal (global) ───────────────────────────────────────────────────
function opvsInjectConfirmModal() {
  if (document.getElementById('confirmModal')) return;
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal fade" id="confirmModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="confirmModalTitle">Confirm Action</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" id="confirmModalBody"></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" id="confirmModalBtn">Confirm</button>
          </div>
        </div>
      </div>
    </div>`);
}

document.addEventListener('DOMContentLoaded', opvsInjectConfirmModal);
