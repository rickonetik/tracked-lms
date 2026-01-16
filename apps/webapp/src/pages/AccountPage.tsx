import './Page.css';
import { useAuth } from '../hooks/useAuth';
import { useTelegram } from '../hooks/useTelegram';

function AccountPage() {
  const { user, isLoading, error, isAuthenticated } = useAuth();
  const { isInTelegram, version, platform } = useTelegram();

  if (isLoading) {
    return (
      <div className="page">
        <h2>Аккаунт</h2>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h2>Аккаунт</h2>
        <div style={{ padding: '12px', marginBottom: '16px', backgroundColor: '#f8d7da', borderRadius: '8px', border: '1px solid #dc3545' }}>
          <strong>❌ Ошибка</strong>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="page">
        <h2>Аккаунт</h2>
        <div style={{ padding: '12px', marginBottom: '16px', backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffc107' }}>
          <strong>⚠️ Не авторизован</strong>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
            Откройте эту страницу в Telegram для авторизации
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Аккаунт</h2>

      {!isInTelegram && (
        <div style={{ padding: '12px', marginBottom: '16px', backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffc107' }}>
          <strong>⚠️ Браузерный режим</strong>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
            Откройте эту страницу в Telegram для просмотра реального профиля
          </p>
        </div>
      )}

      <div style={{ marginTop: '24px' }}>
        <div style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Профиль</h3>

          <div style={{ marginBottom: '12px' }}>
            <strong>ID:</strong> {user.id}
          </div>

          {user.telegramId && (
            <div style={{ marginBottom: '12px' }}>
              <strong>Telegram ID:</strong> {user.telegramId}
            </div>
          )}

          <div style={{ marginBottom: '12px' }}>
            <strong>Имя:</strong> {user.firstName}
            {user.lastName && ` ${user.lastName}`}
          </div>

          {user.username && (
            <div style={{ marginBottom: '12px' }}>
              <strong>Username:</strong> @{user.username}
            </div>
          )}

          <div style={{ marginBottom: '12px' }}>
            <strong>Статус:</strong> {user.status === 'active' ? '✅ Активен' : '❌ Забанен'}
          </div>

          <div style={{ marginBottom: '12px' }}>
            <strong>Тип пользователя:</strong> {user.userType}
          </div>

          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #dee2e6', fontSize: '12px', color: '#6c757d' }}>
            <div><strong>Платформа:</strong> {platform}</div>
            <div><strong>Версия:</strong> {version}</div>
            <div><strong>Режим:</strong> {isInTelegram ? 'Telegram' : 'Браузер'}</div>
            <div><strong>Данные:</strong> С сервера ✅</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
