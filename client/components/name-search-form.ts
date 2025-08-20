import { createNameSearchResultContent } from '@gaiaprotocol/god-mode-client';
import { el } from '@webtaku/el';
import './name-search-form.css';

function createNameSearchForm(): HTMLElement {
  const container = el('div.name-search-form');

  const input = el('sl-input', {
    placeholder: 'Search for a name',
    clearable: true,
    size: 'large',
    pill: true,
  });

  const resultPanel = el('div.name-search-result-panel'); // 🔽 인풋 아래에 표시될 영역
  resultPanel.style.display = 'none';

  input.addEventListener(
    'sl-input',
    debounce(async () => {
      const name = input.value.trim().toLowerCase();

      if (name.length >= 2) {
        resultPanel.innerHTML = '';
        const resultContent = await createNameSearchResultContent(name);
        resultPanel.append(resultContent);
        resultPanel.style.display = 'block';
      } else {
        resultPanel.style.display = 'none';
      }
    }, 300)
  );

  container.append(input, resultPanel);
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
