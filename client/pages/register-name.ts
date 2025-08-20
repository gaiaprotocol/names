import { tokenManager } from '@gaiaprotocol/client-common';
import { fetchGaiaName, saveGaiaName } from '../api/gaia-name';
import { checkGodMode } from '../services/god-mode';

// ------------------------------ DOM helpers ------------------------------
const qs = <T extends Element = Element>(sel: string, root: ParentNode | Document = document) =>
  root.querySelector(sel) as T | null;
const show = (el: Element | null, on = true) => { if (el) el.classList.toggle('hidden', !on); };
const setText = (el: Element | null, text: string) => { if (el) el.textContent = text; };

function openError(err: unknown) {
  console.error(err);
  const alertEl = qs<any>('sl-alert#error-alert');
  const msg = qs('#error-alert-message');
  if (msg) setText(msg, err instanceof Error ? err.message : String(err));
  if (alertEl) {
    show(alertEl, false);      // hidden 제거
    alertEl.open = true;       // 여기서만 open
  }
}

function isNotFoundError(e: unknown) {
  const m = (e instanceof Error ? e.message : String(e)).toLowerCase();
  // fetchGaiaName는 !res.ok이면 throw Error(`Failed to fetch Gaia name: ${status}`)
  return m.includes('failed to fetch gaia name') && m.includes(': 404');
}

// tokenManager에서 Bearer 토큰 얻기 (구현에 따라 노출 API가 다를 수 있어 안전하게 캡처)
function getAuthToken(): string | null {
  // 1) 일반적인 접근자 시도
  // @ts-ignore
  if (typeof tokenManager.getToken === 'function') return tokenManager.getToken();
  // 2) 객체 리턴형 get() 시도
  // @ts-ignore
  if (typeof tokenManager.get === 'function') {
    // @ts-ignore
    const rec = tokenManager.get();
    if (rec?.token) return rec.token as string;
  }
  // 3) 내부 저장소를 사용하는 경우(프로젝트별 폴백)
  try {
    const raw = localStorage.getItem('gaia_auth_token');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.token) return parsed.token as string;
    }
  } catch {/* ignore */ }
  return null;
}

// ------------------------------ Main ------------------------------
async function load() {
  const card = qs<HTMLElement>('.register-name-view');
  if (!card) return;

  const username = card.getAttribute('data-username')?.trim().toLowerCase();
  const loading = qs<HTMLElement>('.loading-state', card);
  const notEligible = qs<HTMLElement>('.not-eligible', card);
  const form = qs<HTMLElement>('.register-form', card);

  // 초기엔 에러 알럿 감춤 (SSR에서 open 속성 넣지 마세요)
  const alertEl = qs<HTMLElement>('sl-alert#error-alert');
  show(alertEl, true);
  if ((alertEl as any)?.open) (alertEl as any).open = false;

  // Back
  qs<HTMLAnchorElement>('a.back', card)?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/';
  });

  if (!username) {
    show(loading, false);
    openError(new Error('Invalid state: missing username'));
    return;
  }

  // 로그인/토큰 확인
  if (!tokenManager.has()) {
    show(loading, false);
    // 간단 가드 UI
    const host = document.createElement('div');
    host.style.cssText = 'margin-top:12px;';
    const stack = card.closest('.center-stack') ?? card.parentElement ?? document.body;
    stack.insertBefore(host, card);
    host.innerHTML = `
      <div style="
        display:flex; flex-direction:column; align-items:center; justify-content:center;
        gap:12px; padding:32px 16px; text-align:center; border:1px dashed rgba(255,255,255,0.12);
        border-radius:16px; background:rgba(255,255,255,0.02);
      ">
        <h2 style="font-size:16px; font-weight:600; margin:0">Sign-in required</h2>
        <p style="color:#9CA3AF; margin:0">Connect your wallet and complete the signature to register a Gaia Name.</p>
        <p style="color:#9CA3AF; margin:0">Use the Connect button at the top-right, then return to this page.</p>
      </div>
    `;
    return;
  }

  // 주소/토큰 확보
  const address = (tokenManager.getAddress?.() as `0x${string}` | null) ?? null;
  const token = getAuthToken();

  if (!address) {
    show(loading, false);
    openError(new Error('Missing wallet address. Please reconnect.'));
    return;
  }
  if (!token) {
    show(loading, false);
    openError(new Error('Missing authorization token. Please sign in again.'));
    return;
  }

  try {
    // 1) God Mode 자격
    const eligible = await checkGodMode(address);
    if (!eligible) {
      show(loading, false);
      show(notEligible, true);
      qs('#btn-buy-gaia')?.addEventListener('click', () => {
        const d = document.createElement('sl-dialog') as any;
        d.label = '$GAIA Launch Schedule';
        d.innerHTML = `<div style="white-space:pre-wrap">\$GAIA will be launched in Q1 2025.\nStay tuned for more updates!</div>`;
        document.body.appendChild(d); d.show();
      });
      qs('#btn-buy-nft')?.addEventListener('click', () => {
        window.open('https://opensea.io/collection/gaia-protocol-gods', '_blank', 'noopener');
      });
      return;
    }

    // 2) 이름 중복 확인 (존재하면 redirect, 404면 사용 가능)
    let exists = false;
    try {
      await fetchGaiaName(username);
      exists = true;
    } catch (e) {
      if (!isNotFoundError(e)) throw e; // 404 외의 에러는 그대로 표출
    }
    if (exists) {
      window.location.replace(`/${username}.gaia`);
      return;
    }

    // 3) 등록 폼 표시
    show(loading, false);
    show(form, true);

    const btnCancel = qs<any>('#btn-cancel');
    const btnRegister = qs<any>('#btn-register');
    const progressArea = qs('#progress-area');
    const progress = qs<any>('#progress');
    const progressLabel = qs('#progress-label');

    const setProgress = (pct: number, label?: string) => {
      if (progress) progress.value = Math.max(0, Math.min(100, pct));
      if (label && progressLabel) setText(progressLabel, label);
      show(progressArea, true);
    };

    btnCancel?.addEventListener('click', () => (window.location.href = '/'));
    btnRegister?.addEventListener('click', async () => {
      try {
        btnRegister.loading = true;
        setProgress(10, 'Re-checking eligibility…');

        const stillEligible = await checkGodMode(address);
        if (!stillEligible) throw new Error('You are no longer eligible for God Mode.');

        setProgress(40, 'Registering name…');
        await saveGaiaName(username, token);

        setProgress(100, 'Done! Redirecting…');
        window.location.replace(`/${username}.gaia`);
      } catch (e) {
        openError(e);
      } finally {
        btnRegister.loading = false;
      }
    });
  } catch (e) {
    show(loading, false);
    openError(e);
  }
}

// 최초 로드 & 세션 변화에 반응
load();
tokenManager.on?.('signedIn', load);
tokenManager.on?.('signedOut', load);
