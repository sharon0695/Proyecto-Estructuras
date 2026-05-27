import { db } from "../Firebase/config";
import { collection, getDocs, onSnapshot, doc, updateDoc, Timestamp } from "firebase/firestore";

const MEDICAMENTOS_COLLECTION = "medicamentos";

export const getMedicamentos = async () => {
  const snapshot = await getDocs(collection(db, MEDICAMENTOS_COLLECTION));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const subscribeMedicamentos = (
  onChange: (medicamentos: any[]) => void,
  onError?: (error: Error) => void
) => {
  return onSnapshot(
    collection(db, MEDICAMENTOS_COLLECTION),
    (snapshot) => {
      const medicamentos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      onChange(medicamentos);
    },
    (error) => {
      console.error("Error subscribing to medicamentos:", error);

      if (onError) {
        onError(error as Error);
      }
    }
  );
};

export const updateMedicamentoStock = async (medicamentoId: string, stock: number) => {
  const ref = doc(db, MEDICAMENTOS_COLLECTION, medicamentoId);

  await updateDoc(ref, {
    stock,
    updatedAt: Timestamp.now(),
  });
};