import { h } from "@webtaku/h";
import { head } from "./head";

function intro() {
  return '<!DOCTYPE html>' + h(
    'html.dark', { lang: 'en' },
    head('Gaia Names'),
    h('body',
      h('h1', 'Gaia Names'),
    )
  );
}

export { intro };
