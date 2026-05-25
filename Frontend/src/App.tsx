import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import AppRoutes from './router/AppRoutes'
import AddConfirmationModal from './components/shared/AddConfirmationModal'

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <CartProvider>
          <AddConfirmationModal />
          <AppRoutes />
        </CartProvider>
      </DataProvider>
    </AuthProvider>
  )
}

export default App
