import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMedicamentos } from "../../hooks/useMedicamento";
import type { Medicamento } from "../../types/Medicamento";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../Firebase/config";
import { signOut } from "firebase/auth";
import styles from "./ProductDetail.module.scss";

type DetailState = Medicamento & {
  descripcion?: string;
  presentacion?: string;
};

function formatPrice(value: unknown) {
  const numeric = Number(value ?? 0);
  return `$${numeric.toFixed(2)}`;
}

function normalizeCategory(raw: unknown): string {
  if (!raw) return "General";

  if (Array.isArray(raw)) {
    if (raw.length === 0) return "General";
    return normalizeCategory(raw[0]);
  }

  if (typeof raw !== "string") return "General";

  return raw
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { data: medicamentos, loading } = useMedicamentos();
  const { addToCart, totalItems } = useCart();
  const { isAdmin, user } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const locationState = location.state as DetailState | null;
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const product = useMemo(() => {
    if (locationState?.id) return locationState;

    return medicamentos.find((item) => item.id === id) ?? null;
  }, [id, locationState, medicamentos]);

  const category = useMemo(() => {
    if (!product?.categoria) return "General";
    if (Array.isArray(product.categoria)) {
      return product.categoria.map(c => normalizeCategory(c)).join(" / ");
    }
    return normalizeCategory(product.categoria);
  }, [product]);

  const availableUnits = Math.max(Number(product?.stock ?? 0), 0);
  const isAvailable = availableUnits > 0;
  const description =
    product?.descripcion ??
    `Producto de ${category.toLowerCase()} pensado para acompañarte en tu cuidado diario con una presentación confiable y práctica.`;
  const galleryImages = product ? [product.imagen, product.imagen, product.imagen] : [];

  if (!product && loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingState}>Cargando detalle del producto...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.page}>
        <div className={styles.notFoundCard}>
          <h1>No encontramos este producto</h1>
          <p>Vuelve a la lista para elegir otro medicamento.</p>
          <button type="button" onClick={() => navigate("/Home")}>
            Volver a productos
          </button>
        </div>
      </div>
    );
  }

  const selectedImage = galleryImages[activeImageIndex] ?? product.imagen;

  const changeQuantity = (nextValue: number) => {
    const bounded = Math.min(Math.max(nextValue, 1), Math.max(availableUnits, 1));
    setQuantity(bounded);
  };

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <button className={styles.brand} onClick={() => navigate("/")}>
          <span className={styles.brandLeaf}>🍃</span>
          <span>FarmaciaR</span>
        </button>

        <nav className={styles.menu}>
          <button type="button" onClick={() => navigate("/")}>
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
            onClick={() => navigate("/carrito")}
            style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            🛒
            {totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: '#e03131',
                color: '#fff',
                borderRadius: '50%',
                padding: '2px 5px',
                fontSize: '9px',
                fontWeight: 'bold',
                lineHeight: 1,
                border: '1px solid #fff'
              }}>
                {totalItems}
              </span>
            )}
          </button>
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              aria-label="Perfil"
              className={styles.iconBtn}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              👤
            </button>
            {showProfileMenu && (
              <div style={{
                position: 'absolute',
                top: '40px',
                right: '0',
                background: '#fff',
                border: '1px solid #dbe3ed',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                padding: '16px',
                minWidth: '200px',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ fontWeight: 'bold', color: '#17324c', borderBottom: '1px solid #f0f4f8', paddingBottom: '8px' }}>
                  {user?.displayName || user?.email || "Usuario"}
                </div>
                {isAdmin && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/admin');
                    }}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#136b96',
                      fontWeight: 'bold',
                      textAlign: 'left',
                      padding: '6px 0',
                      cursor: 'pointer'
                    }}
                  >
                    Panel Admin
                  </button>
                )}
                <button 
                  type="button" 
                  onClick={() => {
                    signOut(auth).then(() => {
                      navigate('/Login');
                    });
                  }}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#da5c5c',
                    fontWeight: 'bold',
                    textAlign: 'left',
                    padding: '6px 0',
                    cursor: 'pointer'
                  }}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.breadcrumbs}>
          <button type="button" onClick={() => navigate("/Home")}>
            Volver a productos
          </button>
          <span>/</span>
          <span>{category}</span>
          <span>/</span>
          <strong>{product.nombre}</strong>
        </div>

        <section className={styles.detailGrid}>
          <div className={styles.galleryColumn}>
            <div className={styles.mainImageCard}>
              <img src={selectedImage} alt={product.nombre} />
            </div>

            <div className={styles.thumbnailRow}>
              {galleryImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  className={`${styles.thumbnailButton} ${index === activeImageIndex ? styles.thumbnailActive : ""}`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img src={image} alt={`${product.nombre} vista ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          <aside className={styles.infoColumn}>
            <span className={styles.categoryTag}>{category}</span>
            <h1>{product.nombre}</h1>
            <div className={styles.price}>{formatPrice(product.precio)}</div>
            <p className={styles.description}>{description}</p>

            <div className={styles.stockCard}>
              <div>
                <span>Disponibilidad:</span>
                <strong>{isAvailable ? "En stock" : "Agotado"}</strong>
              </div>
              <div>
                <span>ID:</span>
                <strong>{product.id}</strong>
              </div>
            </div>

            <div className={styles.quantityRow}>
              <span>Cantidad:</span>
              <div className={styles.quantityControl}>
                <button type="button" onClick={() => changeQuantity(quantity - 1)}>
                  −
                </button>
                <strong>{quantity}</strong>
                <button type="button" onClick={() => changeQuantity(quantity + 1)}>
                  +
                </button>
              </div>
              <small>{availableUnits > 0 ? `${availableUnits} disponibles` : "Sin unidades disponibles"}</small>
            </div>

            <button
              type="button"
              className={styles.cartButton}
              disabled={!isAvailable}
              onClick={async () => {
                if (product) {
                  await addToCart(product as Medicamento, quantity);
                  setQuantity(1);
                }
              }}
            >
              🛒 Agregar al carrito
            </button>

            <div className={styles.perksRow}>
              <div>
                <span>🛡</span>
                <strong>Producto certificado</strong>
              </div>
              <div>
                <span>🚚</span>
                <strong>Envío gratis +$50</strong>
              </div>
              <div>
                <span>↺</span>
                <strong>Devolución 30 días</strong>
              </div>
            </div>
          </aside>
        </section>

        <section className={styles.descriptionCard}>
          <div className={styles.descriptionHeader}>
            <h2>Descripción del producto</h2>
          </div>

          <div className={styles.descriptionGrid}>
            <article>
              <h3>Información general</h3>
              <p>
                Este producto de alta calidad está diseñado para brindarte apoyo en tu cuidado de la salud y
                mantener una experiencia de compra clara y confiable.
              </p>
              <ul>
                <li>Certificado por autoridades sanitarias</li>
                <li>Fórmula de alta calidad</li>
                <li>Resultados comprobados</li>
              </ul>
            </article>

            <article>
              <h3>Modo de uso</h3>
              <p>
                Sigue las indicaciones de tu médico o farmacéutico. Lee cuidadosamente el prospecto antes de usar.
              </p>
              <div className={styles.warningBox}>
                <strong>Advertencia:</strong> Mantener fuera del alcance de los niños. No exceder la dosis
                recomendada.
              </div>
            </article>
          </div>
        </section>

        <section className={styles.contactSection}>
          <div className={styles.contactInfo}>
            <div className={styles.contactIcon}>◔</div>
            <div>
              <h3>¿Necesitas orientación?</h3>
              <p>Nuestros farmacéuticos pueden ayudarte con dudas sobre este producto.</p>
            </div>
          </div>

          <div className={styles.contactActions}>
            <button type="button" className={styles.whatsappBtn}>
              🟢 WhatsApp
            </button>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div>
            <h4>🛡 FarmaciaR</h4>
            <p>Tu salud es nuestra prioridad. Productos de calidad con entrega a domicilio.</p>
          </div>

          <div>
            <h5>Contacto</h5>
            <p>Email: contacto@farmaciar.com</p>
            <p>Teléfono: +1 (555) 123-4567</p>
            <p>Horario: Lun - Sáb, 8:00 AM - 8:00 PM</p>
          </div>
        </div>
      </footer>
    </div>
  );
}