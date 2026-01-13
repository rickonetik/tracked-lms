import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LearningPage from './pages/LearningPage';
import ExpertPage from './pages/ExpertPage';
import AccountPage from './pages/AccountPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LearningPage />} />
        <Route path="/learning" element={<LearningPage />} />
        <Route path="/expert" element={<ExpertPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
