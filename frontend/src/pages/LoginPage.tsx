import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  // State for username, password, and any login errors
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // This function now handles the full login process
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Get the backend URL from the environment variable
      const apiUrl = import.meta.env.VITE_API_URL;

      // Call the login endpoint on your backend
      const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If the server responds with an error, display it
        throw new Error(data.error || 'Login failed');
      }

      // If login is successful, save the token and navigate
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        navigate('/dashboard');
      }
      
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Link to="/">&larr; Back to Home</Link>
      <div style={{ maxWidth: '400px', margin: '50px auto' }}>
        <h2>Login to ImageMagicks</h2>
        <form onSubmit={handleLogin}>
          {/* --- This input is now for USERNAME, not email --- */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="username">Username</label><br />
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
              required
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="password">Password</label><br />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
              required
            />
          </div>

          {/* Display error message if there is one */}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button 
            type="submit" 
            style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none' }}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;