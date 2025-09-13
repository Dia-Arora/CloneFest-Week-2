import React from 'react';
import ImageCard from './ImageCard';

// Define the Image type
interface Image {
  id: string;
  url: string;
  caption: string | null;
  tags: string[];
}

// Update the props to accept the click handler
interface ImageGridProps {
  images: Image[];
  onImageClick: (image: Image) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onImageClick }) => {
  
  return (
    <div className="image-grid-container"> 
      
      {images.length === 0 && <p>No images found. Try uploading one!</p>}

      {/* Pass the click handler down to each card */}
      {images.map((image) => (
        <ImageCard 
          key={image.id} 
          image={image} 
          onImageClick={onImageClick}
        />
      ))}
    </div>
  );
};

export default ImageGrid;