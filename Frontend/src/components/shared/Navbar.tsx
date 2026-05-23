import styles from "./Navbar.module.scss";
import { useNavigate } from "react-router-dom";
import { auth } from "../../Firebase/config";
import { signOut } from "firebase/auth";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className={styles.navbar}>
      
      <div className={styles.logo}>
        💊 FarmaApp
      </div>

      <div className={styles.links}>
        <button onClick={() => navigate('/Home')}>Inicio</button>
        <button onClick={() => navigate('/Productos')}>Productos</button>
        <button onClick={() => navigate('/Carrito')}>🛒</button>
        <button onClick={() => {
          signOut(auth).then(() => {
            navigate('/Login');
          });
        }}>Cerrar sesión</button>
      </div>
    </nav>
  );
}