import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '../../Firebase/config.ts'
import { getAuthErrorMessage } from '../../Firebase/authErrors'

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
    <main className="page-shell">
      <section className="card">
        <div className="card-badge">Droguería EDA</div>
        <h1>Crear cuenta</h1>
        <p className="subtitle">Regístrate para gestionar tus envíos y compras en la droguería.</p>

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
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              required
              disabled={loading}
            />
          </label>

          <label>
            Confirmar contraseña
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Repite la contraseña"
              minLength={6}
              required
              disabled={loading}
            />
          </label>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="footer-line">
          <Link to="/login">Iniciar sesión</Link>
        </div>
      </section>
    </main>
  )
}

export default RegisterPage
