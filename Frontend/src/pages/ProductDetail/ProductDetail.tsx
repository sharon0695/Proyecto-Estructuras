import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMedicamentos } from "../../hooks/useMedicamento";
import { useCart } from "../../context/CartContext";
import { useHistorial } from "../../hooks/useHistorial";
import { useRecomendaciones } from "../../hooks/useRecomendaciones";
import type { Medicamento } from "../../types/Medicamento";
import styles from "./ProductDetail.module.scss";
import Navbar from "../../components/shared/Navbar";
import {toast} from "sonner"

type DetailState = Medicamento & {
  descripcion?: string;
  presentacion?: string;
};

function formatPrice(value: unknown) {
  const numeric = Number(value ?? 0);
  return `$${numeric.toFixed(2)}`;
}

function normalizeCategory(raw: unknown) {
  if (!raw || typeof raw !== "string") return "General";

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
  const locationState = location.state as DetailState | null;
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { historial, registrarVisto } = useHistorial();
  const { recomendar } = useRecomendaciones(medicamentos);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const product = useMemo(() => {
    if (locationState?.id) return locationState;

    return medicamentos.find((item) => item.id === id) ?? null;
  }, [id, locationState, medicamentos]);

  const category = normalizeCategory(product?.categoria);
  const availableUnits = Math.max(Number(product?.stock ?? 0), 0);
  const isAvailable = availableUnits > 0;
  const description =
    product?.descripcion ??
    `Producto de ${category.toLowerCase()} pensado para acompañarte en tu cuidado diario con una presentación confiable y práctica.`;
  const galleryImages = product ? [product.imagen, product.imagen, product.imagen] : [];
  const recentItems = historial
    .filter((item) => item.id !== product?.id)
    .slice(0, 3);
  let recomendaciones: Medicamento[] = [];
  if (product) {
    const fromGraph = recomendar(product.nombre).filter((item) => item.id !== product.id);
    if (fromGraph.length > 0) {
      recomendaciones = fromGraph;
    } else {
      // Fallback: sugerir por misma categoría si el grafo no arroja resultados
      recomendaciones = medicamentos
        .filter((m) => m.categoria === product.categoria && m.id !== product.id)
        .slice(0, 3);
    }
  }

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

  useEffect(() => {
    if (product) {
      registrarVisto(product);
    }
  }, [product?.id]);

  const selectedImage = galleryImages[activeImageIndex] ?? product.imagen;

  const handleAddToCart = () => {
    if (quantity > availableUnits) {
      toast.error(`Solo hay ${availableUnits} unidades disponibles`);
      return;
    }
    addToCart(product, quantity);
    toast.success(`✓ ${quantity} ${quantity === 1 ? 'unidad agregada' : 'unidades agregadas'} al carrito`, {
      duration: 2000,
    });
  };
  
  const changeQuantity = (nextValue: number) => {
    const bounded = Math.min(Math.max(nextValue, 1), Math.max(availableUnits, 1));
    setQuantity(bounded);
  };

  return (
    <div className={styles.page}>
      <Navbar />

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

            <button type="button" className={styles.cartButton} disabled={!isAvailable} onClick={(handleAddToCart)}>
              Agregar al carrito
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
            <button type="button" className={styles.chatBtn}>
              💬 Chat en vivo
            </button>
            <button type="button" className={styles.whatsappBtn}>
              🟢 WhatsApp
            </button>
          </div>
        </section>

        {historial.length > 0 ? (
          <section className={styles.descriptionCard}>
            <div className={styles.descriptionHeader}>
              <h2>Vistos recientemente</h2>
            </div>

            <div className={styles.horizontalList}>
              {recentItems.length > 0 ? recentItems.map((item) => (
                  <div key={item.id} className={styles.miniCard}>
                    <button
                      type="button"
                      className={styles.cardImageBtn}
                      onClick={() => navigate(`/producto/${item.id}`, { state: item })}
                    >
                      <img src={item.imagen} alt={item.nombre} />
                    </button>

                    <div className={styles.cardBody}>
                      <strong className={styles.cardTitle}>{item.nombre}</strong>
                      <span className={styles.cardPrice}>{formatPrice(item.precio)}</span>
                      <div className={styles.cardActions}>
                        <button
                          type="button"
                          onClick={() => navigate(`/producto/${item.id}`, { state: item })}
                          className={styles.viewBtn}
                        >
                          Ver
                        </button>
                        <button
                          type="button"
                          onClick={() => addToCart(item, 1)}
                          className={styles.addSmallBtn}
                          disabled={item.stock <= 0}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )) : (
                <div className={styles.emptyStateCard}>
                  Sigue explorando productos para ver aquí los que acabas de visitar.
                </div>
              )}
            </div>
          </section>
        ) : null}

        {recomendaciones.length > 0 ? (
          <section className={styles.descriptionCard}>
            <div className={styles.descriptionHeader}>
              <h2>Recomendaciones</h2>
            </div>

            <div className={styles.horizontalList}>
              {recomendaciones.slice(0, 3).map((item) => (
                <div key={item.id} className={styles.miniCard}>
                  <button
                    type="button"
                    className={styles.cardImageBtn}
                    onClick={() => navigate(`/producto/${item.id}`, { state: item })}
                  >
                    <img src={item.imagen} alt={item.nombre} />
                  </button>

                  <div className={styles.cardBody}>
                    <strong className={styles.cardTitle}>{item.nombre}</strong>
                    <span className={styles.cardPrice}>{formatPrice(item.precio)}</span>
                    <div className={styles.cardActions}>
                      <button
                        type="button"
                        onClick={() => navigate(`/producto/${item.id}`, { state: item })}
                        className={styles.viewBtn}
                      >
                        Ver
                      </button>
                      <button
                        type="button"
                        onClick={() => addToCart(item, 1)}
                        className={styles.addSmallBtn}
                        disabled={item.stock <= 0}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className={styles.descriptionCard}>
            <div className={styles.descriptionHeader}>
              <h2>Recomendaciones</h2>
            </div>
            <div className={styles.emptyStateCard}>
              No encontramos recomendaciones relacionadas todavía, pero puedes seguir navegando el catálogo.
            </div>
          </section>
        )}
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