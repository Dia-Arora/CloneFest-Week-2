import { Link } from 'react-router-dom';

const HomePage = () => {
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    textAlign: 'center',
    padding: '20px', // Added some padding for smaller screens
    backgroundColor: 'var(--background-color)', 
  };

  const textStyles: React.CSSProperties = {
    color: 'var(--text-color)',
  };

  const getStartedButtonStyles: React.CSSProperties = {
    marginRight: '15px',
    padding: '10px 20px',
    background: 'var(--primary-color)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    border: 'none',
  };

  const loginButtonStyles: React.CSSProperties = {
    padding: '10px 20px',
    background: 'transparent',
    border: '1px solid var(--border-color)',
    color: 'var(--text-color)',
    textDecoration: 'none',
    borderRadius: '5px',
  };

  // Styles for the video container
  const videoContainerStyles: React.CSSProperties = {
    marginTop: '50px',
    maxWidth: '896px', // A standard 16:9 aspect ratio width
    width: '100%',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
    borderRadius: '8px',
    overflow: 'hidden', // Ensures the iframe corners are rounded
    aspectRatio: '16 / 9', // Modern CSS to maintain aspect ratio
  };
  
  const iframeStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    border: 'none',
  };


  return (
    <div style={containerStyles}>
      <h1 style={textStyles}>Welcome to ImageMagicks ✨</h1>
      <p style={textStyles}>Your intelligent photo library, powered by AI.</p>
      <nav style={{ marginTop: '20px' }}>
        <Link to="/signup" style={getStartedButtonStyles}>
          Get Started
        </Link>
        <Link to="/login" style={loginButtonStyles}>
          Login
        </Link>
      </nav>

      {/* --- VIDEO DEMO SECTION --- */}
      <div style={videoContainerStyles}>
        <iframe 
          style={iframeStyles}
          src="https://www.youtube.com/embed/NwjiwnTkEyk" 
          title="ImageMagicks Demo Video" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowFullScreen>
        </iframe>
      </div>
      {/* --- END VIDEO DEMO SECTION --- */}
      
    </div>
  );
};

export default HomePage;