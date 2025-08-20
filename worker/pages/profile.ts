import { h } from '@webtaku/h';
import { Profile } from '../types/profile';
import { bundle } from './bundle';
import { footer } from './footer';
import { head } from './head';
import { top } from './top';

function renderProfile(
  nameData: { account: string; name: string },
  profile: Profile | undefined,
  opts?: { isOwner?: boolean }
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

  const isOwner = !!opts?.isOwner;

  return '<!DOCTYPE html>' + h(
    'html.dark', { lang: 'en' },
    head(`${gaiaName} – Gaia Profile`),
    h(
      'body.bg-gray-950.text-gray-300.sl-theme-dark.min-h-screen.flex.flex-col',
      top,

      h('main.container.mx-auto.px-4.py-10.flex-1',
        h('div.mx-auto.max-w-2xl.space-y-8',

          // 프로필 카드
          h('div.bg-gray-900/70.border.border-white/10.rounded-2xl.p-8',
            h('div.flex.flex-col.items-center.text-center.space-y-4',
              avatarEl,
              h('h1.text-3xl.font-bold.text-yellow-300.tracking-wide', `${display}.gaia`),
              h('p.text-sm.text-gray-400.max-w-prose', bio),
              h('div.flex.items-center.gap-2.text-xs.text-gray-500',
                h('span', `Account: ${short(nameData.account)}`),
                h('sl-button#btn-copy-account', { variant: 'text', size: 'small' },
                  h('sl-icon', { name: 'clipboard' }), ' Copy'
                )
              )
            )
          ),

          // 액션 영역 (JS에서 바인딩)
          h('div.flex.flex-wrap.justify-center.gap-3',
            h('sl-button#btn-share', { variant: 'primary' },
              h('sl-icon', { slot: 'prefix', name: 'share' }), 'Share'
            ),
            isOwner ? h('sl-button#btn-rename', { variant: 'default' },
              h('sl-icon', { slot: 'prefix', name: 'pencil' }), '이름 변경'
            ) : undefined,
            isOwner ? h('sl-button#btn-edit-profile', { variant: 'default' },
              h('sl-icon', { slot: 'prefix', name: 'person' }), '프로필 수정'
            ) : undefined,
            isOwner ? h('sl-button#btn-delete', { variant: 'danger' },
              h('sl-icon', { slot: 'prefix', name: 'trash' }), '삭제하기'
            ) : undefined,
          ),

          // 알림/토스트 컨테이너(선택)
          h('sl-alert#profile-error', { variant: 'danger', class: 'hidden' },
            h('sl-icon', { slot: 'icon', name: 'exclamation-octagon' }),
            h('strong', 'Error'),
            h('br'),
            h('span', { id: 'profile-error-message' }, 'Unknown error')
          )
        ),

        // 클라이언트 바인딩을 위한 메타 데이터
        h('div#profile-meta', {
          'data-account': nameData.account,
          'data-gaia-name': gaiaName,
          'data-is-owner': String(isOwner),
        })
      ),

      footer,
      bundle, // 번들에 profile-page.ts가 포함되어야 함
    )
  );
}

export { renderProfile };
