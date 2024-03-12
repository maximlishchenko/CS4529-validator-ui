import React, { useState } from 'react';
import './App.css';
import Button from './components/Button.tsx';
import ValidationResultTable from './components/ValidationResultTable.tsx';
import FileChooser from './components/FileChooser.tsx';
import TraceUploader from './components/TraceUploader.tsx';

const App: React.FC = () => {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [noViolationsMessage, setNoViolationsMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectedFileNameChange = (fileName: string | null) => {
    setSelectedFileName(fileName);
  }

  const handleTraceUpload = (response: string | null) => {
    if (response === 'No constraints were violated.') {
      setResponse(null);
      setNoViolationsMessage(response);
      setErrorMessage(null);
    } else if (response === 'Uploaded file is empty.') {
      setResponse(null);
      setNoViolationsMessage(null);
      setErrorMessage(response);
    } else if (response === 'An unexpected error occurred.') {
      setResponse(null);
      setNoViolationsMessage(null);
      setErrorMessage(response);
    } else {
      setResponse(response);
      setNoViolationsMessage(null);
      setErrorMessage(null);
    }
  }



  const handleButtonClick = async (endpoint: string) => {
    try {
      const response = await fetch(`http://localhost:8080/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: selectedFileName
      });
      const responseData = await response.json();

      if (Array.isArray(responseData) && responseData.length > 0) {
        // Case 1: array of validation results
        setResponse(JSON.stringify(responseData));
        setNoViolationsMessage(null);
        setErrorMessage(null);
      } else if (Array.isArray(responseData) && responseData.length === 0) {
        // Case 2: empty array
        setNoViolationsMessage('No constraints were violated.');
        setErrorMessage(null);
        setResponse(null);
      } else if (responseData.message === 'File not found') {
        // Case 3: file not found
        setErrorMessage('File with such name not found.');
        setResponse(null);
        setNoViolationsMessage(null);
      } else {
        setErrorMessage('An unexpected error occurred.');
        setResponse(null);
        setNoViolationsMessage(null);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An unexpected error occurred.');
      setResponse(null);
      setNoViolationsMessage(null);
    }
  };

  return (
    <div>
      <div className='wrapper'>
        <FileChooser endpoint='http://localhost:8080/get-file-names' onFileNameChange={handleSelectedFileNameChange} />
        <Button onClick={() => handleButtonClick('validate-cardinality')}>
          Validate Cardinality
        </Button>
        <Button onClick={() => handleButtonClick('validate-type')}>
          Validate Type
        </Button>
        <Button onClick={() => handleButtonClick('validate-sparql')}>
          Validate SPARQL
        </Button>
        <TraceUploader onTraceUpload={handleTraceUpload} />
      </div>
      {errorMessage && <h2 className='violations-message'>{errorMessage}</h2>}
      {noViolationsMessage && <h2 className='violations-message'>{noViolationsMessage}</h2>}
      {response && <ValidationResultTable response={response} />}
    </div>
  );
};

export default App;
