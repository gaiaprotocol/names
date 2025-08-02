import { defineCustomElements } from '@ionic/core/loader';
import { createRainbowKit } from './components/wallet';
import './main.less';

defineCustomElements(window);
document.body.appendChild(createRainbowKit());
