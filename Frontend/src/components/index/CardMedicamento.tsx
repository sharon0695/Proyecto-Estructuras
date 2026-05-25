import type { Medicamento } from "../../types/Medicamento";
import styles from "./CardMedicamento.module.scss";
import { useCart } from "../../context/CartContext";
import { toast } from "sonner";

interface Props {
  medicamento: Medicamento;
}

export function CardMedicamento({ medicamento }: Props) {
  const { addToCart } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (medicamento.stock <= 0) {
      toast.error('Producto agotado');
      return;
    }
    addToCart(medicamento, 1);
  };

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

      <button className={styles.button} disabled={medicamento.stock === 0} onClick={handleAdd}>
        Agregar
      </button>
    </div>
  );
}