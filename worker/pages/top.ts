import { h } from "@webtaku/h";
import logo from "./logo.png";

function arrayBufferToBase64(buffer: ArrayBuffer, mime = "image/png"): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000; // 성능 위해 청크 단위 처리

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk as any);
  }

  const base64 = btoa(binary);
  return `data:${mime};base64,${base64}`;
}

const top = h('nav.sticky.top-0.z-50.bg-gray-950.shadow-md.border-b.border-gray-800',
  h('div.container.mx-auto.px-4.py-3.flex.justify-between.items-center',
    h(
      'a.flex.items-center.space-x-3.text-white',
      { href: '/' },
      // 로고 뱃지 (원형 그라데이션 안에 G)
      h('div.w-8.h-8.rounded-full.flex.items-center.justify-center',
        h('img', { src: arrayBufferToBase64(logo) })
      ),
      h('span.text-lg.md:text-xl.font-trojan-pro', 'Gaia Names')
    ),
    h('#connect-button-container')
  )
);

export { top };
