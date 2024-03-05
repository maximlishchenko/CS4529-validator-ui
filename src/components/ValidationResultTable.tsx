import React from 'react';

interface ValidationResultTableProps {
  response: string;
}

const ValidationResultTable: React.FC<ValidationResultTableProps> = ({ response }) => {
    console.log(response);
  const validationResults = JSON.parse(response);

  return (
    <table>
      <thead>
        <tr>
          <th>Focus Node</th>
          <th>Result Message</th>
          <th>Result Severity</th>
          <th>Result Path</th>
        </tr>
      </thead>
      <tbody>
        {validationResults.map((result: any, index: number) => (
          <tr key={index}>
            <td>{result.focusNode}</td>
            <td>{result.resultMessage}</td>
            <td>{result.resultSeverity}</td>
            <td>{result.resultPath}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ValidationResultTable;
