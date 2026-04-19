import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './layouts/Layout'
import ChatPage from './pages/ChatPage'
import Dashboard from './pages/dashboard'
import InsightsPage from './pages/insights'
import MealsPage from './pages/meals'
import PainPage from './pages/PainPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pain" element={<PainPage />} />
          <Route path="/meals" element={<MealsPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
