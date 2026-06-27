import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export function PageLayout() {
  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar />
      <Sidebar />
      <main className="md:ml-64 mt-16 p-6 md:p-8 min-h-[calc(100vh-64px)]">
        <Outlet />
      </main>
    </div>
  );
}
