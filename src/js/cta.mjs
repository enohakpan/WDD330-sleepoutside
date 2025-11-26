// CTA: show a registration modal on first visit only
const STORAGE_KEY = 'so_seen_register_cta_v1';
// TTL (ms) for how long before CTA should reappear
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
// shorter reminder TTL for "Remind me later"
const REMIND_MS = 1 * 60 * 60 * 1000; // 1 hour

function isHomePage() {
  // some dev servers may serve index.html at '/'
  const path = window.location.pathname || '';
  return path.endsWith('/') || path.endsWith('/index.html') || path === '';
}

function createModal() {
  const overlay = document.createElement('div');
  overlay.className = 'cta-overlay';
  overlay.innerHTML = `
    <div class="cta-modal" role="dialog" aria-modal="true" aria-labelledby="cta-title">
      <button class="cta-close" aria-label="Close">×</button>
      <h3 id="cta-title">Join SleepOutside — Win a Free Backpack!</h3>
      <p>Register with SleepOutside today and enter our giveaway for a chance to win a high-quality 30L backpack. Free to join — winners announced next month.</p>
      <div class="cta-actions">
        <a class="cta-primary" href="/register/index.html">Register & Enter Giveaway</a>
        <button class="cta-remind">Remind me later</button>
        <button class="cta-secondary">No thanks</button>
      </div>
      <p class="cta-note">We won’t show this again after you dismiss or register.</p>
    </div>`;

  // close handlers
  overlay.querySelector('.cta-close').addEventListener('click', () => closeModal(overlay));
  overlay.querySelector('.cta-secondary').addEventListener('click', () => closeModal(overlay));
  // when primary is clicked we mark as seen with a timestamp — they registered
  overlay.querySelector('.cta-primary').addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  });

  // remind me later — set the stored timestamp so the CTA will reappear after REMIND_MS
  const remindBtn = overlay.querySelector('.cta-remind');
  if (remindBtn) {
    remindBtn.addEventListener('click', () => {
      // store a synthetic timestamp that results in the CTA reappearing after REMIND_MS
      // we store: Date.now() - (TTL_MS - REMIND_MS)
      const ts = Date.now() - (TTL_MS - REMIND_MS);
      localStorage.setItem(STORAGE_KEY, String(ts));
      closeModal(overlay);
    });
  }

  return overlay;
}

function closeModal(node) {
  try { node.remove(); } catch (e) { node.parentNode && node.parentNode.removeChild(node); }
  // record the timestamp so CTA won't show until TTL expires
  localStorage.setItem(STORAGE_KEY, String(Date.now()));
}

export function initCTA() {
  // only run on home page and only once
  if (!isHomePage()) return;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    const ts = Number(raw);
    if (!Number.isNaN(ts)) {
      // if within TTL, do not show again
      if (Date.now() - ts < TTL_MS) return;
    } else {
      // legacy truthy value (eg 'true') — consider it seen
      return;
    }
  }

  // wait until DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showModal);
  } else {
    showModal();
  }
}

function showModal() {
  const modal = createModal();
  document.body.appendChild(modal);
  // focus trap accessibility: focus the primary action
  const primary = modal.querySelector('.cta-primary');
  if (primary) primary.focus();
}

// auto-init if module is imported
if (typeof window !== 'undefined') {
  initCTA();
}
