'use client'; // This is required for components that use hooks

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation'; // For redirecting after login
import styles from './login.module.css'; // Import the CSS module

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent page reload
    setIsLoading(true);
    setError(null); // Reset error on new submission

    // Your Laravel backend is likely running on http://127.0.0.1:8000
    // The endpoint is /api/login from your api.php
    const apiUrl = 'http://127.0.0.1:8000/api/login';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors or other server errors
        // Laravel's default validation exception sends errors in `data.errors`
        const errorMessage = data.message || 'Invalid credentials';
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      // --- LOGIN SUCCESSFUL ---
      console.log('Login successful:', data);
      
      // Store the token for future authenticated requests
      // localStorage is a simple way, but for production consider secure alternatives
      localStorage.setItem('auth_token', data.token);

      // Redirect to a dashboard or home page
      router.push('/dashboard'); // Change '/dashboard' to your desired route

    } catch (err) {
      console.error('Login failed:', err);
      // The error state is already set if it was a response error
      if (!error) {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}> {/* Added a container for centering */}
      <div className={styles.login__body}>
        <h1 className={styles.login__title}>Login</h1>
        <form className={styles.login__form} onSubmit={handleSubmit}>
          <input
            className={`${styles.login__input} ${error ? styles['login__input--error'] : ''}`}
            type="email"
            placeholder="Enter your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <input
            className={`${styles.login__input} ${error ? styles['login__input--error'] : ''}`}
            type="password"
            placeholder="Enter your password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          {/* Display API error message */}
          {error && <p className={styles.login__error_visible}>{error}</p>}
          
          <button className={styles.login__button} type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className={styles.login__helper}>
          Don't have an account? <a className={styles.login__signup} href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
}