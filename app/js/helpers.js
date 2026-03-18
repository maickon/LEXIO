/**
 * LEXIO — Helper
 */

const Helper = (() => {

  // ── HELPERS ──────────────────────────────────────
  function _set(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function _emptyState(icon, title, sub) {
    return `<div class="empty-state"><div class="empty-icon">${icon}</div><div class="empty-title">${title}</div><div class="empty-sub">${sub}</div></div>`;
  }

  function _escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function _showSystemMessage(container, msg, pt) {
    const box = document.createElement('div');
    box.style.cssText = `
      margin-top: 14px;
      padding: 12px 14px;
      background: rgba(0,245,255,0.04);
      border: 1px solid rgba(0,245,255,0.15);
      border-left: 3px solid var(--cyan);
      border-radius: 0 6px 6px 0;
      animation: fadeUp 0.3s ease both;
    `;
    box.innerHTML = `
      <div style="font-family:var(--font-mono);font-size:0.55rem;color:var(--cyan);
                  letter-spacing:0.2em;margin-bottom:6px;display:flex;align-items:center;gap:6px">
        <span>◈</span> SYSTEM MESSAGE
      </div>
      <div style="font-size:0.92rem;color:var(--white);line-height:1.5;margin-bottom:4px">
        ${msg}
      </div>
      <div style="font-size:0.78rem;color:rgba(236,238,255,0.45);font-style:italic">
        ${pt}
      </div>
    `;
    container.appendChild(box);
  }

  return {
    _set, _emptyState, _escapeRegex, _showSystemMessage
  };
})();