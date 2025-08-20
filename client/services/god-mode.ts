export async function checkGodMode(address: `0x${string}`): Promise<boolean> {
  const res = await fetch(`/api/god-mode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address }),
  });
  if (!res.ok) throw new Error('Failed to check god mode');

  const data = await res.json();
  return data.godMode;
}
