import {
  createAddressAvatar,
  createRainbowKit,
  openWalletConnectModal,
  shortenAddress,
  tokenManager,
  wagmiConfig,
} from '@gaiaprotocol/client-common';
import { disconnect, getAccount, watchAccount } from '@wagmi/core';
import { el } from '@webtaku/el';
import { requestLogin } from './auth/login';
import { signMessage } from './auth/siwe';
import { validateToken } from './auth/validate';
import { showErrorAlert } from './components/alert';
import { createNameSearchForm } from './components/name-search-form';
import { fetchMyGaiaName } from './api/gaia-name'; // ✅ 당신 함수 사용
import './main.css';

// pages
import './pages/register-name';
import './pages/profile';

// -----------------------------------------------------------------------------
// Bootstrap
// -----------------------------------------------------------------------------
document.body.appendChild(createRainbowKit());
document.querySelector('.name-search-form-container')?.append(createNameSearchForm());
const connectButtonContainer = document.getElementById('connect-button-container')!;

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------
const AUTO_PROMPT_ON_CONNECT = false;

let authInitialized = false;
let requireSignature = true;
let lastKnownAddress: `0x${string}` | null = null;

// Top-right label: prefer Gaia name if present
let identityLabel: string | null = null; // e.g., "yj.gaia"
let identityLoaded = false;

// ── single-flight / debounce guards ───────────────────────────────────────────
let identityLoadTask: Promise<void> | null = null; // in-flight promise
let loadedForToken: string | null = null;          // last token that loaded identity
let loadTimer: number | null = null;               // debounce timer

// -----------------------------------------------------------------------------
// Token helper
// -----------------------------------------------------------------------------
function getAuthToken(): string | null {
  // @ts-ignore
  if (typeof tokenManager.getToken === 'function') return tokenManager.getToken();
  // @ts-ignore
  if (typeof tokenManager.get === 'function') {
    // @ts-ignore
    const rec = tokenManager.get();
    if (rec?.token) return rec.token as string;
  }
  try {
    const raw = localStorage.getItem('gaia_auth_token');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.token) return parsed.token as string;
    }
  } catch { }
  return null;
}

// -----------------------------------------------------------------------------
// Identity loader (single-flight + cache per token)
// -----------------------------------------------------------------------------
async function loadMyIdentity(force = false): Promise<void> {
  // Already signed-out → reset & exit
  if (!tokenManager.has()) {
    identityLabel = null;
    identityLoaded = true;
    loadedForToken = null;
    return;
  }

  const token = getAuthToken();
  if (!token) {
    identityLabel = null;
    identityLoaded = true;
    loadedForToken = null;
    return;
  }

  // If we already loaded for this token and not forced, skip network
  if (!force && loadedForToken === token) {
    identityLoaded = true;
    return;
  }

  // Coalesce concurrent calls
  if (identityLoadTask) {
    await identityLoadTask;
    return;
  }

  identityLoaded = false;
  identityLabel = null;

  identityLoadTask = (async () => {
    try {
      const me = await fetchMyGaiaName(token);       // ✅ 한 번만 호출
      identityLabel = typeof me?.name === 'string' && me.name ? `${me.name.trim()}.gaia` : null;
    } catch {
      // 404 등은 이름 없음 → null 유지
      identityLabel = null;
    } finally {
      identityLoaded = true;
      loadedForToken = token;
      identityLoadTask = null;
    }
  })();

  await identityLoadTask;
}

// 이벤트 폭주를 한 번으로 모으기
function scheduleLoadIdentity(force = false) {
  if (loadTimer !== null) return;
  loadTimer = window.setTimeout(async () => {
    loadTimer = null;
    await loadMyIdentity(force);
    renderConnect();
  }, 0);
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
function ensureWalletConnected(): `0x${string}` {
  const account = getAccount(wagmiConfig);
  if (!account.isConnected || !account.address) throw new Error('No wallet connected');
  return account.address;
}

async function signAndLogin(): Promise<void> {
  const address = ensureWalletConnected();
  const signature = await signMessage(address);
  const token = await requestLogin(address, signature);

  tokenManager.set(token, address);
  requireSignature = false;
  lastKnownAddress = address;

  scheduleLoadIdentity(true);
}

// -----------------------------------------------------------------------------
// Sign dialog (Shoelace)
// -----------------------------------------------------------------------------
let dialog: any | null = null;
let dialogOpen = false;

function buildDialog() {
  if (dialog) return dialog;

  const title = el('div', 'Signature Required', { style: { fontWeight: '600', fontSize: '16px', marginBottom: '8px' } });
  const message = el('p', 'To access Gaia Names, please sign a message with your connected wallet.');
  const cancelBtn = el('sl-button', 'Cancel', { variant: 'default' });
  const signBtn = el('sl-button', 'Sign & Continue', { variant: 'primary' });
  const footer = el('div', cancelBtn, signBtn, { style: { display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' } });
  dialog = el('sl-dialog', el('div', title, message, footer), { label: 'Authentication Required' });

  let programmaticHide = false;
  dialog.addEventListener('sl-request-close', (ev: any) => {
    if (programmaticHide) return;
    ev.preventDefault();
    programmaticHide = true;
    dialog!.hide();
    programmaticHide = false;
    dialogOpen = false;
  });

  cancelBtn.addEventListener('click', () => dialog!.hide());
  signBtn.addEventListener('click', async () => {
    (signBtn as any).loading = true;
    try {
      await signAndLogin();
      programmaticHide = true;
      dialog!.hide();
      dialogOpen = false;
      programmaticHide = false;
    } catch (err) {
      console.error(err);
      showErrorAlert('Error', err instanceof Error ? err.message : String(err));
      dialog!.hide();
    } finally {
      (signBtn as any).loading = false;
    }
  });

  document.body.appendChild(dialog);
  return dialog;
}

function openSignDialog() {
  if (dialogOpen) return;
  const d = buildDialog();
  dialogOpen = true;
  d.show();
}

// -----------------------------------------------------------------------------
// Top-right connect / account dropdown
// -----------------------------------------------------------------------------
function renderConnect() {
  connectButtonContainer.innerHTML = '';

  if (tokenManager.has()) {
    const address =
      getAccount(wagmiConfig).address ??
      (tokenManager.getAddress() as `0x${string}` | null) ??
      lastKnownAddress;

    const label =
      (identityLoaded && identityLabel) ? identityLabel :
        (address ? shortenAddress(address) : 'Account');

    const btn = el('sl-button', label, { slot: 'trigger', pill: true });
    if (address) {
      const avatar = createAddressAvatar(address);
      avatar.setAttribute('slot', 'prefix');
      Object.assign(avatar.style, { width: '22px', height: '22px', borderRadius: '9999px' });
      btn.prepend(avatar);
    }

    const menu = el(
      'sl-menu',
      el('sl-menu-item', identityLabel || 'Profile', { 'data-action': 'profile' }),
      el('sl-menu-item', 'Logout', { 'data-action': 'logout' })
    );

    const dropdown = el('sl-dropdown', btn, menu, { placement: 'bottom-end', distance: 6 });

    menu.addEventListener('sl-select', async (e: any) => {
      const action = e.detail?.item?.getAttribute('data-action');
      try {
        if (action === 'logout') {
          tokenManager.clear();
          await disconnect(wagmiConfig);
          requireSignature = true;
          lastKnownAddress = null;
          identityLabel = null;
          identityLoaded = true;
          loadedForToken = null;
          renderConnect();
        } else if (action === 'profile') {
          if (identityLabel) window.location.href = `/${identityLabel}`;
        }
      } catch (err) {
        console.error(err);
        showErrorAlert('Error', err instanceof Error ? err.message : String(err));
      }
    });

    connectButtonContainer.appendChild(dropdown);
    return;
  }

  // Wallet connected but not signed
  const account = getAccount(wagmiConfig);
  if (account.isConnected) {
    const wrapper = el('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } });

    const signBtn = el('sl-button', 'Sign & Continue', {
      variant: 'primary',
      onclick: () => { (async () => { try { await signAndLogin(); } catch (err) { console.error(err); showErrorAlert('Error', err instanceof Error ? err.message : String(err)); } })(); },
    });

    const disconnectBtn = el('sl-button', el('sl-icon', { name: 'box-arrow-right' }), {
      variant: 'default',
      onclick: () => {
        tokenManager.clear();
        disconnect(wagmiConfig);
        identityLabel = null;
        identityLoaded = true;
        loadedForToken = null;
      },
    });

    wrapper.append(signBtn, disconnectBtn);
    connectButtonContainer.appendChild(wrapper);
    return;
  }

  // Not connected
  const connectBtn = el('sl-button', 'Connect', {
    variant: 'primary',
    onclick: () => openWalletConnectModal(),
  });
  connectButtonContainer.appendChild(connectBtn);
}

// First paint
renderConnect();

// -----------------------------------------------------------------------------
// Wallet state watcher (coalesced)
// -----------------------------------------------------------------------------
watchAccount(wagmiConfig, {
  async onChange(account) {
    lastKnownAddress = account.address ?? lastKnownAddress;

    if (account.isConnected && account.address && authInitialized && requireSignature) {
      openSignDialog();
    }

    if (
      AUTO_PROMPT_ON_CONNECT &&
      account.isConnected &&
      account.address &&
      authInitialized &&
      requireSignature &&
      !tokenManager.has()
    ) {
      openSignDialog();
    }

    if (account.isConnected && tokenManager.has()) {
      scheduleLoadIdentity(false); // 🔸 여러 이벤트가 와도 1회로 합침
    } else {
      identityLabel = null;
      identityLoaded = true;
      loadedForToken = null;
    }

    renderConnect();

    if (!account.isConnected && dialog?.open) {
      dialog.hide();
      dialogOpen = false;
    }
  },
});

// -----------------------------------------------------------------------------
// Auth bootstrap
// -----------------------------------------------------------------------------
(async function initAuth() {
  try {
    const ok = await validateToken();
    if (ok && tokenManager.has()) {
      requireSignature = false;
      lastKnownAddress = (tokenManager.getAddress() as `0x${string}` | null) ?? lastKnownAddress;
    } else {
      tokenManager.clear();
      requireSignature = true;
    }
  } catch {
    tokenManager.clear();
    requireSignature = true;
  } finally {
    authInitialized = true;
    scheduleLoadIdentity(true); // 🔸 초기 한 번
    renderConnect();
  }
})();

// -----------------------------------------------------------------------------
// tokenManager events (coalesced)
// -----------------------------------------------------------------------------
tokenManager.on?.('signedIn', () => { scheduleLoadIdentity(true); });
tokenManager.on?.('signedOut', () => {
  identityLabel = null;
  identityLoaded = true;
  loadedForToken = null;
  renderConnect();
});

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('rename') === '1') {
    const input = document.querySelector<HTMLInputElement>('sl-input');
    if (input) {
      // Shoelace sl-input 내부 실제 input 접근
      setTimeout(() => {
        (input.shadowRoot?.querySelector('input') as HTMLInputElement)?.focus();
      }, 100); // DOM이 완전히 준비된 뒤 포커스
    }
  }
});