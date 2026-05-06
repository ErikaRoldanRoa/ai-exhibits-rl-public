/* ============================================================================
 * AI-Exhibits · Reinforcement Learning & Sliding Puzzles
 * Floating tooltip helper for the interactive trainers.
 *
 * © 2026 Dr. Erika Roldán Roa. All rights reserved by the author.
 * Licensed: CC BY-NC-ND 4.0. See LICENSE.
 * ============================================================================ */

(function () {
  'use strict';

  const MARGIN = 12;          // viewport edge padding
  const MAX_WIDTH = 320;      // soft cap for long text
  const OFFSET = 10;          // gap between trigger and tooltip

  let tip = null;
  let arrow = null;
  let currentTarget = null;

  function ensureTip() {
    if (tip) return tip;
    tip = document.createElement('div');
    tip.className = 'rl-tip';
    tip.setAttribute('role', 'tooltip');
    tip.setAttribute('aria-hidden', 'true');
    arrow = document.createElement('div');
    arrow.className = 'rl-tip-arrow';
    tip.appendChild(arrow);
    const body = document.createElement('div');
    body.className = 'rl-tip-body';
    tip.appendChild(body);
    document.body.appendChild(tip);
    return tip;
  }

  function show(el) {
    if (!el) return;
    const text = el.getAttribute('data-tooltip') || el.getAttribute('data-tip');
    if (!text) return;
    if (currentTarget === el && tip && tip.classList.contains('on')) return;
    currentTarget = el;
    const t = ensureTip();
    // Honour \n (literal or escaped) as line breaks; escape everything else.
    const body = t.querySelector('.rl-tip-body');
    const esc = (s) => s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
    body.innerHTML = esc(text).replace(/\\n|\n/g, '<br>');
    t.dataset.style = el.getAttribute('data-tooltip-style') || '';
    t.setAttribute('aria-hidden', 'false');
    // Put it offscreen first so we can measure natural size without flash.
    t.style.top = '-9999px';
    t.style.left = '0px';
    t.style.maxWidth = Math.min(MAX_WIDTH, window.innerWidth - 2 * MARGIN) + 'px';
    t.classList.add('measuring');
    requestAnimationFrame(() => position(el));
  }

  function position(el) {
    if (!el || !tip) return;
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scrollX = window.scrollX || window.pageXOffset || 0;
    const scrollY = window.scrollY || window.pageYOffset || 0;

    // Measure natural size at current max-width.
    const tr = tip.getBoundingClientRect();
    const tipW = tr.width;
    const tipH = tr.height;

    // Vertical placement: try above first; fall back to below if no room.
    let top;
    let placement = 'top';
    if (r.top - tipH - OFFSET >= MARGIN) {
      top = r.top - tipH - OFFSET;
    } else {
      top = r.bottom + OFFSET;
      placement = 'bottom';
    }

    // Horizontal: center on trigger, then clamp to viewport.
    const triggerCenter = r.left + r.width / 2;
    let left = triggerCenter - tipW / 2;
    left = Math.max(MARGIN, Math.min(left, vw - tipW - MARGIN));

    // Arrow x relative to tooltip left edge, pointing at trigger center.
    let arrowX = triggerCenter - left;
    arrowX = Math.max(14, Math.min(arrowX, tipW - 14));

    tip.style.top = (top + scrollY) + 'px';
    tip.style.left = (left + scrollX) + 'px';
    tip.dataset.placement = placement;
    tip.style.setProperty('--rl-tip-arrow-x', arrowX + 'px');
    tip.classList.remove('measuring');
    tip.classList.add('on');
  }

  function hide() {
    if (!tip) return;
    tip.classList.remove('on');
    tip.setAttribute('aria-hidden', 'true');
    currentTarget = null;
  }

  function onOver(e) {
    const el = e.target && e.target.closest && e.target.closest('[data-tooltip], [data-tip]');
    if (el) {
      const text = el.getAttribute('data-tooltip') || el.getAttribute('data-tip');
      if (text) show(el);
    }
  }
  function onOut(e) {
    const el = e.target && e.target.closest && e.target.closest('[data-tooltip], [data-tip]');
    if (el && el === currentTarget) {
      const related = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('[data-tooltip], [data-tip]');
      if (related !== el) hide();
    }
  }

  document.addEventListener('mouseover', onOver, true);
  document.addEventListener('mouseout', onOut, true);
  document.addEventListener('focusin', onOver, true);
  document.addEventListener('focusout', onOut, true);
  // Always hide on scroll/resize so stale positions don't linger.
  window.addEventListener('scroll', hide, true);
  window.addEventListener('resize', hide);

  // Touch + click handling: on touch devices, hover doesn't fire and tooltips
  // are otherwise unreachable. Tap on a (i) toggles its tooltip; tap elsewhere
  // dismisses.
  //
  // Critical: only intercept clicks on non-actionable tooltip triggers
  // (spans, divs — typically the (i) qmark spans). For actionable elements
  // (buttons, links), let the click through so their own handlers can run.
  // Stopping propagation indiscriminately broke bench-button loads
  // (B1–B6 on the trainers all carry data-tooltip and would silently fail).
  document.addEventListener('click', (e) => {
    const el = e.target && e.target.closest && e.target.closest('[data-tooltip], [data-tip]');
    if (el) {
      const tag = (el.tagName || '').toLowerCase();
      const isActionable = tag === 'button' || tag === 'a'
        || el.hasAttribute('data-act') || el.getAttribute('role') === 'button';
      if (currentTarget === el && tip && tip.classList.contains('on')) {
        hide();
      } else {
        show(el);
      }
      // Only swallow the click for non-actionable tooltip triggers (i.e. the
      // (i) qmark spans). Actionable elements must still reach their handlers.
      if (!isActionable) e.stopPropagation();
      return;
    }
    if (currentTarget) hide();
  }, true);
})();
