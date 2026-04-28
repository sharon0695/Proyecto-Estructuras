import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../Firebase/config.ts'
import { getAuthErrorMessage } from '../Firebase/authErrors'

function LoginPage() {
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const registered = (location.state as { registered?: boolean } | null)?.registered

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      setSuccess('Sesión iniciada. ¡Bienvenido a la droguería!')
    } catch (authError: any) {
      setError(getAuthErrorMessage(authError?.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page-shell">
      <section className="card">
        <div className="card-badge">Droguería EDA</div>
        <h1>Iniciar sesión</h1>
        <p className="subtitle">Accede con tu correo para continuar en la droguería.</p>

        {registered && !success && !error ? (
          <div className="notice success">Cuenta creada correctamente. Inicia sesión.</div>
        ) : null}

        {success ? <div className="notice success">{success}</div> : null}
        {error ? <div className="notice error">{error}</div> : null}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Correo
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tu@correo.com"
              required
              disabled={loading}
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="********"
              required
              disabled={loading}
            />
          </label>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Cargando...' : 'Ingresar'}
          </button>
        </form>

        <div className="footer-line">
          <Link to="/registro">Crear cuenta</Link>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
