import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './layout/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { SongsPage } from './pages/SongsPage';
import { BiblePage } from './pages/BiblePage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { ScenesPage } from './pages/ScenesPage';
import { AIAssistantPage } from './pages/AIAssistantPage';

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/songs" element={<SongsPage />} />
        <Route path="/bible" element={<BiblePage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/scenes" element={<ScenesPage />} />
        <Route path="/ai" element={<AIAssistantPage />} />
      </Routes>
    </MainLayout>
  );
}
