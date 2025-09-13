const UploadForm = () => {
  return (
    <form style={{ maxWidth: '500px' }}>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="imageFile">Select Image</label><br/>
        <input type="file" id="imageFile" required />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="caption">Caption (Optional)</label><br/>
        <input type="text" id="caption" style={{ width: '100%', padding: '8px' }}/>
      </div>
      <button type="submit">Upload</button>
    </form>
  );
};

export default UploadForm;