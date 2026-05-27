import { db } from "../Firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import type { Order } from "../types/Orders";

const ORDERS_COLLECTION = "orders";

export const createOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const orderData = {
      ...order,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), orderData);
    return { id: docRef.id, ...orderData };
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const getOrderById = async (orderId: string) => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Order;
    }
    return null;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

export const getUserOrders = async (userId: string) => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where("userId", "==", userId)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order));
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};

export const updateOrderStatus = async (
  orderId: string,
  status: Order['status']
) => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    const snapshot = await getDocs(collection(db, ORDERS_COLLECTION));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order));
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw error;
  }
};
