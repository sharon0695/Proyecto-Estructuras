import type { Medicamento } from "../../types/Medicamento";
import styles from "./CardMedicamento.module.scss";

interface Props {
  medicamento: Medicamento;
}

export default function CardMedicamento({ medicamento }: Props) {
  return (
    <div className={styles.card}>
      <img
        src={medicamento.imagen}
        alt={medicamento.nombre}
        className={styles.image}
      />

      <h3>{medicamento.nombre}</h3>
      <p>${medicamento.precio}</p>

      <p className={medicamento.stock === 0 ? styles.out : ""}>
        {medicamento.stock > 0 ? "Disponible" : "Sin stock"}
      </p>

      <button className={styles.button} disabled={medicamento.stock === 0}>
        Agregar
      </button>
    </div>
  );
}