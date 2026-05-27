import { db } from "../Firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export interface OrdenCliente {
  nombre: string;
  direccion: string;
  telefono: string;
  metodoPago: string;
}

export interface OrdenItem {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

export interface OrdenData {
  cliente: OrdenCliente;
  items: OrdenItem[];
  total: number;
  estado: string;
}

export const crearOrden = async (ordenData: OrdenData) => {
  return await addDoc(collection(db, "ordenes"), {
    ...ordenData,
    fecha: serverTimestamp()
  });
};
