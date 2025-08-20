
declare const GAIA_API_BASE_URI: string;

export async function fetchGaiaName(name: string): Promise<{ account: string, name: string }> {
  const res = await fetch(`${GAIA_API_BASE_URI}/get-name?name=${name}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error(`fetchGaiaName failed: ${res.status} ${res.statusText}`, text);
    throw new Error(`Failed to fetch Gaia name: ${res.status}`);
  }

  return await res.json();
}

export async function fetchMyGaiaName(
  token: string
): Promise<{ account: string; name: string }> {
  if (!token) throw new Error('Missing authorization token.');

  const res = await fetch(`${GAIA_API_BASE_URI}/my-name`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    let message = `Failed to fetch my Gaia name: ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch { }
    throw new Error(message);
  }

  return (await res.json()) as { account: string; name: string };
}

const BLACKLIST = ['gaia', 'gaiaprotocol', 'gaia_protocol'] as const;
const MAX_NAME_LENGTH = 100;

function isValidNameLocal(name: string): boolean {
  if (!name) return false;
  if (!/^[a-z0-9-]+$/.test(name)) return false;
  if (name.startsWith('-') || name.endsWith('-')) return false;
  if (name.includes('--')) return false;
  // NFC 정규화 동일성 체크
  if (name !== name.normalize('NFC')) return false;
  return true;
}

export type SaveGaiaNameResult = { ok: true };

export async function saveGaiaName(nameInput: string, token: string): Promise<SaveGaiaNameResult> {
  const name = nameInput.toLowerCase().trim();

  // 로컬 검증 (서버와 동일한 정책을 미리 적용)
  if (!name) {
    throw new Error('Name is required.');
  }
  if (name.length > MAX_NAME_LENGTH) {
    throw new Error(`The provided name exceeds the maximum length of ${MAX_NAME_LENGTH} characters.`);
  }
  if (!isValidNameLocal(name)) {
    throw new Error('The provided name contains invalid characters or format.');
  }
  if (BLACKLIST.includes(name as (typeof BLACKLIST)[number])) {
    throw new Error(`The name "${name}" is reserved and cannot be used.`);
  }
  if (!token) {
    throw new Error('Missing authorization token.');
  }

  const res = await fetch(`${GAIA_API_BASE_URI}/set-name`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 서버가 Bearer 토큰을 요구
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  // 서버 응답 처리
  if (!res.ok) {
    // 서버는 { error: string } 형태로 에러를 반환
    let message = `Failed to save Gaia name: ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // JSON 파싱 실패 시 본문 텍스트를 시도
      try {
        const text = await res.text();
        if (text) message = text;
      } catch { /* ignore */ }
    }
    throw new Error(message);
  }

  // 정상 응답: { ok: true }
  const data = (await res.json()) as SaveGaiaNameResult;
  return data;
}
