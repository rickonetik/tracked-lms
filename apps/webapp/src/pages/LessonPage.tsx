import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { lessonsService, StudentLessonDto } from '../services/lessons.service';
import { progressService } from '../services/progress.service';
import { useLearningStore } from '../features/learning/learning.store';
import './Page.css';
import './LessonPage.css';

type ErrorKind = 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'GENERIC';

interface ErrorState {
  kind: ErrorKind;
  message: string;
}

function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { applyProgressFromComplete, optimisticIncrement, loadMyCourses } = useLearningStore();
  const [lesson, setLesson] = useState<StudentLessonDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completeError, setCompleteError] = useState<string | null>(null);
  const isFetchingRef = useRef(false); // Защита от дублирования запросов (StrictMode)

  // Проверяем, пройден ли урок (из API или локально после complete)
  const isCompleted = lesson?.completedAt != null;

  // Получаем courseId из navigation state
  const courseId = (location.state as { courseId?: string })?.courseId;

  const loadLesson = async () => {
    if (!lessonId) {
      setError({ kind: 'NOT_FOUND', message: 'Lesson ID not provided' });
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
      const data = await lessonsService.getLesson(lessonId);
      setLesson(data);
    } catch (err: any) {
      const statusCode = err?.statusCode;
      const errorCode = err?.error; // apiClient сохраняет error code

      if (statusCode === 401) {
        setError({ kind: 'UNAUTHORIZED', message: 'Требуется авторизация' });
      } else if (statusCode === 403 && errorCode === 'ENROLLMENT_REQUIRED') {
        setError({ kind: 'FORBIDDEN', message: 'Нет доступа к уроку' });
      } else if (statusCode === 404 && errorCode === 'LESSON_NOT_FOUND') {
        setError({ kind: 'NOT_FOUND', message: 'Урок не найден' });
      } else {
        const errorMessage =
          err instanceof Error ? err.message : 'Не удалось загрузить урок';
        setError({ kind: 'GENERIC', message: errorMessage });
      }
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    // Сбрасываем флаг при изменении lessonId или auth состояния
    isFetchingRef.current = false;
    loadLesson();
  }, [lessonId, isAuthenticated, authLoading]);

  async function handleComplete() {
    if (!lessonId || isCompleting || isCompleted) {
      return;
    }

    setIsCompleting(true);
    setCompleteError(null);

    try {
      const progressSnapshot = await progressService.completeLesson(lessonId);

      // Обновляем прогресс в store
      if (courseId) {
        // Если API вернул snapshot с courseId - используем его
        if (progressSnapshot.courseId === courseId) {
          applyProgressFromComplete(courseId, {
            totalLessons: progressSnapshot.totalLessons,
            completedLessons: progressSnapshot.completedLessons,
            progressPercent: progressSnapshot.progressPercent,
          });
        } else {
          // Иначе делаем optimistic increment
          optimisticIncrement(courseId);
        }
      } else {
        // Если courseId нет - делаем полную перезагрузку
        await loadMyCourses();
      }

      // Перезагружаем урок, чтобы получить актуальный completedAt из API
      // Это гарантирует, что после reload статус сохранится
      await loadLesson();
    } catch (err: any) {
      console.error('Error completing lesson:', err);
      const statusCode = err?.statusCode;
      const errorCode = err?.error;
      const errorMessage = err?.message;
      
      if (statusCode === 401) {
        setCompleteError('Требуется авторизация');
      } else if (statusCode === 403 && errorCode === 'ENROLLMENT_REQUIRED') {
        setCompleteError('Нет доступа к уроку');
      } else if (statusCode === 404 && errorCode === 'LESSON_NOT_FOUND') {
        setCompleteError('Урок не найден');
      } else {
        // Показываем более детальное сообщение об ошибке
        const message = errorMessage || `Ошибка при завершении урока (${statusCode || 'unknown'})`;
        setCompleteError(message);
      }
    } finally {
      setIsCompleting(false);
    }
  }

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
          <p>Для просмотра урока необходимо авторизоваться через Telegram Mini App.</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            Обновить
          </button>
        </div>
      </div>
    );
  }

  // Показываем загрузку урока
  if (isLoading) {
    return (
      <div className="page">
        <div className="loading">Загрузка урока...</div>
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
          <p>Для просмотра урока необходимо авторизоваться через Telegram Mini App.</p>
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
          <h3>Нет доступа к уроку</h3>
          <p>У вас нет активного доступа к этому уроку.</p>
          <button className="retry-button" onClick={() => navigate(-1)}>
            Назад
          </button>
        </div>
      </div>
    );
  }

  // Показываем ошибку 404 (урок не найден)
  if (error?.kind === 'NOT_FOUND') {
    return (
      <div className="page">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Назад
        </button>
        <div className="empty-state">
          <div className="empty-state-icon">❓</div>
          <h3>Урок не найден</h3>
          <p>Запрашиваемый урок не существует.</p>
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
          <button className="retry-button" onClick={loadLesson}>
            Повторить
          </button>
        </div>
      </div>
    );
  }

  // Показываем урок
  if (!lesson) {
    return (
      <div className="page">
        <div className="loading">Урок не найден</div>
      </div>
    );
  }

  return (
    <div className="page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Назад
      </button>
      <h2>Урок</h2>
      <h1 className="lesson-title">{lesson.title}</h1>

      <div className="lesson-description">
        {lesson.description ? (
          <p>{lesson.description}</p>
        ) : (
          <p className="no-description">Описание отсутствует</p>
        )}
      </div>

      <div className="video-placeholder">
        <div className="video-placeholder-icon">🎥</div>
        <h3>Видео будет добавлено позже</h3>
        <p className="video-placeholder-note">EPIC 5</p>
      </div>

      <div className="lesson-actions">
        <button
          className="complete-button"
          onClick={handleComplete}
          disabled={isCompleted || isCompleting}
        >
          {isCompleted ? 'Урок пройден ✓' : 'Пройдено'}
        </button>
        {completeError && <div className="complete-error">{completeError}</div>}
      </div>
    </div>
  );
}

export default LessonPage;
