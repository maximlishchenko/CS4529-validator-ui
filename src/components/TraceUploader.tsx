import React, { useState } from 'react';

interface TraceUploaderProps {
  onTraceUpload: (response: string | null) => void; // callback function
}

const TraceUploader: React.FC<TraceUploaderProps> = ({ onTraceUpload }) => {

  // this state represent the uploaded file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // function to set state to uploaded file name
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  // function to handle upload and validation
  const handleUpload = async () => {
    // ensure state contains a file
    if (!selectedFile) {
      onTraceUpload('Please upload a file');
      return;
    }

    // create form data to be sent as payload
    const formData = new FormData();
    // append the uploaded file as part of the form data
    formData.append('file', selectedFile);

    try {
      // send request to backend
      const response = await fetch('http://localhost:8080/upload-and-validate', {
        method: 'POST',
        body: formData
      });
      // convert to json
      const responseData = await response.json();

      if (Array.isArray(responseData) && responseData.length > 0) {
        // case 1: array of validation results
        onTraceUpload(JSON.stringify(responseData));
      } else if (Array.isArray(responseData) && responseData.length === 0) {
        // case 2: empty array which means no violations present
        onTraceUpload('No constraints were violated.');
      } else if (responseData.message === 'Uploaded file is empty') {
        // case 3: uploaded file is empty
        onTraceUpload('Uploaded file is empty, try again.');
      } else if (responseData.message === 'Only .json files are accepted') {
        // case 4: wrong file format
        onTraceUpload('Only JSON files are accepted, try again.')
      } else if (responseData.message === 'Error parsing the file') {
        // case 5: syntax errors present in json file
        onTraceUpload('Error parsing the file, try again.')
      } else {
        // unexpected error occurred
        onTraceUpload('An unexpected error occurred.');
      }
    } catch (error) {
      onTraceUpload('An unexpected error occurred.');
    }
  };

  // present necessary HTML elements and attach the functionality to them
  return (
    <div className='trace-uploader'>
      <h3>Upload and validate your trace (JSON-LD):</h3>
      <input className='file-input-name' type="file" onChange={handleFileChange} />
      <button className='upload-button' onClick={handleUpload}>Upload and Validate</button>
    </div>
  );
};

// export component so it's accessible in App.tsx
export default TraceUploader;
