import { createNameSearchForm } from './components/name-search-form';
import { createRainbowKit } from './components/wallet';
import './main.less';

document.body.appendChild(createRainbowKit());
document.querySelector('.name-search-form-container')?.append(createNameSearchForm());
