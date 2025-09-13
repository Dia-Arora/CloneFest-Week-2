import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // This is correct: logout should send the user to the homepage.
    navigate('/');
  };

  const navStyles: React.CSSProperties = {
    width: '240px',
    minHeight: '100vh', 
    background: 'var(--secondary-bg-color)',
    padding: '20px',
    borderRight: '1px solid var(--border-color)',
    display: 'flex', 
    flexDirection: 'column', 
  };

  const linkStyles: React.CSSProperties = {
    textDecoration: 'none',
    color: 'var(--text-color)', 
    marginBottom: '20px',
    fontSize: '1.1em',
    padding: '8px',
    borderRadius: '5px',
  };

  const logoutButtonStyles: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    border: '1px solid var(--border-color)',
    borderRadius: '5px',
    cursor: 'pointer',
    background: 'transparent',
    color: 'var(--text-color)',
    textAlign: 'center',
    marginTop: 'auto', // This pushes the button to the bottom
  };

  return (
    <nav style={navStyles}>
      <h3 style={{ marginBottom: '30px' }}>ImageMagicks</h3>
      <input 
        type="search" 
        placeholder="Vector search..." 
        style={{ width: '100%', padding: '8px', marginBottom: '30px' }}
      />
      <Link to="/dashboard" style={linkStyles}>Gallery</Link>
      
      {/* --- THIS IS THE FIX --- */}
      {/* Changed "/albums" to "/dashboard" to prevent the routing error */}
      <Link to="/dashboard" style={linkStyles}>Albums</Link>
      {/* --- END OF FIX --- */}

      <Link to="/upload" style={linkStyles}>Upload</Link>

      <button onClick={handleLogout} style={logoutButtonStyles}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;