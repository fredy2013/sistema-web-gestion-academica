import { useState } from 'react';
import FormField from '../../components/FormField';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    setMessage('La autenticación se habilitará al integrar el servicio de acceso del backend.');
  };

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <header className="login-header">
          <div className="login-logo" aria-hidden="true">
            GA
          </div>

          <p className="login-brand">SISTEMA DE GESTIÓN ACADÉMICA</p>

          <h1 id="login-title">Bienvenido</h1>

          <p>Ingresa tus credenciales para acceder al sistema.</p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <FormField
            id="username"
            label="Usuario"
            name="username"
            type="text"
            placeholder="Ingresa tu usuario"
            autoComplete="username"
            required
          />

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>

            <div className="password-field">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>

          <button type="submit" className="login-button">
            Iniciar sesión
          </button>
        </form>

        {message && (
          <p className="login-message" role="status">
            {message}
          </p>
        )}

        <footer className="login-footer">Sistema Web Configurable para la Gestión Académica</footer>
      </section>
    </main>
  );
}

export default Login;
