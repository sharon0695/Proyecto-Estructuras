import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../Firebase/config';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/shared/Navbar';
import styles from './ProfilePage.module.scss';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <section className={styles.card}>
          <h1>Mi perfil</h1>
          <p className={styles.emailLabel}>Correo</p>
          <strong className={styles.emailValue}>{user?.email ?? 'Sin correo disponible'}</strong>
          <button type="button" className={styles.logoutBtn} onClick={handleSignOut}>
            Cerrar sesión
          </button>
        </section>
      </main>
    </div>
  );
}