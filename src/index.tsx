import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import '@/src/styles/common.less'
import '@/styles/globals.less'

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

console.log(process.env.APP_ID)
