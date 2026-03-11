import { useState, useRef } from 'react';
import './LoginScreen.css';

/**
 * LoginScreen component
 *
 * Renders a login form with username and password fields.
 * Handles client-side validation, loading state, and success/error feedback.
 *
 * @param {Object}   props
 * @param {Function} [props.onSubmit]  - Called with { username, password } on valid submit
 * @param {Function} [props.onSuccess] - Called after a successful authentication
 * @param {Function} [props.onError]   - Called with an error message when authentication fails
 */
function LoginScreen({ onSubmit, onSuccess, onError }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  /** Validates required fields. Returns true when valid. */
  function validateForm() {
    if (!username.trim()) {
      setError('Por favor, preencha o nome de usuário');
      usernameRef.current?.focus();
      return false;
    }

    if (!password.trim()) {
      setError('Por favor, preencha a senha');
      passwordRef.current?.focus();
      return false;
    }

    setError(null);
    return true;
  }

  /** Resets every field and state to their initial values. */
  function resetForm() {
    setUsername('');
    setPassword('');
    setError(null);
    setSuccess(false);
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      if (typeof onSubmit === 'function') {
        await onSubmit({ username, password });
      } else {
        // Default mock: simulate a 1-second network round-trip
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setSuccess(true);
      if (typeof onSuccess === 'function') {
        onSuccess();
      }
    } catch (err) {
      const message =
        err?.message || 'Erro ao autenticar. Tente novamente.';
      setError(message);
      if (typeof onError === 'function') {
        onError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-container">
        <h1 className="login-title">Login</h1>

        {/* Error message */}
        {error && (
          <div
            className="login-message login-message--error"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        {/* Success message */}
        {success && (
          <div
            className="login-message login-message--success"
            role="status"
            aria-live="polite"
          >
            Login realizado com sucesso!
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Username field */}
          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <input
              ref={usernameRef}
              id="username"
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              disabled={loading}
              autoComplete="username"
              aria-required="true"
              aria-invalid={
                error && !username.trim() ? 'true' : 'false'
              }
            />
          </div>

          {/* Password field */}
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              ref={passwordRef}
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              disabled={loading}
              autoComplete="current-password"
              aria-required="true"
              aria-invalid={
                error && !password.trim() ? 'true' : 'false'
              }
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="submit-button"
            disabled={loading || !username || !password}
            style={loading ? { cursor: 'wait' } : undefined}
          >
            {loading ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>

        {/* Reset link – useful for manual testing and future flows */}
        {(username || password || error || success) && !loading && (
          <button
            type="button"
            className="reset-button"
            onClick={resetForm}
          >
            Limpar
          </button>
        )}
      </div>
    </div>
  );
}

export default LoginScreen;
