import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const HeroPage: React.FC = () => {
  return (
    <div className="hero-section min-vh-100 d-flex align-items-center" style={{
      backgroundImage: 'url("/bg.jpeg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative'
    }}>
      {/* Overlay to improve text readability */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.4)', // Subtle white overlay
        zIndex: 1
      }}></div>

      {/* Header with Logo */}
      <div className="position-absolute top-0 w-100 p-4" style={{ zIndex: 3 }}>
        <div className="container d-flex justify-content-start">
          <img src="/Logo.svg" alt="Logo" style={{ height: '200px', filter: 'opacity(0.5) brightness(0.2)' }} />
        </div>
      </div>

      <div className="container position-relative z-2">
        <div className="row">
          <div className="col-lg-6 text-start">
            <h1 className="display-1 fw-bold mb-3" style={{ color: '#004d3d', lineHeight: '1', letterSpacing: '-2px' }}>
              Tu Salud en las <br />
              <span style={{ color: '#00b11e', fontFamily: '"Playfair Display", serif', fontWeight: 700 }}>Mejores Manos</span>
            </h1>
            <p className="mb-5 text-dark" style={{ maxWidth: '450px', opacity: 0.8, fontSize: '1rem' }}>
              Encuentra todo lo que necesitas para tu bienestar: medicamentos, vitaminas y cuidado personal con la mejor atención y entrega a domicilio.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/registro" className="btn btn-primary btn-lg px-5 py-3 fw-bold border-0" style={{ 
                backgroundColor: '#00b11e', 
                borderRadius: '50px',
                transition: 'all 0.3s ease'
              }}>
                ¡Regístrate hoy!
              </Link>
              <Link to="/login" className="btn btn-outline-dark btn-lg px-5 py-3 fw-bold" style={{ 
                borderRadius: '50px',
                borderWidth: '2px'
              }}>
                bienvenido de vuelta
              </Link>
            </div>
          </div>
          
          {/* Right side could have some floating elements like the reference image */}
          <div className="col-lg-6 d-none d-lg-block">
             {/* Decorative element could go here */}
          </div>
        </div>
      </div>

      {/* Positive Words Carousel */}
      <div className="positive-words-carousel position-absolute bottom-0 w-100 py-4" style={{ 
        zIndex: 2, 
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(5px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        overflow: 'hidden'
      }}>
        <div className="marquee-content d-flex align-items-center">
          {[...words, ...words].map((item, index) => (
            <span key={index} className="mx-4" style={{ 
              fontFamily: item.font,
              fontSize: '1.5rem',
              color: '#004d3d',
              whiteSpace: 'nowrap',
              opacity: 0.8
            }}>
              {item.text}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .btn-primary:hover {
          background-color: #008a17 !important;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 177, 30, 0.2);
        }
        .btn-outline-dark:hover {
          background-color: #004d3d;
          border-color: #004d3d;
          color: white;
          transform: translateY(-2px);
        }
        
        .marquee-content {
          animation: marquee 40s linear infinite;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @media (max-width: 991.98px) {
          .hero-section {
            text-align: center;
          }
          .col-lg-6 {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .text-start {
            text-align: center !important;
          }
          .d-flex {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

const words = [
  { text: "Salud", font: "Serif" },
  { text: "Bienestar", font: "Sans-serif" },
  { text: "Vitalidad", font: "Cursive" },
  { text: "Cuidado", font: "Monospace" },
  { text: "Confianza", font: "Fantasy" },
  { text: "Energía", font: "Arial" },
  { text: "Vida", font: "Georgia" },
  { text: "Armonía", font: "Impact" },
  { text: "Felicidad", font: "Verdana" },
  { text: "Calidad", font: "Times New Roman" },
  { text: "Esperanza", font: "Courier New" },
  { text: "Equilibrio", font: "Comic Sans MS" },
  { text: "Protección", font: "Trebuchet MS" },
  { text: "Serenidad", font: "Arial Black" },
  { text: "Fuerza", font: "Palatino" },
  { text: "Renovación", font: "Garamond" },
  { text: "Paz", font: "Bookman" },
  { text: "Alegría", font: "Helvetica" },
  { text: "Amor", font: "Optima" },
  { text: "Pureza", font: "Baskerville" },
  { text: "Ánimo", font: "Futura" },
  { text: "Bondad", font: "Copperplate" },
];

export default HeroPage;
