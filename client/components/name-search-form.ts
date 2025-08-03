import { createNameSearchResultContent } from '@gaiaprotocol/client-common';
import '@shoelace-style/shoelace';
import { el } from "@webtaku/el";
import './name-search-form.less';

function createResultModal() {
  const modal = el('sl-dialog', {
    label: 'Search Results',
    class: 'name-search-result-modal',
  });

  const content = el('div.result-content');
  modal.append(content);

  return modal;
}

function createNameSearchForm(): HTMLElement {
  const container = el('div.name-search-form');

  const input = el('sl-input', {
    placeholder: 'Search for a name',
    clearable: true,
    size: 'large',
    pill: true,
  });

  const modal = createResultModal();
  document.body.appendChild(modal);

  const contentContainer = modal.querySelector('.result-content')!;

  input.addEventListener('sl-input', debounce(async () => {
    const name = input.value.trim().toLowerCase();

    if (name) {
      contentContainer.innerHTML = '';
      const resultContent = await createNameSearchResultContent(name);
      contentContainer.append(resultContent);
      modal.show();
    } else {
      modal.hide();
    }
  }, 300));

  container.append(input);
  return container;
}

function debounce(callback: () => void, delay: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(callback, delay);
  };
}

export { createNameSearchForm };
