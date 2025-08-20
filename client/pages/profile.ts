import '@shoelace-style/shoelace';
import { el } from '@webtaku/el';

type ToastVariant = 'primary' | 'success' | 'neutral' | 'warning' | 'danger';

async function toast(
  variant: ToastVariant,
  message: string,
  opts: { title?: string; duration?: number } = {}
) {
  const { title, duration = 3000 } = opts;

  const alert = el(
    'sl-alert',
    {
      variant,
      closable: true,
      duration, // auto-close 시간
    },
    el('sl-icon', {
      slot: 'icon',
      name:
        variant === 'success'
          ? 'check2-circle'
          : variant === 'warning'
            ? 'exclamation-triangle'
            : variant === 'danger'
              ? 'exclamation-octagon'
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

const showError = (err: unknown) => {
  console.error(err);
  const host = qs<HTMLElement>('#profile-error');
  const msg = qs('#profile-error-message');
  if (msg) msg.textContent = err instanceof Error ? err.message : String(err);
  if (host) { host.classList.remove('hidden'); (host as any).open = true; }
};

(function bindProfilePage() {
  const meta = qs<HTMLDivElement>('#profile-meta');
  if (!meta) return;

  const account = meta.dataset.account ?? '';
  const gaiaName = meta.dataset.gaiaName ?? '';
  const isOwner = meta.dataset.isOwner === 'true';

  // Share
  qs<HTMLButtonElement>('#btn-share')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      toast('success', 'Link copied');
    } catch { toast('danger', 'Failed to copy link'); }
  });

  // Copy account
  qs<HTMLButtonElement>('#btn-copy-account')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(account);
      toast('success', 'Address copied');
    } catch { toast('danger', 'Failed to copy'); }
  });

  if (!isOwner) return;

  // === Owner actions ===
  qs<HTMLButtonElement>('#btn-rename')?.addEventListener('click', () => {
    // 외부 모듈/라우팅에 위임하도록 커스텀 이벤트로 넘깁니다.
    window.dispatchEvent(new CustomEvent('profile:rename', { detail: { account, gaiaName } }));
  });

  qs<HTMLButtonElement>('#btn-edit-profile')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('profile:edit', { detail: { account, gaiaName } }));
  });

  qs<HTMLButtonElement>('#btn-delete')?.addEventListener('click', async () => {
    window.dispatchEvent(new CustomEvent('profile:delete', { detail: { account, gaiaName } }));
  });
})();
