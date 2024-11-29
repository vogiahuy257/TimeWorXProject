import React, { useEffect,useState } from 'react';
import { toast } from 'react-toastify';

const UploadMultipleFiler = ({ onFilesChange, setIsLink, setFileSizeError, existingFiles=[] }) => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const maxFileSize = 25 * 1024 * 1024; // 25MB

    useEffect(() => {
        const fetchFiles = async () => {
            if (existingFiles.length > 0) {
                const files = await Promise.all(existingFiles.map(async (file) => {
                    try {
                        // Tải file từ URL
                            const fullPath = `/storage/${file.path}`;
                            const response = await fetch(fullPath);
                            const blob = await response.blob();
        
                            // Tạo đối tượng File từ Blob
                            const newFile = new File([blob], file.name, { type: file.type });
        
                            return {
                                file: newFile,
                                path: file.path,
                                type: file.type,
                                isApiFile: true
                            };
                        
                    } catch (error) {
                        toast.error('Error fetching file:', error);
                        return null;
                    }
                }));
    
                // Loại bỏ các file null nếu fetch lỗi
                const validFiles = files.filter(file => file !== null);
    
                setUploadedFiles(validFiles);
            }
        };
    
        fetchFiles();
    }, [existingFiles]);

    // const handleFileChange = (e) => {
    //     const files = Array.from(e.target.files);
    //     const validFiles = [];
    //     const invalidFiles = [];

    //     files.forEach(file => {
    //         if (file.size <= maxFileSize) {
    //             validFiles.push(file);
    //         } else {
    //             invalidFiles.push(file);
    //         }
    //     });

    //     if (invalidFiles.length > 0) {
    //         const errorMsg = `Your file size exceeds the limit, you can send the document link here`;
    //         setFileSizeError(errorMsg);
    //         setIsLink(true); 
    //     } else {
    //         setFileSizeError(''); 
    //         setIsLink(false);
    //     }

    //     setUploadedFiles(prevFiles => [...prevFiles, ...validFiles]);
    //     onFilesChange([...uploadedFiles, ...validFiles]);
    // };
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = [];
        const invalidFiles = [];
    
        files.forEach(file => {
            if (file.size <= maxFileSize) {
                // Thêm cấu trúc cho mỗi file
                const newFile = {
                    file: file,
                    path: '',  // Đường dẫn sẽ được tạo khi upload lên server
                    type: file.type,
                    isApiFile: false  // Không phải file từ API
                };
                validFiles.push(newFile);
            } else {
                invalidFiles.push(file);
            }
        });
    
        if (invalidFiles.length > 0) {
            const errorMsg = `Your file size exceeds the limit, you can send the document link here`;
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

    const createDownloadUrl = (file) => {
        if (file instanceof File) {
            return {
                url: URL.createObjectURL(file),
                name: file.name,
                type: file.type,
            };
        }
        return { url: '', name: '', type: '' };
    };

    const handleDownload = (file) => {
        const { url, name, type } = createDownloadUrl(file);
            // Nếu là file tải lên từ người dùng
            const a = document.createElement('a');
            a.href = url; // Sử dụng URL đã tạo
            a.download = name; // Đặt tên file
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url); // Giải phóng URL
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
                                file.type !== 'link' && (
                                    <li key={index} className="flex justify-between items-center">
                                        <span
                                            onClick={() => handleDownload(file.file)} 
                                            className="text-blue-500 hover:underline cursor-pointer truncate max-w-xs inline-block"
                                            title={file.file.name}
                                        >
                                            {file.file.name}
                                        </span>
                                        <h1 
                                            className="text-red-500 hover:text-red-700 transition cursor-pointer"
                                            onClick={() => removeFile(index)}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4 6.17647H20M10 16.7647V10.4118M14 16.7647V10.4118M16 21H8C6.89543 21 6 20.0519 6 18.8824V7.23529C6 6.65052 6.44772 6.17647 7 6.17647H17C17.5523 6.17647 18 6.65052 18 7.23529V18.8824C18 20.0519 17.1046 21 16 21ZM10 6.17647H14C14.5523 6.17647 15 5.70242 15 5.11765V4.05882C15 3.47405 14.5523 3 14 3H10C9.44772 3 9 3.47405 9 4.05882V5.11765C9 5.70242 9.44772 6.17647 10 6.17647Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </h1>
                                    </li>
                                )
                            ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UploadMultipleFiler;
