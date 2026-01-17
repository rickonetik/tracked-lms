import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { coursesService, StudentCourseDto } from '../services/courses.service';
import './Page.css';
import './CoursePage.css';

type ErrorKind = 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'GENERIC';

interface ErrorState {
  kind: ErrorKind;
  message: string;
}

function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [course, setCourse] = useState<StudentCourseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);
  const isFetchingRef = useRef(false); // Защита от дублирования запросов (StrictMode)

  const loadCourse = async () => {
    if (!courseId) {
      setError({ kind: 'NOT_FOUND', message: 'Course ID not provided' });
      setIsLoading(false);
      return;
    }

    if (!isAuthenticated || authLoading) {
      return;
    }

    // Защита от дублирования запросов (особенно в StrictMode)
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const data = await coursesService.getCourse(courseId);
      setCourse(data);
    } catch (err: any) {
      const statusCode = err?.statusCode;
      const errorCode = err?.error; // apiClient теперь сохраняет error code

      if (statusCode === 401) {
        setError({ kind: 'UNAUTHORIZED', message: 'Требуется авторизация' });
      } else if (statusCode === 403 && errorCode === 'ENROLLMENT_REQUIRED') {
        setError({ kind: 'FORBIDDEN', message: 'Нет доступа к курсу' });
      } else if (statusCode === 404 && errorCode === 'COURSE_NOT_FOUND') {
        setError({ kind: 'NOT_FOUND', message: 'Курс не найден' });
      } else {
        const errorMessage =
          err instanceof Error ? err.message : 'Не удалось загрузить курс';
        setError({ kind: 'GENERIC', message: errorMessage });
      }
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    // Сбрасываем флаг при изменении courseId или auth состояния
    isFetchingRef.current = false;
    loadCourse();
  }, [courseId, isAuthenticated, authLoading]);

  // Показываем загрузку пока проверяем авторизацию
  if (authLoading) {
    return (
      <div className="page">
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  // Если не авторизован, показываем сообщение
  if (!isAuthenticated) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-state-icon">🔐</div>
          <h3>Требуется авторизация</h3>
          <p>Для просмотра курса необходимо авторизоваться через Telegram Mini App.</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            Обновить
          </button>
        </div>
      </div>
    );
  }

  // Показываем загрузку курса
  if (isLoading) {
    return (
      <div className="page">
        <div className="loading">Загрузка курса...</div>
      </div>
    );
  }

  // Показываем ошибку 401
  if (error?.kind === 'UNAUTHORIZED') {
    return (
      <div className="page">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Назад
        </button>
        <div className="empty-state">
          <div className="empty-state-icon">🔐</div>
          <h3>Требуется авторизация</h3>
          <p>Для просмотра курса необходимо авторизоваться через Telegram Mini App.</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            Обновить
          </button>
        </div>
      </div>
    );
  }

  // Показываем ошибку 403 (нет доступа)
  if (error?.kind === 'FORBIDDEN') {
    return (
      <div className="page">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Назад
        </button>
        <div className="empty-state">
          <div className="empty-state-icon">🚫</div>
          <h3>Нет доступа к курсу</h3>
          <p>У вас нет активного доступа к этому курсу.</p>
          <button className="retry-button" onClick={() => navigate(-1)}>
            Назад
          </button>
        </div>
      </div>
    );
  }

  // Показываем ошибку 404 (курс не найден)
  if (error?.kind === 'NOT_FOUND') {
    return (
      <div className="page">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Назад
        </button>
        <div className="empty-state">
          <div className="empty-state-icon">❓</div>
          <h3>Курс не найден</h3>
          <p>Запрашиваемый курс не существует.</p>
          <button className="retry-button" onClick={() => navigate(-1)}>
            Назад
          </button>
        </div>
      </div>
    );
  }

  // Показываем другие ошибки
  if (error) {
    return (
      <div className="page">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Назад
        </button>
        <div className="error">
          <div className="error-icon">⚠️</div>
          <h3>Ошибка загрузки</h3>
          <p>{error.message}</p>
          <button className="retry-button" onClick={loadCourse}>
            Повторить
          </button>
        </div>
      </div>
    );
  }

  // Показываем курс
  if (!course) {
    return (
      <div className="page">
        <div className="loading">Курс не найден</div>
      </div>
    );
  }

  return (
    <div className="page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Назад
      </button>
      <h2>{course.title}</h2>
      {course.description && <p className="course-description">{course.description}</p>}

      <div className="modules-list">
        {course.modules.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <p>Модулей пока нет</p>
          </div>
        ) : (
          course.modules.map((module) => (
            <div key={module.id} className="module-card">
              <h3>{module.title}</h3>
              {module.description && <p className="module-description">{module.description}</p>}
              <div className="lessons-list">
                {module.lessons.length === 0 ? (
                  <p className="no-lessons">Уроков пока нет</p>
                ) : (
                  module.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      className="lesson-item"
                      onClick={() =>
                        navigate(`/learning/lessons/${lesson.id}`, {
                          state: { courseId: course.id },
                        })
                      }
                    >
                      {lesson.title}
                    </button>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CoursePage;
