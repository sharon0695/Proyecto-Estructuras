import styles from "./Navbar.module.scss";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className={styles.topbar}>
      <button className={styles.brand} onClick={() => navigate("/Home")}>
        <span className={styles.brandLeaf}>🍃</span>
        <span>FarmaciaR</span>
      </button>

      <nav className={styles.menu}>
        <button type="button" onClick={() => navigate("/Home")}>
          Inicio
        </button>
        <button type="button" onClick={() => navigate("/Home")}>
          Productos
        </button>
        <button type="button" onClick={() => navigate("/Home")}>
          Ofertas
        </button>
        <button type="button" onClick={() => navigate("/Home")}>
          Nosotros
        </button>
      </nav>

      <div className={styles.topActions} onClick={() => navigate("/cart")}>
        <button type="button" aria-label="Carrito" className={styles.iconBtn}>
          <ShoppingCart />
        </button>
        <button type="button" aria-label="Perfil" className={styles.iconBtn}>
          <User />
        </button>
      </div>
    </header>
  );
}