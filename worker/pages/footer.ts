import { h } from "@webtaku/h";

const footer = h('footer.bg-gray-950.border-t.border-gray-800.mt-16',
  h('div.container.mx-auto.px-4.py-6.text-center.text-gray-500.text-sm.space-y-2',
    h('p', `© ${new Date().getFullYear()} Gaia Protocol. All rights reserved.`),
    h('a.text-gray-400.hover:text-white.underline', {
      href: 'https://x.com/TheGods_NFT',
      target: '_blank'
    }, 'Follow on X')
  )
);

export { footer };
