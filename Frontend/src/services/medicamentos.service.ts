import { db } from "../Firebase/config";
import { collection, getDocs, onSnapshot, doc, updateDoc, increment } from "firebase/firestore";
import type { Medicamento } from "../types/Medicamento";

export const getMedicamentos = async () => {
  const snapshot = await getDocs(collection(db, "medicamentos"));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const subscribeMedicamentos = (callback: (medicamentos: Medicamento[]) => void) => {
  return onSnapshot(collection(db, "medicamentos"), (snapshot) => {
    const list = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Medicamento[];
    callback(list);
  });
};

export const updateMedicamentoStock = async (productId: string, change: number) => {
  const docRef = doc(db, "medicamentos", productId);
  await updateDoc(docRef, {
    stock: increment(change)
  });
};