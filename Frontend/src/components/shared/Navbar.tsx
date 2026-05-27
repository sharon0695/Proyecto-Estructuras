import { useNavigate } from "react-router-dom";
import { auth } from "../../Firebase/config";
import { signOut } from "firebase/auth";
import { useAuth } from "../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm py-2 px-4">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <button 
          className="navbar-brand fw-bold d-flex align-items-center gap-2 border-0 bg-transparent text-white"
          onClick={() => navigate('/admin')}
        >
          <span style={{ fontSize: "1.3rem" }}>🛡️</span>
          <span>FarmaApp <span className="badge bg-danger fs-6 py-1 px-2.5 ms-1">Admin</span></span>
        </button>

        <div className="d-flex align-items-center gap-3">
          <span className="text-white-50 small d-none d-md-inline">
            Conectado como: <strong>{user?.email}</strong>
          </span>
          <button 
            className="btn btn-outline-light btn-sm rounded-pill px-3"
            onClick={() => navigate('/Home')}
          >
            Volver al catálogo
          </button>
          <button 
            className="btn btn-danger btn-sm rounded-pill px-3"
            onClick={() => {
              signOut(auth).then(() => {
                navigate('/Login');
              });
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}

