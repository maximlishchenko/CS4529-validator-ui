import React, { useState } from 'react';

interface Props {
  endpoint: string;
}

const FileChooser: React.FC<Props> = ({ endpoint }) => {
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleClick = async () => {
    setIsLoading(true);
    setIsDropdownOpen(!isDropdownOpen);
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      setFileNames(data);
    } catch (error) {
      console.error('Error fetching file names:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (fileName: string) => {
    setSelectedFileName(fileName);
    setIsDropdownOpen(false);
  };

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

  return (
    <div className="file-chooser">
      <div className="dropdown">
        <input
          type="text"
          value={selectedFileName || ''}
          placeholder="Choose a trace to validate"
          readOnly
        //   onClick={toggleDropdown}
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

export default FileChooser;
