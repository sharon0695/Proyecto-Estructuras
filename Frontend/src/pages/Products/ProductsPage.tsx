import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMedicamentos } from "../../hooks/useMedicamento";
import { usePromociones } from "../../hooks/usePromociones";
import type { Medicamento } from "../../types/Medicamento";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../Firebase/config";
import { signOut } from "firebase/auth";

import styles from "./ProductsPage.module.scss";

type SortMode = "destacado" | "precio-asc" | "precio-desc";

// QUICK_TERMS removed — quick suggestions panel hidden

const CATEGORY_ICONS: Record<string, string> = {
  "Todos": "◉",
  "Analgesicos": "💊",
  "Analgésicos": "💊",
  "Analgésico": "💊",
  "Analgesico": "💊",
  "Vitaminas": "⚕",
  "Vitamina": "⚕",
  "Antibioticos": "🧪",
  "Antibióticos": "🧪",
  "Antibiótico": "🧪",
  "Antibiotico": "🧪",
  "Dermatologia": "💧",
  "Dermatología": "💧",
  "Digestivo": "◍",
  "Cardiovascular": "❤",
  "Infantil": "◔",
  "Cuidado Personal": "✦",
  "Cuidado": "✦",
  "Gel": "🧴",
  "Solar": "☀️",
};

function stripAccents(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeCategoria(raw: unknown): string {
  if (!raw) return "General";

  if (Array.isArray(raw)) {
    if (raw.length === 0) return "General";
    return normalizeCategoria(raw[0]);
  }

  if (typeof raw !== "string") return "General";

  const cleaned = raw.trim();
  if (!cleaned) return "General";

  return stripAccents(cleaned)
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function getPromoData(item: any) {
  return {
    title: item?.titulo ?? item?.nombre ?? "Descuento especial",
    subtitle: item?.descripcion ?? "Aprovecha nuestras promociones en productos seleccionados",
    image: item?.imagen ?? "/bg.jpeg",
    tag: item?.etiqueta ?? "OFERTA",
  };
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const { addToCart, totalItems } = useCart();
  const { isAdmin, user } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const offersRef = useRef<HTMLElement | null>(null);
  const productsRef = useRef<HTMLElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);
  const { data: promociones } = usePromociones<any>();
  const { data: medicamentos, loading } = useMedicamentos();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [sortMode, setSortMode] = useState<SortMode>("destacado");
  const [promoIndex, setPromoIndex] = useState(0);
  const [promoDirection, setPromoDirection] = useState<"next" | "prev">("next");

  const categoryList = useMemo(() => {
    const categoryMap = new Map<string, string>();
    medicamentos.forEach(med => {
      if (!med.categoria) return;
      if (Array.isArray(med.categoria)) {
        med.categoria.forEach(c => {
          if (c) categoryMap.set(normalizeCategoria(c), c.trim());
        });
      } else {
        categoryMap.set(normalizeCategoria(med.categoria), med.categoria.trim());
      }
    });

    const getBestIcon = (display: string, normalized: string): string => {
      if (CATEGORY_ICONS[display]) return CATEGORY_ICONS[display];
      if (CATEGORY_ICONS[normalized]) return CATEGORY_ICONS[normalized];

      const lower = display.toLowerCase();
      if (lower.includes("solar") || lower.includes("sol") || lower.includes("bloqueador")) return "☀️";
      if (lower.includes("dolor")) return "⚡";
      if (lower.includes("analges") || lower.includes("analgés")) return "💊";
      if (lower.includes("crema") || lower.includes("cream")) return "🧴";
      if (lower.includes("gel")) return "💧";
      if (lower.includes("corporal") || lower.includes("cuerpo")) return "🚶";
      if (lower.includes("alergia")) return "🤧";
      if (lower.includes("bebe") || lower.includes("bebé") || lower.includes("infantil") || lower.includes("niño") || lower.includes("niña")) return "🍼";
      if (lower.includes("digest") || lower.includes("estomago") || lower.includes("estómago")) return "◍";
      if (lower.includes("cardio") || lower.includes("corazon") || lower.includes("corazón") || lower.includes("presion") || lower.includes("presión")) return "❤️";
      if (lower.includes("dermo") || lower.includes("piel") || lower.includes("cutaneo") || lower.includes("cutáneo")) return "🧼";
      if (lower.includes("vitamina") || lower.includes("suplemento") || lower.includes("nutric") || lower.includes("nutrición")) return "⚕";
      if (lower.includes("antibio") || lower.includes("infeccion") || lower.includes("infección") || lower.includes("virus")) return "🧪";
      if (lower.includes("personal") || lower.includes("higiene") || lower.includes("jabon") || lower.includes("jabón") || lower.includes("ducha")) return "🚿";
      if (lower.includes("natural") || lower.includes("hierba") || lower.includes("planta") || lower.includes("te") || lower.includes("té")) return "🌿";

      return "🩹";
    };

    const list = Array.from(categoryMap.entries()).map(([normalized, display]) => ({
      label: display,
      normalized,
      icon: getBestIcon(display, normalized)
    }));

    return [{ label: "Todos", normalized: "Todos", icon: "◉" }, ...list];
  }, [medicamentos]);

  const filteredMedicamentos = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const normalizedCategory = selectedCategory;

    let result = medicamentos.filter((med) => {
      const byName = med.nombre?.toLowerCase().includes(normalizedQuery);
      
      const byCategory = Array.isArray(med.categoria)
        ? med.categoria.some(c => normalizeCategoria(c).toLowerCase().includes(normalizedQuery))
        : normalizeCategoria(med.categoria).toLowerCase().includes(normalizedQuery);

      const matchesSearch = normalizedQuery ? byName || byCategory : true;
      
      let matchesCategory = normalizedCategory === "Todos";
      if (!matchesCategory && med.categoria) {
        if (Array.isArray(med.categoria)) {
          matchesCategory = med.categoria.some(c => normalizeCategoria(c) === normalizedCategory);
        } else {
          matchesCategory = normalizeCategoria(med.categoria) === normalizedCategory;
        }
      }

      return matchesSearch && matchesCategory;
    });

    if (sortMode === "precio-asc") {
      result = [...result].sort((a, b) => Number(a.precio) - Number(b.precio));
    }

    if (sortMode === "precio-desc") {
      result = [...result].sort((a, b) => Number(b.precio) - Number(a.precio));
    }

    return result;
  }, [medicamentos, query, selectedCategory, sortMode]);

  const promoItems = useMemo(() => {
    if (promociones.length === 0) {
      return [getPromoData(null)];
    }

    return promociones.map((item) => getPromoData(item));
  }, [promociones]);

  const promo = promoItems[promoIndex] ?? promoItems[0];

  const goToPrevPromo = () => {
    if (promoItems.length <= 1) return;
    setPromoDirection("prev");
    setPromoIndex((prev) => (prev === 0 ? promoItems.length - 1 : prev - 1));
  };

  const goToNextPromo = () => {
    if (promoItems.length <= 1) return;
    setPromoDirection("next");
    setPromoIndex((prev) => (prev + 1) % promoItems.length);
  };

  const goToPromo = (index: number) => {
    if (index === promoIndex) return;
    setPromoDirection(index > promoIndex ? "next" : "prev");
    setPromoIndex(index);
  };

  // quick term selector removed

  const hasOffer = (index: number) => index % 4 === 0;
  const hasNewTag = (index: number) => index % 5 === 1;

  const formatPrice = (value: unknown) => {
    const numeric = Number(value ?? 0);
    return `$${numeric.toFixed(2)}`;
  };

  const scrollToSection = (target: React.RefObject<HTMLElement | null>) => {
    target.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <button className={styles.brand} onClick={() => navigate("/")}>
          <span className={styles.brandLeaf}>🍃</span>
          <span>FarmaciaR</span>
        </button>

        <nav className={styles.menu}>
          <button onClick={() => navigate("/")}>Inicio</button>
          <button type="button" onClick={() => scrollToSection(productsRef)}>Productos</button>
          <button type="button" onClick={() => scrollToSection(offersRef)}>Ofertas</button>
          <button type="button" onClick={() => scrollToSection(footerRef)}>Nosotros</button>
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

      <section className={styles.heroBanner}>
        <h1>Bienvenido a FarmaciaR</h1>
        <p>Encuentra los mejores productos para tu salud y bienestar</p>
      </section>

      <section className={styles.searchSection}>
        <div className={styles.searchRow}>
          <span className={styles.searchIcon}>⌕</span>
          <input
            type="text"
            placeholder="Busca medicamentos, vitaminas, marcas..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="button">Buscar</button>
        </div>

        {/* Quick terms panel removed as requested */}
      </section>

      <section ref={offersRef} className={styles.offersSection}>
        <h2>🔥 Ofertas especiales</h2>

        <article
          key={promoIndex}
          className={`${styles.offerCard} ${promoDirection === "next" ? styles.slideNext : styles.slidePrev}`}
        >
          <button
            type="button"
            className={styles.carouselArrow}
            aria-label="Anterior"
            onClick={goToPrevPromo}
          >
            ‹
          </button>

          <div className={styles.offerContent}>
            <span>{promo.tag}</span>
            <h3>{promo.title}</h3>
            <p>{promo.subtitle}</p>
            <button type="button">Ver productos</button>
          </div>

          <img src={promo.image} alt={promo.title} />

          <button
            type="button"
            className={styles.carouselArrow}
            aria-label="Siguiente"
            onClick={goToNextPromo}
          >
            ›
          </button>
        </article>

        <div className={styles.carouselDots}>
          {promoItems.map((item, index) => (
            <button
              key={`${item.title}-${index}`}
              type="button"
              className={`${styles.dotButton} ${index === promoIndex ? styles.dotActive : ""}`}
              aria-label={`Ir a promoción ${index + 1}`}
              onClick={() => goToPromo(index)}
            />
          ))}
        </div>
      </section>

      <section className={styles.categorySection}>
        <h2>Explorar por categoría</h2>

        <div className={styles.categoryGrid}>
          {categoryList.map((category) => {
            const active = selectedCategory === category.normalized;

            return (
              <button
                key={category.normalized}
                type="button"
                className={`${styles.categoryCard} ${active ? styles.categoryCardActive : ""}`}
                onClick={() => setSelectedCategory(category.normalized)}
              >
                <span>{category.icon}</span>
                <strong>{category.label}</strong>
              </button>
            );
          })}
        </div>
      </section>

      <section ref={productsRef} className={styles.productsSection}>
        <div className={styles.productsHead}>
          <h2>Productos disponibles</h2>
          <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)}>
            <option value="destacado">Ordenar por</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
          </select>
        </div>

        {loading ? (
          <p className={styles.productsLoading}>Cargando medicamentos...</p>
        ) : filteredMedicamentos.length === 0 ? (
          <p className={styles.productsLoading}>No hay resultados para tu búsqueda.</p>
        ) : (
          <div className={styles.productsGrid}>
             {filteredMedicamentos.map((med: Medicamento, index: number) => {
              const category = Array.isArray(med.categoria)
                ? med.categoria.map(c => normalizeCategoria(c)).join(" / ")
                : normalizeCategoria(med.categoria);
              const imageAlt = med.nombre || "Producto";

              return (
                <article
                  key={med.id}
                  className={styles.productCard}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/producto/${med.id}`, { state: med })}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigate(`/producto/${med.id}`, { state: med });
                    }
                  }}
                >
                  <div className={styles.productTopLine}>
                    {hasOffer(index) ? <span className={styles.badgeOffer}>Oferta</span> : null}
                    {hasNewTag(index) ? <span className={styles.badgeNew}>Nuevo</span> : null}
                    <button type="button" aria-label="Favorito" onClick={(event) => event.stopPropagation()}>
                      ♡
                    </button>
                  </div>

                  <img src={med.imagen} alt={imageAlt} loading="lazy" />

                  <small>{category}</small>
                  <h3>{med.nombre}</h3>

                  <div className={styles.priceRow}>
                    <strong>{formatPrice(med.precio)}</strong>
                    {hasOffer(index) ? <span>{formatPrice(Number(med.precio) * 1.2)}</span> : null}
                  </div>

                  <button
                    type="button"
                    disabled={med.stock <= 0}
                    onClick={(event) => {
                      event.stopPropagation();
                      addToCart(med, 1);
                    }}
                  >
                    {med.stock <= 0 ? "Agotado" : "🛒 Agregar al carrito"}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className={styles.helpSection}>
        <div className={styles.helpInfo}>
          <div className={styles.helpIcon}>◔</div>
          <div>
            <h3>¿Necesitas orientación?</h3>
            <p>Nuestros farmacéuticos expertos están disponibles para ayudarte con tus consultas</p>
          </div>
        </div>

        <div className={styles.helpActions}>
          <button type="button" className={styles.whatsappBtn}>🟢 WhatsApp</button>
        </div>
      </section>

      <footer ref={footerRef} className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <h4>🛡 FarmaciaR</h4>
            <p>Tu salud es nuestra prioridad. Productos de calidad con entrega a domicilio.</p>
          </div>

          <div className={styles.footerContact}>
            <h5>Contacto</h5>
            <p>Email: contacto@farmaciar.com</p>
            <p>Teléfono: +1 (555) 123-4567</p>
            <p>Horario: Lun - Sáb, 8:00 AM - 8:00 PM</p>
          </div>
        </div>

        <div className={styles.footerBottom}>© 2026 FarmaciaR. Todos los derechos reservados.</div>
      </footer>
    </div>
  );
}
