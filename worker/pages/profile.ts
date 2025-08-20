import { h } from '@webtaku/h';
import { Profile } from '../types/profile';
import { bundle } from './bundle';
import { footer } from './footer';
import { head } from './head';
import { top } from './top';

export function renderProfile(
  nameData: { account: string; name: string },
  profile: Profile | undefined
) {
  const gaiaName = nameData.name;
  const handle = gaiaName.replace('.gaia', '');
  const display = profile?.nickname || handle;
  const bio = profile?.bio?.trim() || 'No bio provided yet.';
  const avatar = profile?.profileImage || '';
  const initials = display.slice(0, 1).toUpperCase();
  const short = (addr: string) => addr.replace(/^(.{6}).+(.{4})$/, '$1…$2');

  const avatarEl = avatar
    ? h('img.block.w-28.h-28.rounded-full.object-cover.border-2.border-yellow-400', {
      src: avatar, alt: `${display} avatar`, width: 112, height: 112,
    })
    : h('div.grid.place-items-center.w-28.h-28.rounded-full.border-2.border-yellow-400.bg-gray-800.text-gray-300.font-semibold', initials);

  return '<!DOCTYPE html>' + h(
    'html.dark', { lang: 'en' },
    head(`${gaiaName} – Gaia Profile`),
    h(
      'body.bg-gray-950.text-gray-300.sl-theme-dark.min-h-screen.flex.flex-col',
      top,

      h('main.container.mx-auto.px-4.py-10.flex-1',
        h('div.mx-auto.max-w-2xl.space-y-8',

          // Profile card
          h('div.bg-gray-900/70.border.border-white/10.rounded-2xl.p-8',
            h('div.flex.flex-col.items-center.text-center.space-y-4',
              avatarEl,
              h('h1.text-3xl.font-bold.text-yellow-300.tracking-wide', `${display}.gaia`),
              h('p.text-sm.text-gray-400.max-w-prose', bio),
              h('div.flex.items-center.gap-2.text-xs.text-gray-500',
                h('span', `Address: ${short(nameData.account)}`),
                h('sl-button#btn-copy-account', { variant: 'text', size: 'small' },
                  h('sl-icon', { name: 'clipboard' }), ' Copy'
                )
              )
            )
          ),

          // Actions: only "Share" is visible server-side; owner-only buttons are hidden by default
          h('div.flex.flex-wrap.justify-center.gap-3',
            h('sl-button#btn-share', { variant: 'primary' },
              h('sl-icon', { slot: 'prefix', name: 'share' }), 'Share'
            ),
            h('sl-button#btn-rename.owner-only.hidden', { 'data-owner-only': '1', variant: 'default' },
              h('sl-icon', { slot: 'prefix', name: 'pencil' }), 'Rename'
            ),
            /*h('sl-button#btn-edit-profile.owner-only.hidden', { 'data-owner-only': '1', variant: 'default' },
              h('sl-icon', { slot: 'prefix', name: 'person' }), 'Edit Profile'
            ),*/
          ),

          // Error alert (hidden by default)
          h('sl-alert#profile-error', { variant: 'danger', class: 'hidden' },
            h('sl-icon', { slot: 'icon', name: 'exclamation-octagon' }),
            h('strong', 'Error'),
            h('br'),
            h('span', { id: 'profile-error-message' }, 'Unknown error')
          )
        ),

        // Client-side bindings metadata
        h('div#profile-meta', {
          'data-account': nameData.account,
          'data-gaia-name': gaiaName,
        })
      ),

      footer,
      bundle
    )
  );
}
