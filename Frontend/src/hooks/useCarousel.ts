import { useEffect, useState } from "react";
import { ListaCircularDoble } from "../structures/listaCircular";

export function useCarousel<T>(data: T[]) {
  const [lista] = useState(new ListaCircularDoble<T>());
  const [actual, setActual] = useState<T | null>(null);

  useEffect(() => {
    data.forEach(item => lista.insertar(item));
    setActual(lista.obtenerActual());
  }, [data]);

  const next = () => {
    const val = lista.siguiente();
    setActual(val);
  };

  const prev = () => {
    const val = lista.anterior();
    setActual(val);
  };

  return {
    actual,
    next,
    prev
  };
}