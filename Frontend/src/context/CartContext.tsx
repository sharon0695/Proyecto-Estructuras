import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {toast} from 'sonner'
import type { Medicamento } from '../types/Medicamento';

interface CartItem extends Medicamento {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Medicamento, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('farmaciaRCart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
        toast.error('Error al cargar el carrito')
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('farmaciaRCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Medicamento, quantity: number = 1) => {
    // Validate quantity
    if (quantity <= 0) {
      toast.error('La cantidad debe ser mayor a 0');
      return;
    }

    if (quantity > product.stock) {
      toast.error(`Solo hay ${product.stock} unidades disponibles`);
      return;
    }

    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        
        if (newQuantity > product.stock) {
          toast.error(
            `No puedes agregar más de ${product.stock} unidades de ${product.nombre}. Tienes ${existingItem.quantity}.`
          );
          return currentCart;
        }

        toast.success(
          `✓ Cantidad actualizada a ${newQuantity}`,
          {
            duration: 2000,
            description: product.nombre
          }
        );

        return currentCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(newQuantity, product.stock) }
            : item
        );
      } else {
        toast.success(
          `✓ Agregado al carrito`,
          {
            duration: 2000,
            description: `${quantity}x ${product.nombre}`
          }
        );

        return [...currentCart, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    const product = cart.find(item => item.id === productId);
    setCart(currentCart => currentCart.filter(item => item.id !== productId));

    if (product) {
      toast.info(
        `${product.nombre} removido del carrito`,
        {
          duration: 2000,
          icon: '🗑️'
        }
      );
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = cart.find(item => item.id === productId);
    
    if (!product) {
      toast.error('Producto no encontrado en el carrito');
      return;
    }

    if (quantity > product.stock) {
      toast.error(`Solo hay ${product.stock} unidades disponibles`);
      return;
    }

    setCart(currentCart =>
      currentCart.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, Math.min(quantity, product.stock)) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    toast.success('Carrito vaciado', { duration: 1500 });
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.precio * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
