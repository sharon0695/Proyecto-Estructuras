import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import Home from './pages/Home/Home'
import ProductDetail from './pages/ProductDetail/ProductDetail'
import ProductsPage from './pages/Products/ProductsPage'
import { Cart } from './pages/cart/Cart'
import { CartProvider } from './context/CartContext'
import {Checkout} from './pages/cart/Checkout'
import {OrderConfirmation}from './pages/cart/OrderConfirmation'
//import Admin from './pages/admin/Admin'

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/Home" element={<ProductsPage />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        {
          //<Route path="/admin" element={<Admin />} />
        }
      </Routes>
    </CartProvider>
  )
}

export default App
