import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '../../Firebase/config.ts'
import { getAuthErrorMessage } from '../../Firebase/authErrors'
import 'bootstrap/dist/css/bootstrap.min.css'

function RegisterPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: userCredential.user.email,
        createdAt: serverTimestamp(),
      })
      navigate('/login', { state: { registered: true } })
    } catch (authError: any) {
      setError(getAuthErrorMessage(authError?.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page min-vh-100 d-flex align-items-center" style={{
      backgroundImage: 'url("/bgLg.jpeg")',
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
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        zIndex: 1
      }}></div>

      <div className="container position-relative z-2">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card border-0 shadow-lg p-4" style={{ 
              borderRadius: '24px', 
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(15px)',
              WebkitBackdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <div className="text-center mb-4">
                <Link to="/">
                  <img src="/Logo.svg" alt="Logo" style={{ height: '80px', filter: 'brightness(0)', marginBottom: '20px' }} />
                </Link>
                <br />
                <span className="badge px-3 py-2 mb-3" style={{ backgroundColor: '#004d3d', color: '#fff', borderRadius: '50px' }}>
                  Droguería EDA
                </span>
                <h2 className="fw-bold mb-1" style={{ color: '#004d3d' }}>Crear cuenta</h2>
                <p className="text-muted small">Regístrate para gestionar tus compras.</p>
              </div>

              {error ? <div className="alert alert-danger py-2 text-center small mb-3" role="alert">{error}</div> : null}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-dark mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-control px-3 py-2"
                    style={{ borderRadius: '12px', border: '1px solid #dee2e6' }}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="tu@correo.com"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-dark mb-1">Contraseña</label>
                  <input
                    type="password"
                    className="form-control px-3 py-2"
                    style={{ borderRadius: '12px', border: '1px solid #dee2e6' }}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-dark mb-1">Confirmar Contraseña</label>
                  <input
                    type="password"
                    className="form-control px-3 py-2"
                    style={{ borderRadius: '12px', border: '1px solid #dee2e6' }}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Repite la contraseña"
                    minLength={6}
                    required
                    disabled={loading}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 py-2 fw-bold mb-3" 
                  disabled={loading}
                  style={{ 
                    backgroundColor: '#00b11e', 
                    borderColor: '#00b11e',
                    borderRadius: '50px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  ) : null}
                  {loading ? 'Registrando...' : 'Crear cuenta'}
                </button>
              </form>

              <div className="text-center mt-2">
                <p className="small text-muted mb-0">
                  ¿Ya tienes cuenta? <Link to="/login" className="fw-bold text-decoration-none" style={{ color: '#004d3d' }}>Inicia sesión</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .btn-primary:hover {
          background-color: #008a17 !important;
          border-color: #008a17 !important;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 177, 30, 0.3);
        }
        .form-control:focus {
          border-color: #00b11e;
          box-shadow: 0 0 0 0.25rem rgba(0, 177, 30, 0.25);
        }
      `}</style>
    </div>
  )
}

export default RegisterPage
