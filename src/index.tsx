import React from 'react';
import ReactDOM from 'react-dom/client';

import { GraphQLClient, ClientContext } from 'graphql-hooks'

import App from './App';

import '@/src/styles/common.less'
import '@/styles/globals.less'

const client = new GraphQLClient({
  url: 'https://gql.hashnode.com'
})

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <ClientContext.Provider value={client}>
        <App />
      </ClientContext.Provider>
    </React.StrictMode>,
  );
}

console.log(process.env.APP_ID)
