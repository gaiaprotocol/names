import { createNameSearchForm } from './components/name-search-form';
import { createRainbowKit } from './components/wallet';
import './main.css';

document.body.appendChild(createRainbowKit());
document.querySelector('.name-search-form-container')?.append(createNameSearchForm());
