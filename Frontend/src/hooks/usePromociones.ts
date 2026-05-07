import { useEffect, useState } from "react";
import { getPromociones } from "../services/promociones.service";

export function usePromociones<T>() {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPromociones().then((res: any) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}