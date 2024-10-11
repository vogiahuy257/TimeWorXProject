import React, { useState } from 'react';

const UploadMultipleFiler = ({ onFilesChange, setIsLink, setFileSizeError }) => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const maxFileSize = 25 * 1024 * 1024; // 25MB

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = [];
        const invalidFiles = [];

        files.forEach(file => {
            if (file.size <= maxFileSize) {
                validFiles.push(file);
            } else {
                invalidFiles.push(file);
            }
        });

        if (invalidFiles.length > 0) {
            const errorMsg = `Kích thước filer của bạn vượt quá quy định, bạn có thể gửi link tài liệu ở đây`;
            setFileSizeError(errorMsg);
            setIsLink(true); 
        } else {
            setFileSizeError(''); 
            setIsLink(false);
        }

        setUploadedFiles(prevFiles => [...prevFiles, ...validFiles]);
        onFilesChange([...uploadedFiles, ...validFiles]);
    };

    const removeFile = (index) => {
        const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
        setUploadedFiles(updatedFiles);
        onFilesChange(updatedFiles);
    };

    return (
        <div className="p-4 border border-gray-300 rounded-lg">
            <label className="flex flex-col items-center justify-center w-full h-12 bg-gray-100 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-200 transition">
                <span className="text-gray-500 m-auto">Click to upload file size up to 25M</span>
                <input 
                    type="file" 
                    className="hidden" 
                    multiple 
                    onChange={handleFileChange} 
                />
            </label>

            {uploadedFiles.length > 0 && (
                <div className="mt-4">
                    <ul className="list-disc list-inside space-y-2">
                        {uploadedFiles.map((file, index) => (
                            <li key={index} className="flex justify-between items-center">
                                <span>{file.name}</span>
                                <h1 
                                    className="text-red-500 hover:text-red-700 transition cursor-pointer"
                                    onClick={() => removeFile(index)}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 6.17647H20M10 16.7647V10.4118M14 16.7647V10.4118M16 21H8C6.89543 21 6 20.0519 6 18.8824V7.23529C6 6.65052 6.44772 6.17647 7 6.17647H17C17.5523 6.17647 18 6.65052 18 7.23529V18.8824C18 20.0519 17.1046 21 16 21ZM10 6.17647H14C14.5523 6.17647 15 5.70242 15 5.11765V4.05882C15 3.47405 14.5523 3 14 3H10C9.44772 3 9 3.47405 9 4.05882V5.11765C9 5.70242 9.44772 6.17647 10 6.17647Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
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
