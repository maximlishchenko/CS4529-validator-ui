import React, { useState } from 'react';

interface Props {
  endpoint: string; // backend endpoint
  onFileNameChange: (fileName: string | null) => void; // callback function
}

const FileChooser: React.FC<Props> = ({ endpoint, onFileNameChange }) => {
  // define states of the component

  // filenames in the dropdown list, initially empty array
  const [fileNames, setFileNames] = useState<string[]>([]);
  // chosen file name in the input field, initially null
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  // boolean state with status (loading or not, while processing request to server)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // boolean state with status: is dropdown menu open or not
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // function to handle loading files
  const handleClick = async () => {
    // as soon as button clicked, set loading to true
    setIsLoading(true);
    // swap the value of status of dropdown menu (open or not)
    setIsDropdownOpen(!isDropdownOpen);
    try {
      // fetch data from the appropriate endpoint
      const response = await fetch(endpoint);
      // convert to json
      const data = await response.json();
      // set the file names in drop down menu to what is fetched
      setFileNames(data);
    } catch (error) {
      console.error('Error fetching file names:', error);
    } finally {
      // set loading to false, as data is now loaded
      setIsLoading(false);
    }
  };

  // function to handle selected file name
  const handleSelect = (fileName: string) => {
    setSelectedFileName(fileName);
    setIsDropdownOpen(false);
    // invoke callback function to render changes in parent component
    onFileNameChange(fileName);
  };

  // build HTML response
  return (
    <div className="file-chooser">
      <h3>Validate an existing trace:</h3>
      <div className="dropdown">
        <input
          type="text"
          value={selectedFileName || ''}
          placeholder="Choose a trace to validate"
          readOnly
        />
        <button onClick={handleClick} disabled={isLoading}>
          {isLoading ? 'Loading...' : '▼'}
        </button>
        {isDropdownOpen && (
          <div className="dropdown-menu">
            {fileNames.map((fileName) => (
              <div
                key={fileName}
                onClick={() => handleSelect(fileName)}
                className="dropdown-item"
              >
                {fileName}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// export component so it's accessible in App.tsx
export default FileChooser;
