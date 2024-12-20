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
    <div className='w-full max-w-3xl mx-auto'>
      <h1 className="text-sm font-medium mb-2">Select Files to Include in ZIP</h1>
      <div className="space-y-2">
        {files.map((file) => (
          <div 
            key={file.id} 
            className={`flex custom-selected-checkbox items-center rounded-lg p-4 cursor-pointer  duration-200 ease-in-out ${
              selectedFiles.includes(file.id)
                ? ' border border-blue-500'
                : ' border border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handleDivClick(file.id)}
          >
            <input
              type="checkbox"
              id={file.id}
              name="selectedFiles"
              value={file.id}
              checked={selectedFiles.includes(file.id)}
              className="h-4 w-4 mr-2 custom-checkbox cursor-pointer focus:ring-blue-500 border-gray-300 rounded"
              onChange={onChange}
            />
            <IconFileSelection filetype={file.type}/>
            <label className=" ml-1 text-sm font-light cursor-pointer">
              {file.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileSelection;
