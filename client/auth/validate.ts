import { tokenManager } from "@gaiaprotocol/client-common";

export async function validateToken(): Promise<boolean> {
  const token = tokenManager.getToken();
  if (!token) return false;

  const res = await fetch('/api/validate-token', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    tokenManager.clear();
    return false;
  }

  return true;
}
