'use client';

import { useState, useRef } from 'react';
import { FiFile, FiTrash2, FiUploadCloud, FiAlertCircle } from 'react-icons/fi';

export default function FileAttachment({ onFileChange, onContentExtracted }) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState('');
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const processFiles = async (fileList) => {
    const newFiles = Array.from(fileList);
    setFiles(prev => [...prev, ...newFiles]);
    
    // Update parent with file list
    onFileChange([...files, ...newFiles]);
    
    // Process file content (only text files for now)
    if (onContentExtracted && newFiles.length > 0) {
      const textFile = newFiles.find(file => 
        file.type === 'text/plain' || 
        file.name.endsWith('.txt') || 
        file.name.endsWith('.md')
      );
      
      if (textFile) {
        setIsProcessing(true);
        setProcessingError('');
        
        try {
          // For simple text files, we can use FileReader
          const content = await readFileAsText(textFile);
          onContentExtracted(content);
        } catch (error) {
          console.error('Error reading file:', error);
          setProcessingError('Failed to read file. Please try a different format.');
        } finally {
          setIsProcessing(false);
        }
      }
    }
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    
    // Update parent component
    onFileChange(updatedFiles);
  };

  const handleButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div className="w-full">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center">
          <FiUploadCloud className="h-10 w-10 text-gray-400 mb-3" />
          <p className="text-sm text-gray-700 mb-1">
            <span className="font-medium">Drop files here</span> or click to browse
          </p>
          <p className="text-xs text-gray-500">
            Supported file types: TXT, MD
          </p>
          <button
            type="button"
            onClick={handleButtonClick}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Select Files
          </button>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".txt,.md"
            multiple
          />
          
          {isProcessing && (
            <div className="mt-3 flex items-center text-sm text-blue-600">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing file...
            </div>
          )}
          
          {processingError && (
            <div className="mt-3 flex items-center text-sm text-red-600">
              <FiAlertCircle className="mr-1" />
              {processingError}
            </div>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Attached Files</h4>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                <div className="flex items-center">
                  <FiFile className="text-gray-400 mr-2" />
                  <span className="text-sm text-gray-700 truncate max-w-xs">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Remove file"
                >
                  <FiTrash2 />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}