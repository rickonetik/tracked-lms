import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const location = useLocation();

  // Определяем активный путь (с учетом корня)
  const getActiveClass = (path: string) => {
    const currentPath = location.pathname;
    if (path === '/learning') {
      return currentPath === '/learning' || currentPath === '/' ? 'active' : '';
    }
    return currentPath === path ? 'active' : '';
  };

  return (
    <div className="layout">
      <header className="header">
        <h1>Tracked LMS</h1>
      </header>
      <main className="main">{children}</main>
      <nav className="bottom-nav">
        <Link to="/learning" className={getActiveClass('/learning')}>
          <span style={{ fontSize: '1.25rem' }}>📚</span>
          <span>Обучение</span>
        </Link>
        <Link to="/expert" className={getActiveClass('/expert')}>
          <span style={{ fontSize: '1.25rem' }}>🎓</span>
          <span>Эксперт</span>
        </Link>
        <Link to="/account" className={getActiveClass('/account')}>
          <span style={{ fontSize: '1.25rem' }}>👤</span>
          <span>Аккаунт</span>
        </Link>
      </nav>
    </div>
  );
}

export default Layout;
