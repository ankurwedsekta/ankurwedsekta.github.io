import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import '@fontsource-variable/cormorant-garamond/wght.css';
import '@fontsource-variable/cormorant-garamond/wght-italic.css';
import '@fontsource/pinyon-script/400.css';
import '@fontsource-variable/jost';
import '@fontsource/rozha-one/devanagari-400.css';
import '@fontsource/rozha-one/latin-400.css';
import '@fontsource/martel/devanagari-400.css';
import '@fontsource/martel/devanagari-600.css';
import '@fontsource/amita/devanagari-400.css';
import '@fontsource/amita/devanagari-700.css';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
