import React from 'react';
import { useNavigate } from 'react-router-dom';
import UploadForm from '../components/UploadForm';
import DashboardLayout from '../layouts/DashboardLayout'; // Using your main layout

const UploadPage: React.FC = () => {
  const navigate = useNavigate();

  // This is the function the UploadForm needs
  const handleUploadSuccess = () => {
    // After the upload is done, just go back to the dashboard.
    // The dashboard will reload, run its useEffect, and fetch the new image list.
    navigate('/dashboard');
  };

  return (
    <DashboardLayout>
      <h2>Upload a New Image</h2>
      <p>Select a file and add a caption to add it to the gallery.</p>
      <UploadForm onUploadSuccess={handleUploadSuccess} />
    </DashboardLayout>
  );
};

export default UploadPage;