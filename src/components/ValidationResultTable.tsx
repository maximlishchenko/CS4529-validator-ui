import React from 'react';

interface ValidationResultTableProps {
  response: string;
}

// expect response from server as string
const ValidationResultTable: React.FC<ValidationResultTableProps> = ({ response }) => {

  // ensure correct json format
  const validationResults = JSON.parse(response);

  // build HTML table mapping each of the validation results into rows
  // and each of the fields into appropriate columns
  return (
    <div>
      <h2 className='violations-message'>The following violations were detected:</h2>
      <table className='result-table'>
        <thead>
          <tr className='validation-table-head-row'>
            <th>Focus Node</th>
            <th>Result Message</th>
            <th>Result Severity</th>
            <th>Result Path</th>
          </tr>
        </thead>
        <tbody className='validation-table-body'>
          {validationResults.map((result: any, index: number) => (
            <tr
              className={`validation-table-row ${result.resultSeverity === 'sh:Violation' ? 'violation-row' : result.resultSeverity === 'sh:Warning' ? 'warning-row' : ''}`}
              key={index}
            >
              <td>{result.focusNode}</td>
              <td>{result.resultMessage}</td>
              <td>{result.resultSeverity.substring(3)}</td>
              <td>{result.resultPath}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// export component so it's accessible in App.tsx
export default ValidationResultTable;
