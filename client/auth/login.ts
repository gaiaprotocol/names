async function requestLogin(address: `0x${string}`, signature: `0x${string}`): Promise<string> {
  const response = await fetch(
    '/api/login',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address,
        signature,
      }),
    },
  );
  if (!response.ok) throw new Error('Failed to login');
  const data = await response.json();
  if (!data.token) throw new Error('Invalid response from server');

  return data.token;
}

export { requestLogin };
