import React from 'react';
import ReactDom from 'react-dom/client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './index.css'
import App from './components/App/App.tsx'
import 'modern-normalize/modern-normalize.css';

const queryClient = new QueryClient();

ReactDom.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
  </React.StrictMode>,
);
