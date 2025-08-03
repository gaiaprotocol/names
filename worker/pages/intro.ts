import { h } from '@webtaku/h';
import { head } from './head';

function intro() {
  return '<!DOCTYPE html>' + h(
    'html.dark', { lang: 'en' },
    head('Gaia Names'),
    h(
      'body.bg-gray-950.text-gray-300.sl-theme-dark',

      // Header
      h('nav.bg-gray-950.shadow-md.border-b.border-gray-800',
        h('div.container.mx-auto.px-4.py-3.flex.justify-between.items-center',
          h('a.text-xl.font-semibold.text-white', { href: '/' }, 'Gaia Protocol'),
          h('a.text-gray-300.hover:text-white.text-sm', { href: 'https://gaiaprotocol.com', target: '_blank' }, 'Visit Website')
        )
      ),

      // Hero Section with Search
      h('section.relative.flex.flex-col.items-center.justify-center.text-center.h-[60vh].space-y-6',
        h('h1.text-5xl.font-serif.font-bold.text-yellow-400.tracking-wider', 'GAIA NAMES'),
        h('div.name-search-form-container.w-full.max-w-md.px-4'),
        h('p.text-sm.text-gray-500',
          'Created by ',
          h('a.text-gray-400.hover:text-white.underline', { href: 'https://gaiaprotocol.com', target: '_blank' }, 'Gaia Protocol')
        )
      ),

      // Main Sections
      h('main.relative.py-16',
        h('div.container.mx-auto.px-4.space-y-20',

          // Section 1: Intro
          h('section.text-center',
            h('h2.text-4xl.font-bold.text-white.mb-4', 'Claim Your Identity in the Realm of Gods'),
            h('p.text-lg.text-gray-400.max-w-2xl.mx-auto',
              'Within the Gaia Protocol, identity is not just a name — it’s a mark of power. Gaia Names offer God Mode holders the privilege of owning a unique, eternal .gaia title across the ecosystem.'
            )
          ),

          // Section 2: What is Gaia Name?
          h('section.space-y-6',
            h('h2.text-2xl.font-semibold.text-white.text-center', 'What is a Gaia Name?'),
            h('p.text-center.text-gray-300.max-w-xl.mx-auto',
              'A Gaia Name is your singular mark — a permanent, non-replicable identity bound to the elite tier of God Mode holders.'
            ),
            h('div.grid.md:grid-cols-2.gap-6.mt-8',
              h('div.bg-gray-900.p-6.rounded-lg.shadow-lg',
                h('h3.text-xl.font-bold.text-yellow-300.mb-2', 'Eligibility'),
                h('ul.list-disc.list-inside.space-y-1.text-gray-300.text-sm',
                  h('li', 'Own at least one ', h('a.text-sky-400.hover:underline', { href: 'https://thegods.gaia.cc/', target: '_blank' }, 'Gods NFT')),
                  h('li', 'Or hold over 10,000 ', h('a.text-sky-400.hover:underline', { href: 'https://token.gaia.cc/', target: '_blank' }, '$GAIA'), ' tokens')
                )
              ),
              h('div.bg-gray-900.p-6.rounded-lg.shadow-lg',
                h('h3.text-xl.font-bold.text-yellow-300.mb-2', 'Purpose'),
                h('p.text-gray-300.text-sm',
                  'A Gaia Name is not just an address. It’s your avatar, your legacy, your presence — recognized across every Gaia service.'
                )
              )
            )
          ),

          // Section 3: Why Secure Your Gaia Name?
          h('section.space-y-6',
            h('h2.text-2xl.font-semibold.text-white.text-center', 'Why Your Gaia Name Matters'),
            h('div.grid.md:grid-cols-3.gap-6.mt-8',
              h('div.bg-gray-900.p-6.rounded-lg.shadow-lg.text-center',
                h('h3.text-lg.font-bold.text-yellow-300.mb-2', 'Uniqueness'),
                h('p.text-sm.text-gray-300', 'No duplicates. No imitations. Your Gaia Name is yours alone — forever.')
              ),
              h('div.bg-gray-900.p-6.rounded-lg.shadow-lg.text-center',
                h('h3.text-lg.font-bold.text-yellow-300.mb-2', 'Integration'),
                h('p.text-sm.text-gray-300', 'Seamlessly use your Gaia Name across all of Gaia’s apps, tools, and portals.')
              ),
              h('div.bg-gray-900.p-6.rounded-lg.shadow-lg.text-center',
                h('h3.text-lg.font-bold.text-yellow-300.mb-2', 'Prestige'),
                h('p.text-sm.text-gray-300', 'Wield a name that symbolizes status, rarity, and godlike recognition.')
              )
            )
          )
        )
      ),

      // Footer
      h('footer.bg-gray-950.border-t.border-gray-800.mt-16',
        h('div.container.mx-auto.px-4.py-6.text-center.text-gray-500.text-sm',
          `© ${new Date().getFullYear()} Gaia Protocol. All rights reserved.`
        )
      ),

      h('script', { src: '/bundle.js' }),
    )
  );
}

export { intro };
