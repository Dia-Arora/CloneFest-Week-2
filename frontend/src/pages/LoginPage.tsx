import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle authentication here.
    // For the hackathon, we'll just navigate to the dashboard.
    console.log('Logging in...');
    navigate('/dashboard');
  };

  return (
    <div style={{ padding: '20px' }}>
      <Link to="/">&larr; Back to Home</Link>
      <div style={{ maxWidth: '400px', margin: '50px auto' }}>
        <h2>Login to ImageMagicks</h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email">Email</label><br />
            <input type="email" id="email" style={{ width: '100%', padding: '8px' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="password">Password</label><br />
            <input type="password" id="password" style={{ width: '100%', padding: '8px' }} />
          </div>
          <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none' }}>
            Login
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