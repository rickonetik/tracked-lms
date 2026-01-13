import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="layout">
      <header className="header">
        <h1>Tracked LMS</h1>
      </header>
      <main className="main">{children}</main>
      <nav className="bottom-nav">
        <Link
          to="/learning"
          className={location.pathname === '/learning' ? 'active' : ''}
        >
          📚 Обучение
        </Link>
        <Link
          to="/expert"
          className={location.pathname === '/expert' ? 'active' : ''}
        >
          🎓 Эксперт
        </Link>
        <Link
          to="/account"
          className={location.pathname === '/account' ? 'active' : ''}
        >
          👤 Аккаунт
        </Link>
      </nav>
    </div>
  );
}

export default Layout;
