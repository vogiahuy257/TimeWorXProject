import React from 'react';
import { IconFileSelection } from './icon-file-selection';

const FileSelection = ({ files, selectedFiles, onChange }) => {

  const handleDivClick = (fileId) => {
    // Find the checkbox input for the file
    const checkbox = document.getElementById(fileId);
    if (checkbox) {
      // Simulate a click on the checkbox
      checkbox.checked = !checkbox.checked;
      onChange({ target: checkbox });
    }
  };

  return (
    <div>
      <span className="text-sm font-medium mb-2">
        Select Files to Include in ZIP
      </span>
      <div className="space-y-4 p-2">
        {files.map((file) => (
          <div key={file.id} className="flex items-center rounded-md shadow-md p-4 cursor-pointer" onClick={() => handleDivClick(file.id)}>
            <input
              type="checkbox"
              id={file.id}
              name="selectedFiles"
              value={file.id}
              checked={selectedFiles.includes(file.id)}
              className="h-4 w-4 mr-2 custom-checkbox cursor-pointer text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              onChange={onChange}
            />
            <IconFileSelection filetype={file.type}/>
            <label className=" ml-1 text-sm cursor-pointer">
              {file.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileSelection;
