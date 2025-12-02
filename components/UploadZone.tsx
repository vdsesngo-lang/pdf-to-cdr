import React, { useCallback } from 'react';
import { UploadCloud, FileType } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, isProcessing }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect, isProcessing]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div 
      className={`relative w-full border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ease-in-out text-center group
        ${isProcessing 
          ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed' 
          : 'border-indigo-300 bg-indigo-50/30 hover:bg-indigo-50 hover:border-indigo-500 cursor-pointer'
        }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        type="file"
        accept=".pdf,image/*"
        onChange={handleInputChange}
        disabled={isProcessing}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      
      <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
        <div className={`p-4 rounded-full transition-colors ${isProcessing ? 'bg-gray-200' : 'bg-indigo-100 group-hover:bg-indigo-200'}`}>
          <UploadCloud className={`w-10 h-10 ${isProcessing ? 'text-gray-400' : 'text-indigo-600'}`} />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-slate-800">
            {isProcessing ? 'Processing File...' : 'Upload your PDF'}
          </h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            Drag and drop or click to browse. We'll convert it to a vector format compatible with CorelDRAW.
          </p>
        </div>
        {!isProcessing && (
          <div className="flex gap-2 justify-center pt-2">
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
              <FileType className="w-3 h-3 mr-1" /> PDF
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
              <FileType className="w-3 h-3 mr-1" /> JPEG/PNG
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
