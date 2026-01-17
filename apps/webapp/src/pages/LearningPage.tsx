import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLearningStore } from '../features/learning/learning.store';
import './Page.css';
import './LearningPage.css';

function LearningPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { courses, isLoading, error, loadMyCourses } = useLearningStore();
  const isFetchingRef = useRef(false); // Защита от дублирования запросов (StrictMode)

  useEffect(() => {
    // Ждем завершения проверки авторизации
    if (authLoading) {
      return;
    }

    // Если не авторизован, не пытаемся загружать курсы
    if (!isAuthenticated) {
      return;
    }

    // Защита от дублирования запросов (особенно в StrictMode)
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    loadMyCourses().finally(() => {
      isFetchingRef.current = false;
    });
  }, [isAuthenticated, authLoading, loadMyCourses]);

  // Показываем загрузку пока проверяем авторизацию
  if (authLoading) {
    return (
      <div className="page">
        <h2>Обучение</h2>
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  // Если не авторизован, показываем сообщение
  if (!isAuthenticated) {
    return (
      <div className="page">
        <h2>Обучение</h2>
        <div className="empty-state">
          <div className="empty-state-icon">🔐</div>
          <h3>Требуется авторизация</h3>
          <p>Для просмотра курсов необходимо авторизоваться через Telegram Mini App.</p>
        </div>
      </div>
    );
  }

  // Показываем загрузку курсов
  if (isLoading) {
    return (
      <div className="page">
        <h2>Обучение</h2>
        <div className="loading">Загрузка курсов...</div>
      </div>
    );
  }

  // Показываем ошибку 401 (требуется авторизация)
  if (error?.kind === 'UNAUTHORIZED') {
    return (
      <div className="page">
        <h2>Обучение</h2>
        <div className="empty-state">
          <div className="empty-state-icon">🔐</div>
          <h3>Требуется авторизация</h3>
          <p>Для просмотра курсов необходимо авторизоваться через Telegram Mini App.</p>
          <button
            className="retry-button"
            onClick={() => {
              // Перезагружаем страницу - в Telegram Mini App это откроет авторизацию
              window.location.reload();
            }}
          >
            Обновить
          </button>
        </div>
      </div>
    );
  }

  // Показываем другие ошибки (500, сетевые и т.д.)
  if (error) {
    return (
      <div className="page">
        <h2>Обучение</h2>
        <div className="error">
          <div className="error-icon">⚠️</div>
          <h3>Ошибка загрузки</h3>
          <p>{error.message || 'Не удалось загрузить курсы'}</p>
          <button className="retry-button" onClick={loadMyCourses}>
            Повторить
          </button>
        </div>
      </div>
    );
  }

  // Показываем empty state если курсов нет
  if (courses.length === 0) {
    return (
      <div className="page">
        <h2>Обучение</h2>
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <h3>У вас пока нет курсов</h3>
          <p>Курсы, на которые вы записаны, появятся здесь.</p>
        </div>
      </div>
    );
  }

  // Показываем список курсов
  return (
    <div className="page">
      <h2>Обучение</h2>
      <div className="courses-list">
        {courses.map((course) => (
          <div
            key={course.id}
            className="course-card"
            onClick={() => navigate(`/learning/courses/${course.id}`)}
          >
            <h3>{course.title}</h3>
            {course.description && <p>{course.description}</p>}
            <div className="course-progress">
              <div className="progress-meta">
                <span className="progress-percent">{course.progressPercent}%</span>
                <span className="progress-count">
                  {course.completedLessons}/{course.totalLessons}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${course.progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LearningPage;
