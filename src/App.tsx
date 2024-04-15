import React, { useState } from 'react';
import './App.css';
import Button from './components/Button.tsx';
import ValidationResultTable from './components/ValidationResultTable.tsx';
import FileChooser from './components/FileChooser.tsx';
import TraceUploader from './components/TraceUploader.tsx';

const App: React.FC = () => {
  // create needed states and modifiers for them

  // currently targeted file name that is to be validated, initially null
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  // response from server containing validation result, initially null
  const [response, setResponse] = useState<string | null>(null);
  // string representing message that no violations occurred
  const [noViolationsMessage, setNoViolationsMessage] = useState<string | null>(null);
  // string representing the error message (different)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // function to be given as callback to file chooser component
  const handleSelectedFileNameChange = (fileName: string | null) => {
    setSelectedFileName(fileName)
  }

  // function to handle state logic regarding the response from server
  const handleTraceUpload = (response: string | null) => {
    if (response === 'No constraints were violated.') {
      setResponse(null);
      setNoViolationsMessage(response);
      setErrorMessage(null);
    } else if (response === 'Uploaded file is empty, try again.') {
      setResponse(null);
      setNoViolationsMessage(null);
      setErrorMessage(response);
    } else if (response === 'Only JSON files are accepted, try again.') {
      setResponse(null);
      setNoViolationsMessage(null);
      setErrorMessage(response);
    } else if (response === 'Error parsing the file, try again.') {
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


  // function to handle validation button click
  const handleButtonClick = async (endpoint: string) => {
    try {
      // endpoint represent the endpoint name
      // cardinality, type, or sparql

      // trigger endpoint
      const response = await fetch(`http://localhost:8080/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: selectedFileName
      });
      // convert response to json
      const responseData = await response.json();

      // handle state logic according to response
      if (Array.isArray(responseData) && responseData.length > 0) {
        // case 1: array of validation results
        setResponse(JSON.stringify(responseData));
        setNoViolationsMessage(null);
        setErrorMessage(null);
      } else if (Array.isArray(responseData) && responseData.length === 0) {
        // case 2: empty array
        setNoViolationsMessage('No constraints were violated.');
        setErrorMessage(null);
        setResponse(null);
      } else if (responseData.message === 'File not found') {
        // case 3: file not found
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

  // build the main application using components, attaching needed functionality
  // to the html elements
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
