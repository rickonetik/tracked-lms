import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LearningPage from './pages/LearningPage';
import ExpertPage from './pages/ExpertPage';
import AccountPage from './pages/AccountPage';
import CoursePage from './pages/CoursePage';
import LessonPage from './pages/LessonPage';
import { LearningProvider } from './features/learning/learning.store';

function App() {
  return (
    <LearningProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<LearningPage />} />
          <Route path="/learning" element={<LearningPage />} />
          <Route path="/learning/courses/:courseId" element={<CoursePage />} />
          <Route path="/learning/lessons/:lessonId" element={<LessonPage />} />
          <Route path="/expert" element={<ExpertPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Routes>
      </Layout>
    </LearningProvider>
  );
}

export default App;
