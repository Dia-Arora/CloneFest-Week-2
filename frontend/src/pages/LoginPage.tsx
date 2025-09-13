import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // 1. Call your LIVE backend login API (this is our hybrid route)
      const response = await fetch('https://clonefest-week-2.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to log in');
      }
      
      // 2. SUCCESS! The backend sent us a token. Save it.
      // This key 'token' MUST match what we use in our other files.
      localStorage.setItem('token', data.token);

      // 3. Navigate to the dashboard as a logged-in user.
      navigate('/dashboard');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Login to Your Account</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Username</label> <br/>
          <input 
            type="text" // This can be 'text' or 'email', but not 'password'
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Password</label> <br/>
          <input 
            type="password" // <-- THIS IS THE FIX for your "@" symbol bug
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '10px' }}>
          {isLoading ? 'Logging In...' : 'Login'}
        </button>
        
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      </form>
      
      <p style={{ marginTop: '1rem' }}>
        Don't have an account? <Link to="/signup">Create One</Link>
      </p>
    </div>
  );
};

export default LoginPage;