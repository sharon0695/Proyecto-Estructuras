import { db } from "../Firebase/config";
import { collection, getDocs } from "firebase/firestore";

export const getMedicamentos = async () => {
  const snapshot = await getDocs(collection(db, "medicamentos"));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};