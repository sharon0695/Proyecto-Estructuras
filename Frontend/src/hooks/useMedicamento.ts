import { useEffect, useState } from "react";
import { getMedicamentos } from "../services/medicamentos.service";
import type { Medicamento } from "../types/Medicamento";

export function useMedicamentos() {
  const [data, setData] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMedicamentos().then((res: any) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}