import React, { createContext, useContext, useState, useEffect } from "react";
import type { Medicamento } from "../types/Medicamento";
import { updateMedicamentoStock } from "../services/medicamentos.service";
import { crearOrden } from "../services/ordenes.service";

export interface CartItem {
  product: Medicamento;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Medicamento, quantity: number) => Promise<void>;
  updateQuantity: (productId: string, newQuantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  placeOrder: (cliente: { nombre: string; direccion: string; telefono: string; metodoPago: string }) => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const updateFirestoreStock = async (productId: string, change: number) => {
    try {
      await updateMedicamentoStock(productId, change);
    } catch (error) {
      console.error("Error al actualizar el stock en Firestore:", error);
    }
  };

  const addToCart = async (product: Medicamento, quantity: number) => {
    if (quantity <= 0) return;
    
    // Decrement database stock by the added quantity
    await updateFirestoreStock(product.id, -quantity);

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { product, quantity }];
    });
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    const item = cartItems.find((i) => i.product.id === productId);
    if (!item || newQuantity <= 0) return;

    const diff = newQuantity - item.quantity;
    if (diff === 0) return;

    // Decrement database stock by the difference
    await updateFirestoreStock(productId, -diff);

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = async (productId: string) => {
    const item = cartItems.find((i) => i.product.id === productId);
    if (!item) return;

    // Refund/increment database stock by the full quantity in the cart
    await updateFirestoreStock(productId, item.quantity);

    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const clearCart = async () => {
    // Refund/increment database stock for all items
    for (const item of cartItems) {
      await updateFirestoreStock(item.product.id, item.quantity);
    }
    setCartItems([]);
  };

  const placeOrder = async (cliente: { nombre: string; direccion: string; telefono: string; metodoPago: string }) => {
    if (cartItems.length === 0) return;

    // Calculate total price
    const total = cartItems.reduce((acc, item) => acc + Number(item.product.precio) * item.quantity, 0);

    // Save order through the service function
    await crearOrden({
      cliente,
      items: cartItems.map((item) => ({
        id: item.product.id,
        nombre: item.product.nombre,
        precio: Number(item.product.precio),
        cantidad: item.quantity,
        imagen: item.product.imagen
      })),
      total,
      estado: "Pendiente"
    });

    // Clear local cart items WITHOUT updating Firestore stock (since the order is finalized)
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + Number(item.product.precio) * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        placeOrder,
        totalItems,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
