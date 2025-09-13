import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import ImageGrid from '../components/ImageGrid';
// UploadForm import is now GONE
import ImageModal from '../components/ImageModal';

// This interface should be in its own file (e.g., src/types.ts) but this works.
interface Image {
  id: string;
  url: string;
  caption: string | null; // Matches our schema
  tags: string[];
  // any other fields...
}

const DashboardPage: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  // This tracks which image to show in the modal. If null, the modal is closed.
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  // This function fetches images when the page loads
  const fetchImages = async () => {
    try {
      // This URL is already correct from your previous file
      const response = await fetch('https://clonefest-week-2.onrender.com/api/images'); 
      if (!response.ok) throw new Error('Failed to fetch images');
      const data: Image[] = await response.json();
      setImages(data);
    } catch (error) {
       console.error('Failed to fetch images:', error);
    }
  };

  // Run this once when the component mounts
  useEffect(() => {
    fetchImages();
  }, []);

  // The handleUploadSuccess function is now GONE.

  // This function is passed to the modal to run AFTER a delete is successful
  const handleImageDeleted = (deletedImageId: string) => {
    // Remove the deleted image from the gallery state to update the UI instantly
    setImages((currentImages) =>
      currentImages.filter((img) => img.id !== deletedImageId)
    );
    setSelectedImage(null); // Close the modal
  };

  return (
    <DashboardLayout>
      <h2>Your Gallery</h2>
      
      {/* The UploadForm and the <hr> have been correctly removed from this page. */}
      
      <p>All your uploaded images.</p>
      
      {/* This component gets the image list AND the click handler function */}
      <ImageGrid 
        images={images} 
        onImageClick={(image) => setSelectedImage(image)} 
      />

      {/* This component renders the modal and gets the state/handlers it needs */}
      <ImageModal 
        image={selectedImage} 
        onClose={() => setSelectedImage(null)}
        onDelete={handleImageDeleted}
      />
    </DashboardLayout>
  );
};

export default DashboardPage;