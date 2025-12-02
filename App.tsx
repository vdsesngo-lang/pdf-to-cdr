import React, { useState } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { ConversionSuccess } from './components/ConversionSuccess';
import { AppStatus, ConvertedFile } from './types';
import { fileToBase64, validateFile } from './utils/fileUtils';
import { convertPdfToVector } from './services/geminiService';
import { Loader2, AlertCircle } from 'lucide-react';

export default function App() {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [convertedFile, setConvertedFile] = useState<ConvertedFile | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    if (!validateFile(file)) {
      setErrorMessage("Please upload a valid PDF or Image file.");
      return;
    }

    setStatus(AppStatus.PROCESSING);
    setErrorMessage(null);

    try {
      const base64Data = await fileToBase64(file);
      const svgContent = await convertPdfToVector(base64Data, file.type);
      
      setConvertedFile({
        originalName: file.name,
        svgContent,
        timestamp: Date.now()
      });
      setStatus(AppStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(AppStatus.ERROR);
      setErrorMessage("Failed to process the file. Please try again or use a simpler PDF page.");
    }
  };

  const handleReset = () => {
    setStatus(AppStatus.IDLE);
    setConvertedFile(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-12 flex flex-col items-center">
        
        <div className="w-full max-w-2xl text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Convert PDF to Vector</h2>
            <p className="text-slate-600">
              Upload your design documents. Our AI will analyze the layout and recreate it as a clean vector file ready for CorelDRAW.
            </p>
        </div>

        <div className="w-full max-w-2xl">
          {status === AppStatus.IDLE && (
            <UploadZone onFileSelect={handleFileSelect} isProcessing={false} />
          )}

          {status === AppStatus.PROCESSING && (
            <div className="w-full bg-white rounded-2xl p-12 shadow-sm border border-slate-200 text-center">
              <div className="flex justify-center mb-6">
                <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Analyzing Document</h3>
              <p className="text-slate-500">
                Gemini AI is converting your PDF content into editable vector paths...
              </p>
            </div>
          )}

          {status === AppStatus.SUCCESS && convertedFile && (
            <ConversionSuccess convertedFile={convertedFile} onReset={handleReset} />
          )}

          {status === AppStatus.ERROR && (
            <div className="w-full bg-white rounded-2xl p-8 shadow-sm border border-red-100 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                   <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Conversion Failed</h3>
              <p className="text-red-600 mb-6">{errorMessage || "An unexpected error occurred."}</p>
              <button 
                onClick={handleReset}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-slate-400 text-xs max-w-lg">
          <p>
            This tool generates SVG files which are compatible with CorelDRAW (Import as SVG). 
            Automated email attachments are not supported by web browsers; you must attach the downloaded file manually.
          </p>
        </div>

      </main>
    </div>
  );
}
