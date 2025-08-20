import { h } from "@webtaku/h";

const top = h('nav.bg-gray-950.shadow-md.border-b.border-gray-800',
  h('div.container.mx-auto.px-4.py-3.flex.justify-between.items-center',
    h('a.text-xl.font-semibold.text-white', { href: '/' }, 'Gaia Names'),
    h('#connect-button-container')
  )
);

export { top };
