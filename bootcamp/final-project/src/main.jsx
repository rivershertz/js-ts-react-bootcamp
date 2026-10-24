import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntApp, ConfigProvider } from 'antd';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={{ token: { colorPrimary: '#3b5bdb', borderRadius: 6 } }}>
        <AntApp>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  </StrictMode>,
);
