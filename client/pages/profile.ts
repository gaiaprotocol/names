import '@shoelace-style/shoelace';
import { el } from '@webtaku/el';
import { tokenManager, wagmiConfig } from '@gaiaprotocol/client-common';
import { getAccount, watchAccount } from '@wagmi/core';

type ToastVariant = 'primary' | 'success' | 'neutral' | 'warning' | 'danger';

async function toast(variant: ToastVariant, message: string, opts: { title?: string; duration?: number } = {}) {
  const { title, duration = 3000 } = opts;
  const alert = el(
    'sl-alert',
    { variant, closable: true, duration },
    el('sl-icon', {
      slot: 'icon',
      name: variant === 'success' ? 'check2-circle'
        : variant === 'warning' ? 'exclamation-triangle'
          : variant === 'danger' ? 'exclamation-octagon'
            : 'info-circle',
    }),
    title ? el('strong', title) : null,
    title ? el('br') : null,
    message
  );
  document.body.appendChild(alert);
  await customElements.whenDefined('sl-alert');
  (alert as any).toast();
}

function qs<T extends Element = Element>(sel: string, root: ParentNode | Document = document) {
  return root.querySelector(sel) as T | null;
}

function showError(err: unknown) {
  console.error(err);
  const host = qs<HTMLElement>('#profile-error');
  const msg = qs('#profile-error-message');
  if (msg) msg.textContent = err instanceof Error ? err.message : String(err);
  if (host) { host.classList.remove('hidden'); (host as any).open = true; }
}

function getMyAddress(): `0x${string}` | null {
  const a = getAccount(wagmiConfig);
  if (a?.address) return a.address as `0x${string}`;
  // fallbacks if your tokenManager exposes address
  // @ts-ignore
  if (typeof tokenManager.getAddress === 'function') return tokenManager.getAddress() as `0x${string}` | null;
  // @ts-ignore
  const rec = tokenManager.get?.();
  // @ts-ignore
  if (rec?.address) return rec.address as `0x${string}`;
  return null;
}

function updateOwnerUI(isOwner: boolean) {
  document.querySelectorAll<HTMLElement>('[data-owner-only]').forEach((el) => {
    el.classList.toggle('hidden', !isOwner);
  });
}

function bindCommonActions(account: string, gaiaName: string) {
  qs<HTMLButtonElement>('#btn-share')?.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(location.href); toast('success', 'Link copied'); }
    catch { toast('danger', 'Failed to copy link'); }
  });

  qs<HTMLButtonElement>('#btn-copy-account')?.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(account); toast('success', 'Address copied'); }
    catch { toast('danger', 'Failed to copy'); }
  });

  qs<HTMLButtonElement>('#btn-rename')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('profile:rename', { detail: { account, gaiaName } }));
  });
  qs<HTMLButtonElement>('#btn-edit-profile')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('profile:edit', { detail: { account, gaiaName } }));
  });
  qs<HTMLButtonElement>('#btn-delete')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('profile:delete', { detail: { account, gaiaName } }));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const meta = qs<HTMLDivElement>('#profile-meta');
  if (!meta) return;

  const account = meta.dataset.account ?? '';
  const gaiaName = meta.dataset.gaiaName ?? '';

  bindCommonActions(account, gaiaName);

  const mine = getMyAddress();
  updateOwnerUI(!!mine && !!account && mine.toLowerCase() === account.toLowerCase());

  watchAccount(wagmiConfig, {
    onChange() {
      const addr = getMyAddress();
      updateOwnerUI(!!addr && !!account && addr.toLowerCase() === account.toLowerCase());
    }
  });

  tokenManager.on?.('signedIn', () => {
    const addr = getMyAddress();
    updateOwnerUI(!!addr && !!account && addr.toLowerCase() === account.toLowerCase());
  });
  tokenManager.on?.('signedOut', () => updateOwnerUI(false));
});

(window as any).addEventListener('profile:rename', (ev: CustomEvent) => {
  const { account, gaiaName } = ev.detail;
  // 필요하다면 account, gaiaName을 쿼리 파라미터로 넘기기
  window.location.href = `/?rename=1&account=${account}&gaiaName=${gaiaName}`;
});
