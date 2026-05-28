import { useEffect, useState } from "react";
import { Grafo } from "../structures/grafo";
import { relaciones } from "../helpers/relaciones";

export function useRecomendaciones(medicamentos: any[]) {
  const [grafo] = useState(() => new Grafo<string>());

  useEffect(() => {
    relaciones.forEach(([a, b]) => {
      grafo.agregarArista(a, b);
    });
  }, []);

  const recomendar = (nombre: string) => {
    const cercanos = grafo.buscarCercanos(nombre, 2);

    let result = Array.from(
      new Map(
        medicamentos
          .filter(m => cercanos.includes(m.nombre) && m.nombre !== nombre)
          .map((item) => [item.id, item])
      ).values()
    );

    if (result.length === 0 && medicamentos.length > 0) {
      const actual = medicamentos.find(m => m.nombre === nombre);
      const mismoCat = medicamentos.find(m => m.nombre !== nombre && actual && m.categoria === actual.categoria);
      if (mismoCat) {
        result = [mismoCat];
      } else {
        const otro = medicamentos.find(m => m.nombre !== nombre);
        if (otro) {
          result = [otro];
        }
      }
    }

    return result;
  };

  return { recomendar };
}