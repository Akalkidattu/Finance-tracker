import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard'
import TransactionsPage from './pages/TransactionsPage';
import InsightsPage from './pages/InsightsPage';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/transactions' element={<TransactionsPage />} />
      <Route path='/insights' element={<InsightsPage />} />
    </Routes>
  )
}

export default App
