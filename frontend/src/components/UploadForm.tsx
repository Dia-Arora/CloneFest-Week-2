import React, { useState } from 'react';

// This component now accepts a prop from its parent (DashboardPage)
interface UploadFormProps {
  onUploadSuccess: (newImage: any) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUploadSuccess }) => {
  // Use state to control the form fields
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // This function now handles the API call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('caption', caption);

    try {
      // !! PLACEHOLDER: This will be fixed in Part 3
      const token = localStorage.getItem('token'); 
      if (!token) {
         throw new Error('No auth token found. Please log in.');
      }

      // !! PLACEHOLDER: This will be fixed in Part 3
      const response = await fetch('https://clonefest-week-2.onrender.com/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Upload failed');
      }

      const newImage = await response.json(); 

      // THIS IS THE FIX: Call the function from the parent (DashboardPage)
      onUploadSuccess(newImage);

      // Clear the form
      setFile(null);
      setCaption('');
      (e.target as HTMLFormElement).reset(); // Resets the file input

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsUploading(false);
    }
  };

  // The JSX is now hooked up to our state and handlers
  return (
    <form style={{ maxWidth: '500px' }} onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="imageFile">Select Image</label><br/>
        <input 
          type="file" 
          id="imageFile" 
          onChange={handleFileChange}
          required 
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="caption">Caption (Optional)</label><br/>
        <input 
          type="text" 
          id="caption" 
          style={{ width: '100%', padding: '8px' }}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
      </div>
      <button type="submit" disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
};

export default UploadForm;