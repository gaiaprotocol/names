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

      // Main Content
      h('main.py-12',
        h('div.container.mx-auto.px-4.space-y-16',

          // Title & Description
          h('section.text-center',
            h('h1.text-4xl.font-bold.text-white.mb-4', 'Your Exclusive Identity in Gaia Protocol'),
            h('p.text-lg.text-gray-400.max-w-2xl.mx-auto',
              'Gaia Names is a unique feature designed exclusively for God Mode holders, providing a personalized identity within the Gaia Protocol ecosystem.'
            )
          ),

          // What is Gaia Name?
          h('section',
            h('h2.text-2xl.font-semibold.text-white.mb-4', 'What is Gaia Name?'),
            h('p.text-gray-300.mb-4',
              'Gaia Name is a distinct and non-duplicable .gaia identifier available only to users who meet the following criteria:'
            ),
            h('ul.list-disc.list-inside.space-y-2.text-gray-300',
              h('li',
                'Hold at least one ',
                h('a.text-sky-400.hover:underline', { href: 'https://thegods.gaia.cc/', target: '_blank' }, 'Gods NFT'),
                ' or'
              ),
              h('li',
                'Possess 10,000 or more ',
                h('a.text-sky-400.hover:underline', { href: 'https://token.gaia.cc/', target: '_blank' }, '$GAIA'),
                ' tokens'
              )
            ),
            h('p.text-gray-300.mt-4',
              'This exclusive naming system allows God Mode holders to establish a recognizable presence across all Gaia Protocol services.'
            )
          ),

          // Why Secure Your Gaia Name?
          h('section',
            h('h2.text-2xl.font-semibold.text-white.mb-4', 'Why Secure Your Gaia Name?'),
            h('ul.list-disc.list-inside.space-y-2.text-gray-300',
              h('li', 'Uniqueness – Each Gaia Name is exclusive and cannot be replicated.'),
              h('li', 'Integration – Seamlessly use your Gaia Name across all Gaia Protocol services.'),
              h('li', 'Prestige – Reflect your status as a God Mode holder within the ecosystem.')
            ),
            h('p.text-gray-300.mt-4',
              'Take ownership of your Gaia Name and solidify your identity within Gaia Protocol today.'
            )
          ),

          // Search Input Placeholder
          h('section#search-section.text-center',
            h('h2.text-xl.font-semibold.text-white.mb-4', 'Search for Your Gaia Name'),
            h('div.name-search-form-container.mx-auto.max-w-md'),
            h('p.text-sm.text-gray-500.mt-2', 'Enter a name to check availability')
          ),

          // Credit
          h('div.text-center.text-sm.text-gray-500',
            'Created by ',
            h('a.text-gray-400.hover:text-white', { href: 'https://gaiaprotocol.com', target: '_blank' }, 'Gaia Protocol')
          )
        )
      ),

      // Footer
      h('footer.bg-gray-950.border-t.border-gray-800.mt-16',
        h('div.container.mx-auto.px-4.py-6.text-center.text-gray-500.text-sm',
          `© ${new Date().getFullYear()} Gaia Protocol. All rights reserved.`
        )
      )
    )
  );
}

export { intro };
