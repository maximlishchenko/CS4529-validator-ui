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
        onTraceUpload('Uploaded file is empty, try again.');
      } else if (responseData.message === 'Only .json files are accepted') {
        // Case 4: Wrong file format
        onTraceUpload('Only JSON files are accepted, try again.')
      } else if (responseData.message === 'Error parsing the file') {
        // Case 5: Syntax errors present
        onTraceUpload('Error parsing the file, try again.')
      } else {
        onTraceUpload('An unexpected error occurred.');
      }
    } catch (error) {
      onTraceUpload('An unexpected error occurred.');
    }
  };

  return (
    <div className='trace-uploader'>
      <h3>Upload and validate your trace (JSON-LD):</h3>
      <input className='file-input-name' type="file" onChange={handleFileChange} />
      <button className='upload-button' onClick={handleUpload}>Upload and Validate</button>
    </div>
  );
};

export default TraceUploader;
