import { useMemo } from "react";
import { ArbolNario } from "../structures/arbol";

const CATEGORIAS_BASE = [
  { label: "Analgésicos", icon: "💊", parent: "Todos" },
  { label: "Vitaminas", icon: "⚕", parent: "Todos" },
  { label: "Antibióticos", icon: "🧪", parent: "Todos" },
  { label: "Dermatología", icon: "💧", parent: "Cuidado Personal" },
  { label: "Digestivo", icon: "◍", parent: "Todos" },
  { label: "Cardiovascular", icon: "❤", parent: "Todos" },
  { label: "Infantil", icon: "◔", parent: "Todos" },
  { label: "Cuidado Personal", icon: "✦", parent: "Todos" },
];

export function useCategorias() {
  return useMemo(() => {
    const arbol = new ArbolNario<string>();
    arbol.agregarRaiz("Todos");

    CATEGORIAS_BASE.forEach((categoria) => {
      arbol.agregarHijo(categoria.parent, categoria.label);
    });

    const niveles = arbol.obtenerNiveles();

    const categorias = CATEGORIAS_BASE.map((categoria) => ({
      label: categoria.label,
      icon: categoria.icon,
    }));

    return {
      arbol,
      categorias,
      niveles,
    };
  }, []);
}