// pages/register-name.ts
import { h } from '@webtaku/h';
import { head } from './head';
import { top } from './top';
import { footer } from './footer';
import { bundle } from './bundle';

export function renderRegisterName(username: string) {
  const name = username.replace('.gaia', '').toLowerCase();

  return '<!DOCTYPE html>' + h(
    'html.dark', { lang: 'en' },
    head(`${name}.gaia – Register`),
    h(
      'body.bg-gray-950.text-gray-300.sl-theme-dark.min-h-screen.flex.flex-col',
      top,

      // 메인 컨테이너
      h('main.container.mx-auto.px-4.py-10.flex-1',
        // ✅ 가운데 정렬 스택 래퍼
        h('div.center-stack.mx-auto.w-full.max-w-xl.space-y-6',

          // 알림 영역 (가운데)
          h('sl-alert#error-alert', { variant: 'danger', class: 'w-full' },
            h('sl-icon', { slot: 'icon', name: 'exclamation-octagon' }),
            h('strong', 'Error'),
            h('br'),
            h('span', { id: 'error-alert-message' }, 'Unknown error')
          ),

          // 카드도 w-full로 래퍼 너비에 맞춤
          h('sl-card.register-name-view', { 'data-username': name, class: 'w-full' },
            h('div', { slot: 'header' },
              h('div.flex.items-center.justify-between',
                h('div.flex.items-center.gap-2',
                  h('sl-icon', { name: 'shield-lock' }),
                  h('b.text-lg', 'Register Gaia Name')
                ),
                h('a.back.text-sm.underline', { href: '/' }, 'Back')
              )
            ),

            // 로딩 상태 (skeleton)
            h('div.loading-state.space-y-4',
              h('sl-skeleton', { effect: 'pulse', style: 'width: 60%; height: 18px;' }),
              h('sl-skeleton', { effect: 'pulse', style: 'width: 100%; height: 44px;' }),
              h('div.flex.gap-2',
                h('sl-skeleton', { effect: 'pulse', style: 'width: 120px; height: 36px;' }),
                h('sl-skeleton', { effect: 'pulse', style: 'width: 140px; height: 36px;' }),
              ),
            ),

            // A) 비자격
            h('div.not-eligible.hidden.space-y-4',
              h('div.flex.items-center.gap-2.text-yellow-300',
                h('sl-icon', { name: 'lock' }),
                h('b', 'God Mode Required')
              ),
              h('p.text-sm.text-gray-300',
                'To register a GAIA Name, activate God Mode by meeting one of the following:'
              ),
              h('ul.list-disc.list-inside.text-sm.text-gray-300.space-y-1',
                h('li', 'Hold 10,000 or more $GAIA'),
                h('li', 'Hold at least one The Gods NFT'),
              ),
              h('div.flex.gap-2',
                h('sl-button#btn-buy-gaia', { variant: 'primary' }, 'Buy $GAIA'),
                h('sl-button#btn-buy-nft', { variant: 'default' },
                  h('sl-icon', { slot: 'prefix', name: 'box-arrow-up-right' }),
                  'Buy The Gods NFT'
                ),
              )
            ),

            // B) 등록 폼
            h('div.register-form.hidden.space-y-5',
              h('p.text-sm.text-gray-300',
                'Would you like to register ',
                h('b', `${name}.gaia`),
                ' as your wallet name? The name remains valid only while you maintain ',
                h('b', 'God Mode'),
                ' (holding either 10,000 $GAIA or at least one The Gods NFT).'
              ),

              h('sl-input#name-input', {
                label: 'Gaia Name',
                value: `${name}.gaia`,
                readonly: true,
              }),

              h('div.flex.items-center.justify-between',
                h('div.text-xs.text-gray-500', 'You can change it later by registering a new name.'),
                h('div.flex.gap-2',
                  h('sl-button#btn-cancel', { variant: 'default' }, 'Cancel'),
                  h('sl-button#btn-register', { variant: 'primary' }, 'Register Name'),
                )
              ),

              h('div#progress-area.hidden.space-y-2',
                h('sl-progress-bar#progress', { value: '0' }),
                h('div#progress-label.text-xs.text-gray-400', 'Preparing…')
              ),
            ),
          ),
        ),
      ),

      footer,
      // 전용 스크립트(아래 2번 파일)가 번들에 포함되어 있어야 함
      bundle,
    )
  );
}
