import React from 'react';

// Define the Image type
interface Image {
  id: string;
  url: string;
  caption: string | null;
  tags: string[];
}

// Update the props to accept the click handler
interface ImageCardProps {
  image: Image;
  onImageClick: (image: Image) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onImageClick }) => {

  // !! PLACEHOLDER: This will be fixed in Part 3
  const BACKEND_URL = 'https://clonefest-week-2.onrender.com'; 
  const imageUrl = `${BACKEND_URL}${image.url}`;

  return (
    // Add the onClick handler to the whole div to make it clickable
    <div className="image-card" onClick={() => onImageClick(image)} style={{ cursor: 'pointer' }}>
      
      <img src={imageUrl} alt={image.caption || ''} style={{ maxWidth: '300px' }} />
      
      <div className="image-card-body">
        <p>{image.caption || 'No caption'}</p>
        
        <div className="tags-container">
          {image.tags && image.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageCard;