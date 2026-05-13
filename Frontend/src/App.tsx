import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import Home from './pages/Home/Home'
import ProductsPage from './pages/Products/ProductsPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/Home" element={<ProductsPage />} />
    </Routes>
  )
}

export default App
