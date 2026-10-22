import { Layout, Typography } from 'antd';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import TicketFormPage from './pages/TicketFormPage';
import TicketListPage from './pages/TicketListPage';

// The routes only. The providers (React Query, antd theme, router) are set up in main.
export default function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Header style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/tickets">
          <Typography.Title level={3} style={{ color: 'white', margin: 0 }}>
            {import.meta.env.VITE_APP_TITLE}
          </Typography.Title>
        </Link>
      </Layout.Header>
      <Layout.Content style={{ padding: 24 }}>
        <Routes>
          <Route path="/tickets" element={<TicketListPage />} />
          <Route path="/tickets/new" element={<TicketFormPage />} />
          <Route path="/tickets/:id" element={<TicketFormPage />} />
          <Route path="*" element={<Navigate to="/tickets" replace />} />
        </Routes>
      </Layout.Content>
    </Layout>
  );
}
