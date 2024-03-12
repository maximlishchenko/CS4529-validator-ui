import React, { useState } from 'react';

interface TraceUploaderProps {
  onTraceUpload: (response: string | null) => void;
}

const TraceUploader: React.FC<TraceUploaderProps> = ({ onTraceUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      onTraceUpload('Please upload a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:8080/upload-and-validate', {
        method: 'POST',
        body: formData
      });
      const responseData = await response.json();

      if (Array.isArray(responseData) && responseData.length > 0) {
        // Case 1: array of validation results
        onTraceUpload(JSON.stringify(responseData));
      } else if (Array.isArray(responseData) && responseData.length === 0) {
        // Case 2: empty array
        onTraceUpload('No constraints were violated.');
      } else if (responseData.message === 'Uploaded file is empty') {
        // Case 3: Uploaded file is empty
        onTraceUpload('Uploaded file is empty.');
      } else {
        onTraceUpload('An unexpected error occurred.');
      }
    } catch (error) {
      onTraceUpload('An unexpected error occurred.');
    }
  };

  return (
    <div>
      <h3>Upload and Validate a trace (JSON-LD)</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload and Validate</button>
    </div>
  );
};

export default TraceUploader;
