import styles from './AddConfirmationModal.module.scss';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function AddConfirmationModal() {
  const { lastAdded, clearLastAdded } = useCart() as any;
  const navigate = useNavigate();

  if (!lastAdded) return null;

  const { product, quantity } = lastAdded;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <h3>Gracias por tu compra</h3>
        <p>{quantity} × {product.nombre} agregado{quantity>1?'s':''} al carrito.</p>
        <div className={styles.actions}>
          <button onClick={() => { clearLastAdded(); navigate('/cart'); }} className={styles.primary}>
            Ir al carrito
          </button>
          <button onClick={() => { clearLastAdded(); navigate('/Home'); }} className={styles.secondary}>
            Seguir comprando
          </button>
        </div>
      </div>
    </div>
  );
}
