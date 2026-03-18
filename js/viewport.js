// ═══════════════════════════════════════════
// VIEWPORT PREVIEW (Admin)
// ═══════════════════════════════════════════
function setViewportPreview(mode) {
  localStorage.setItem('ngc-viewport-preview', mode);
  document.body.classList.remove('preview-tablet', 'preview-phone');
  if (mode === 'tablet') document.body.classList.add('preview-tablet');
  if (mode === 'phone')  document.body.classList.add('preview-phone');
  // Rebuild drawer to update active button state
  buildSettingsDrawer();
}

function initViewportPreview() {
  const mode = localStorage.getItem('ngc-viewport-preview') || 'desktop';
  document.body.classList.remove('preview-tablet', 'preview-phone');
  if (mode === 'tablet') document.body.classList.add('preview-tablet');
  if (mode === 'phone')  document.body.classList.add('preview-phone');
}

// ═══════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════
