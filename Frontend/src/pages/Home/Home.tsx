import { Link, useNavigate } from "react-router-dom";

import styles from "./Home.module.scss";

const ventajas = [
  {
    id: 1,
    icono: "✓",
    titulo: "Productos Certificados",
    texto: "Todos nuestros productos estan certificados y aprobados por las autoridades sanitarias",
  },
  {
    id: 2,
    icono: "⚡",
    titulo: "Entrega Rapida",
    texto: "Recibe tus productos en la puerta de tu casa en tiempo record",
  },
  {
    id: 3,
    icono: "💬",
    titulo: "Asesoria Profesional",
    texto: "Farmaceuticos expertos disponibles para orientarte en tus consultas",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <span className={styles.leaf}>🍃</span>
          <span>FarmaciaR</span>
        </div>

        <nav className={styles.menu}>
          <button onClick={() => navigate("/")}>Inicio</button>
        </nav>

        <div className={styles.actions}>
          <Link to="/login" className={styles.loginBtn}>
            Iniciar sesion
          </Link>
          <Link to="/registro" className={styles.registerBtn}>
            Registrarse
          </Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.overlay} />
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <h1>
              Tu Salud en las
              <br />
              <span>Mejores Manos</span>
            </h1>

            <p>
              Encuentra todo lo que necesitas para tu bienestar: medicamentos, vitaminas y cuidado personal con la mejor atencion y entrega a domicilio.
            </p>

            <div className={styles.ctaRow}>
              <Link to="/registro" className={styles.primaryBtn}>
                REGISTRATE AHORA
              </Link>
              <Link to="/login" className={styles.secondaryBtn}>
                BIENVENIDO DE VUELTA
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.why}>
        <h2>¿Por que elegir FarmaciaR?</h2>
        <p>
          Tu salud es nuestra prioridad. Ofrecemos el mejor servicio farmaceutico con productos certificados y entrega rapida.
        </p>

        <div className={styles.featuresGrid}>
          {ventajas.map((item, idx) => (
            <article key={item.id} className={styles.featureCard}>
              <div className={`${styles.iconWrap} ${styles[`tone${idx + 1}`]}`}>
                <span>{item.icono}</span>
              </div>
              <h3>{item.titulo}</h3>
              <p>{item.texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.bottomCta}>
        <h2>Comienza a cuidar tu salud hoy</h2>
        <p>Unete a miles de personas que confian en FarmaciaR para su bienestar</p>

        <div className={styles.bottomCtaActions}>
          <Link to="/registro" className={styles.bottomPrimary}>
            Crear cuenta gratis
          </Link>
          <Link to="/login" className={styles.bottomSecondary}>
            Ya tengo cuenta
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <h3>🍃 FarmaciaR</h3>
            <p>Tu salud es nuestra prioridad. Productos de calidad con entrega a domicilio.</p>
          </div>

          <div className={styles.footerContact}>
            <h4>Contacto</h4>
            <p>Email: contacto@farmaciar.com</p>
            <p>Telefono: +1 (555) 123-4567</p>
            <p>Horario: Lun - Sab, 8:00 AM - 8:00 PM</p>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span>© 2026 FarmaciaR. Todos los derechos reservados.</span>
        </div>
      </footer>
    </div>
  );
}