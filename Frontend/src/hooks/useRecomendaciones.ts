import { useEffect, useState } from "react";
import { Grafo } from "../structures/grafo";
import { relaciones } from "../helpers/relaciones";

export function useRecomendaciones(medicamentos: any[]) {
  const [grafo] = useState(new Grafo<string>());

  useEffect(() => {
    relaciones.forEach(([a, b]) => {
      grafo.agregarArista(a, b);
    });
  }, []);

  const recomendar = (nombre: string) => {
    const cercanos = grafo.buscarCercanos(nombre, 2);

    return medicamentos.filter(m =>
      cercanos.includes(m.nombre) && m.stock > 0
    );
  };

  return { recomendar };
}