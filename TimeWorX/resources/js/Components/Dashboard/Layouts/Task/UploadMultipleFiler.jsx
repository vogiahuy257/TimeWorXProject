import React, { useState } from 'react';

const UploadMultipleFiler = ({ onFilesChange }) => {
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setUploadedFiles([...uploadedFiles, ...files]);
        onFilesChange([...uploadedFiles, ...files]);
    };

    const removeFile = (index) => {
        const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
        setUploadedFiles(updatedFiles);
        onFilesChange(updatedFiles);
    };

    return (
        <div className="p-4 border border-gray-300 rounded-lg">
            <label className="flex flex-col items-center justify-center w-full h-12 bg-gray-100 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-200 transition">
                <span className="text-gray-500 m-auto">Click to upload files</span>
                <input 
                    type="file" 
                    className="hidden" 
                    multiple 
                    onChange={handleFileChange} 
                    accept=".pdf,.doc,.docx,.txt,.xlsx,.csv"
                />
            </label>

            {uploadedFiles.length > 0 && (
                <div className="mt-4">
                    <h4 className="font-semibold">Uploaded Files:</h4>
                    <ul className="list-disc list-inside space-y-2">
                        {uploadedFiles.map((file, index) => (
                            <li key={index} className="flex justify-between items-center">
                                <span>{file.name}</span>
                                <h1 
                                    className="text-red-500 hover:text-red-700 transition cursor-pointer"
                                    onClick={() => removeFile(index)}
                                >
                                    Remove
                                </h1>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UploadMultipleFiler;
