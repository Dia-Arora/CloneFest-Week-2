import React, { useState } from 'react';

// Define the Image type
interface Image {
  id: string;
  url: string;
  caption: string | null;
  tags: string[];
}

// Define the props our modal will receive from DashboardPage
interface ImageModalProps {
  image: Image | null; // The image to show, or null if closed
  onClose: () => void; // Function to call when we want to close
  onDelete: (deletedImageId: string) => void; // Function to call after a successful delete
}

const ImageModal: React.FC<ImageModalProps> = ({ image, onClose, onDelete }) => {
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // If no image is selected, render nothing.
  if (!image) {
    return null;
  }

  // !! PLACEHOLDER: This will be fixed in Part 3
  const BACKEND_URL = 'https://clonefest-week-2.onrender.com';
  const imageUrl = `${BACKEND_URL}${image.url}`;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this image? This cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      // !! PLACEHOLDER: This will be fixed in Part 3
      const token = localStorage.getItem('token'); 
      if (!token) throw new Error('No auth token found');

      const response = await fetch(`${BACKEND_URL}/api/images/${image.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to delete');
      }

      // SUCCESS! Call the onDelete prop from DashboardPage
      onDelete(image.id);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // This is the modal backdrop. Clicking it calls the onClose prop.
  return (
    <div style={styles.backdrop} onClick={onClose}>
      
      {/* This stops clicking the modal content from closing it */}
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        
        <img src={imageUrl} alt={image.caption || ''} style={styles.modalImage} />
        <p>{image.caption}</p>
        
        {/* The Delete Button */}
        <button 
          style={styles.deleteButton} 
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>

        {/* The "Close" button */}
        <button style={styles.closeButton} onClick={onClose}>&times;</button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

// --- Basic styling for the modal. You should move this to your CSS file. ---
const styles: { [key: string]: React.CSSProperties } = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    color: '#000',
    padding: '20px',
    borderRadius: '8px',
    position: 'relative',
    maxWidth: '90vw',
    maxHeight: '90vh',
    textAlign: 'center'
  },
  modalImage: {
    maxWidth: '100%',
    maxHeight: 'calc(90vh - 150px)',
    display: 'block',
    margin: '0 auto',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: '#eee',
    color: '#000',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    lineHeight: '30px',
  },
  deleteButton: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    background: '#ff4d4d',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};

export default ImageModal;