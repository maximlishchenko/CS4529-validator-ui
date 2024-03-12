import React from 'react';

interface ValidationResultTableProps {
  response: string;
}

const ValidationResultTable: React.FC<ValidationResultTableProps> = ({ response }) => {
  const validationResults = JSON.parse(response);

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

export default ValidationResultTable;
