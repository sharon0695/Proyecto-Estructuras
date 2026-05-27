import { useEffect, useState } from "react";
import { subscribeMedicamentos } from "../services/medicamentos.service";
import type { Medicamento } from "../types/Medicamento";

export function useMedicamentos() {
  const [data, setData] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeMedicamentos((list) => {
      setData(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { data, loading };
}
