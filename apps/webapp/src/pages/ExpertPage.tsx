import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { expertService, ExpertMeResponse } from '../services/expert.service';
import './ExpertPage.css';

type ExpertPageState =
  | { kind: 'loading' }
  | { kind: 'unauthorized' }
  | { kind: 'not_found' }
  | { kind: 'subscription_inactive' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; data: ExpertMeResponse };

function ExpertPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<ExpertPageState>({ kind: 'loading' });
  const isFetchingRef = useRef(false);
  const isMountedRef = useRef(true);

  const load = async () => {
    // Защита от StrictMode double-invoke
    if (isFetchingRef.current) {
      return;
    }
    isFetchingRef.current = true;

    if (!isMountedRef.current) return;
    setState({ kind: 'loading' });

    try {
      const data = await expertService.getMe();
      if (!isMountedRef.current) return;
      setState({ kind: 'ready', data });
    } catch (err: any) {
      if (!isMountedRef.current) return;

      const statusCode = err?.statusCode;
      const errorCode = err?.error;

      // Точное различение ошибок по statusCode И errorCode
      if (statusCode === 401) {
        setState({ kind: 'unauthorized' });
      } else if (statusCode === 404 && errorCode === 'EXPERT_NOT_FOUND') {
        // Только 404 + EXPERT_NOT_FOUND → "Станьте экспертом"
        setState({ kind: 'not_found' });
      } else if (statusCode === 403 && errorCode === 'SUBSCRIPTION_INACTIVE') {
        // Только 403 + SUBSCRIPTION_INACTIVE → "Подписка неактивна"
        setState({ kind: 'subscription_inactive' });
      } else {
        // Все остальные ошибки (включая другие 403/404) → generic error
        const errorMessage =
          err instanceof Error ? err.message : 'Не удалось загрузить данные';
        setState({ kind: 'error', message: errorMessage });
      }
    } finally {
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    load();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Loading state
  if (state.kind === 'loading') {
    return (
      <div className="page">
        <div className="expert-page">
          <h2>Эксперт</h2>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  // Unauthorized state
  if (state.kind === 'unauthorized') {
    return (
      <div className="page">
        <div className="expert-page">
          <h2>Эксперт</h2>
          <p>Требуется авторизация</p>
          <div className="expert-page-actions">
            <button onClick={load} className="button button-primary">
              Обновить
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (state.kind === 'not_found') {
    return (
      <div className="page">
        <div className="expert-page">
          <h2>Станьте экспертом</h2>
          <p>У вас пока нет доступа к экспертскому кабинету.</p>
          <p className="expert-page-muted">
            Пройдите обучение, чтобы стать экспертом и получить доступ к
            дополнительным возможностям.
          </p>
          <div className="expert-page-actions">
            <button
              onClick={() => navigate('/learning')}
              className="button button-primary"
            >
              В обучение
            </button>
            <button onClick={load} className="button button-secondary">
              Обновить
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Subscription inactive state
  if (state.kind === 'subscription_inactive') {
    return (
      <div className="page">
        <div className="expert-page">
          <h2>Эксперт</h2>
          <p>Подписка неактивна</p>
          <p className="expert-page-muted">
            Ваша подписка на экспертский кабинет неактивна. Обратитесь к
            администратору для продления доступа.
          </p>
          <div className="expert-page-actions">
            <button
              onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate('/learning');
                }
              }}
              className="button button-secondary"
            >
              Назад
            </button>
            <button onClick={load} className="button button-primary">
              Обновить
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (state.kind === 'error') {
    return (
      <div className="page">
        <div className="expert-page">
          <h2>Эксперт</h2>
          <p>Ошибка загрузки</p>
          <p className="expert-page-muted">{state.message}</p>
          <div className="expert-page-actions">
            <button onClick={load} className="button button-primary">
              Повторить
            </button>
            <button
              onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate('/learning');
                }
              }}
              className="button button-secondary"
            >
              Назад
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Ready state
  const { expertAccount, membership, subscription, permissions } = state.data;

  // Безопасная обработка nullable полей
  const subscriptionStatus = subscription
    ? `${subscription.status} (${subscription.plan})`
    : '—';
  const platformPermissions =
    permissions?.platform && Array.isArray(permissions.platform)
      ? permissions.platform.length > 0
        ? permissions.platform.join(', ')
        : '—'
      : '—';
  const expertPermissions =
    permissions?.expert && Array.isArray(permissions.expert)
      ? permissions.expert.length > 0
        ? permissions.expert.join(', ')
        : '—'
      : '—';

  return (
    <div className="page">
      <div className="expert-page">
        <h2>Экспертский кабинет</h2>

        <div className="expert-page-card">
          <div className="expert-page-info">
            <div className="expert-page-info-row">
              <span className="expert-page-label">Аккаунт:</span>
              <span className="expert-page-value">
                {expertAccount?.slug || '—'}
              </span>
            </div>
            <div className="expert-page-info-row">
              <span className="expert-page-label">Роль:</span>
              <span className="expert-page-value">
                {membership?.role || '—'}
              </span>
            </div>
            <div className="expert-page-info-row">
              <span className="expert-page-label">Подписка:</span>
              <span className="expert-page-value">{subscriptionStatus}</span>
            </div>
          </div>

          <div className="expert-page-permissions">
            <h3>Права доступа</h3>
            <div className="expert-page-permissions-section">
              <div className="expert-page-permissions-label">Platform:</div>
              <div className="expert-page-permissions-list">
                {platformPermissions}
              </div>
            </div>
            <div className="expert-page-permissions-section">
              <div className="expert-page-permissions-label">Expert:</div>
              <div className="expert-page-permissions-list">
                {expertPermissions}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpertPage;
