export function getAuthErrorMessage(code: string) {
  switch (code) {
    case 'auth/invalid-email':
      return 'El correo no es válido.'
    case 'auth/user-disabled':
      return 'Esta cuenta ha sido desactivada.'
    case 'auth/user-not-found':
      return 'No existe una cuenta con ese correo.'
    case 'auth/wrong-password':
      return 'Contraseña incorrecta.'
    case 'auth/email-already-in-use':
      return 'Este correo ya está en uso.'
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres.'
    case 'auth/missing-email':
      return 'Ingresa un correo electrónico.'
    default:
      return 'Ocurrió un error. Intenta de nuevo.'
  }
}
