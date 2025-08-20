import { wagmiConfig } from '@gaiaprotocol/client-common';
import { signMessage as wagmiSignMessage } from '@wagmi/core';
import { createSiweMessage as viemCreateSiweMessage } from 'viem/siwe';
import { MESSAGE_FOR_WALLET_LOGIN } from '../vars';

function createSiweMessage(address: `0x${string}`, nonce: string, issuedAt: string) {

  console.log({
    domain: location.host,
    address,
    statement: MESSAGE_FOR_WALLET_LOGIN,
    uri: location.origin,
    version: '1',
    chainId: 1,
    nonce,
    issuedAt: new Date(issuedAt),
  });

  return viemCreateSiweMessage({
    domain: location.host,
    address,
    statement: MESSAGE_FOR_WALLET_LOGIN,
    uri: location.origin,
    version: '1',
    chainId: 1,
    nonce,
    issuedAt: new Date(issuedAt),
  });
}

async function signMessage(address: `0x${string}`): Promise<`0x${string}`> {
  const response = await fetch(
    '/api/nonce',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address,
        domain: location.host,
        uri: location.origin,
      }),
    },
  );
  if (!response.ok) throw new Error('Failed to generate nonce');
  const { nonce, issuedAt } = await response.json();
  if (!nonce || !issuedAt) throw new Error('Invalid response from server');

  const siweMessage = createSiweMessage(address, nonce, issuedAt);

  return await wagmiSignMessage(wagmiConfig, {
    message: siweMessage,
    account: address,
  });
}

export { signMessage };
