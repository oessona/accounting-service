'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './register.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    // Frontend validation: Check if passwords match
    if (password !== passwordConfirmation) {
      setError("Passwords don't match.");
      setIsLoading(false);
      return;
    }

    // Your Laravel backend's register endpoint
    const apiUrl = 'http://127.0.0.1:8000/api/register';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors from Laravel
        const serverError = data.message || (data.errors ? Object.values(data.errors).flat().join(' ') : 'Registration failed');
        setError(serverError);
        throw new Error(serverError);
      }

      // --- REGISTRATION SUCCESSFUL ---
      console.log('Registration successful:', data);
      
      // Save the token to automatically log the user in
      localStorage.setItem('auth_token', data.token);

      // Redirect to the dashboard
      router.push('/dashboard'); 

    } catch (err) {
      console.error('Registration failed:', err);
      if (!error) {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.register__body}>
        <h1 className={styles.register__title}>Signup</h1>
        <form className={styles.register__form} onSubmit={handleSubmit}>
          <input
            className={styles.register__input}
            type="text"
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
          <input
            className={styles.register__input}
            type="email"
            placeholder="Enter your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <input
            className={`${styles.register__input} ${error?.includes('password') ? styles['register__input--error'] : ''}`}
            type="password"
            placeholder="Create a password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <input
            className={`${styles.register__input} ${error?.includes('password') ? styles['register__input--error'] : ''}`}
            type="password"
            placeholder="Confirm your password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            disabled={isLoading}
          />
          
          <button className={styles.register__button} type="submit" disabled={isLoading}>
            {isLoading ? 'Signing up...' : 'Signup'}
          </button>

          {/* Display API error message below the button */}
          {error && <p className={styles.register__error_visible}>{error}</p>}
        </form>
        <p className={styles.register__helper}>
          Already have an account?
          <a className={styles.register__login} href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
}