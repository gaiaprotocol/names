import { h } from '@webtaku/h';
import { Profile } from '../types/profile';
import { bundle } from './bundle';
import { footer } from './footer';
import { head } from './head';
import { top } from './top';

function renderProfile(
  nameData: { account: string; name: string },
  profile: Profile | undefined
) {
  return '<!DOCTYPE html>' + h(
    'html.dark', { lang: 'en' },
    head('Gaia Names'),
    h(
      'body.bg-gray-950.text-gray-300.sl-theme-dark',
      top,

      JSON.stringify(nameData),
      JSON.stringify(profile),

      footer,
      bundle,
    )
  );
}

export { renderProfile };
