import styles from "./Navbar.module.scss";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../Firebase/config";

export default function Navbar() {
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { isAdmin } = useAuth();
  const count = getCartCount();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    setShowUserMenu(false);
    navigate('/');
  };

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

      <div className={styles.topActions}>
        <button
          type="button"
          aria-label="Carrito"
          className={styles.iconBtn}
          onClick={() => navigate("/cart")}
        >
          <ShoppingCart />
          {count > 0 && <span className={styles.cartBadge}>{count}</span>}
        </button>

        <div className={styles.userMenuWrapper}>
          <button
            type="button"
            aria-label="Perfil"
            className={styles.iconBtn}
            onClick={() => setShowUserMenu((prev) => !prev)}
          >
            <User />
          </button>

          {showUserMenu ? (
            <div className={styles.userDropdown}>
              <button type="button" onClick={() => navigate('/profile')}>
                Mi perfil
              </button>
              {isAdmin ? (
                <button type="button" onClick={() => navigate('/admin')}>
                  Panel admin
                </button>
              ) : null}
              <button type="button" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}