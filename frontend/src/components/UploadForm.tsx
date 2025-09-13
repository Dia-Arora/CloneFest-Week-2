import { useState, type FormEvent, type ChangeEvent } from 'react';

const UploadForm = () => {
  // State to hold the selected file
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Handler for when a file is selected
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  // Handler for form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form refresh

    if (!file) {
      alert("Please select a file first!");
      return;
    }

    setIsUploading(true);

    // Get the auth token from localStorage (saved after login)
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert("Authentication error: You are not logged in.");
      setIsUploading(false);
      return;
    }

    // Use FormData to send the file
    const formData = new FormData();
    formData.append('image', file);
    formData.append('caption', caption);

    try {
      // Get the backend URL from environment variables
      const apiUrl = import.meta.env.VITE_API_URL;
      
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        headers: {
          // The 'Authorization' header sends your login token
          'Authorization': `Bearer ${token}`,
        },
        body: formData, // Send the form data
      });

      if (!response.ok) {
        throw new Error('Image upload failed');
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      alert('Image uploaded successfully!');
      
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('An error occurred during the upload.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="imageFile">Select Image</label><br/>
        <input type="file" id="imageFile" onChange={handleFileChange} required />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="caption">Caption (Optional)</label><br/>
        <input 
          type="text" 
          id="caption" 
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      <button type="submit" disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
};

export default UploadForm;