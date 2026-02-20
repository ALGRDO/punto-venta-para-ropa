import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() {
    return (
        <div className="app-container">
            <Sidebar />
            <main className="main-content" style={{ animation: 'fadeIn 0.5s ease' }}>
                <Outlet />
            </main>
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
