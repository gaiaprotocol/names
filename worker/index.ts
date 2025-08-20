import { handleLogin, handleNonce, handleValidateToken } from '@gaiaprotocol/worker-common';
import { intro } from "./pages/intro";
import { renderProfile } from './pages/profile';

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);

    const gaiaMatch = url.pathname.match(/^\/([^\/]+)\.gaia\/?$/i);
    if (gaiaMatch) {
      const username = decodeURIComponent(gaiaMatch[1]); // URL 인코딩 대비
      const nameData = await (env.API_WORKER as any).fetchGaiaName(username);
      const profile = nameData ? await (env.API_WORKER as any).fetchProfileByAddress(nameData.account) : undefined;
      return new Response(renderProfile(nameData, profile), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (url.pathname === '/api/nonce' && request.method === 'POST') return handleNonce(request, env);
    if (url.pathname === '/api/login' && request.method === 'POST') return handleLogin(request, 1, env);
    if (url.pathname === '/api/validate-token' && request.method === 'GET') return handleValidateToken(request, env);

    if (url.pathname === '/') {
      return new Response(intro(), { headers: { 'Content-Type': 'text/html' } });
    }

    return new Response('Not Found', { status: 404 });
  },
} satisfies ExportedHandler<Env>;
