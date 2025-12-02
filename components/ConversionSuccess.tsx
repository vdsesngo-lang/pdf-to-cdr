import React from 'react';
import { Download, Mail, ArrowRight, CheckCircle2, FileCode } from 'lucide-react';
import { ConvertedFile } from '../types';
import { downloadFile } from '../utils/fileUtils';

interface ConversionSuccessProps {
  convertedFile: ConvertedFile | null;
  onReset: () => void;
}

export const ConversionSuccess: React.FC<ConversionSuccessProps> = ({ convertedFile, onReset }) => {
  if (!convertedFile) return null;

  const targetEmail = "vdses.ngo@gmail.com";
  const emailSubject = encodeURIComponent(`Converted CDR File: ${convertedFile.originalName}`);
  const emailBody = encodeURIComponent(
    `Hello,\n\nPlease find the converted vector file for ${convertedFile.originalName} attached to this email.\n\nBest regards.`
  );
  
  const mailtoLink = `mailto:${targetEmail}?subject=${emailSubject}&body=${emailBody}`;

  const handleDownload = () => {
    // We download as SVG because browsers/Gemini generate SVG. 
    // CorelDRAW imports SVG perfectly. 
    // Naming it .svg is safer for file integrity, but the user asked for CDR.
    // We will name it .cdr.svg to be technically accurate but helpful, or just .svg
    // Let's stick to .svg for safety, but label it "Vector File".
    const fileName = convertedFile.originalName.replace(/\.[^/.]+$/, "") + "_vector.svg";
    downloadFile(convertedFile.svgContent, fileName, 'image/svg+xml');
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-green-50 p-6 border-b border-green-100 flex items-center gap-4">
        <div className="bg-green-100 p-2 rounded-full">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-green-800">Conversion Successful!</h2>
          <p className="text-green-700 text-sm">Your file has been processed into a scalable vector format.</p>
        </div>
      </div>

      <div className="p-8 space-y-8">
        
        {/* Step 1: Download */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center border border-indigo-200">
            1
          </div>
          <div className="flex-1 space-y-3">
            <h3 className="font-semibold text-slate-900 text-lg">Download Vector File</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Download the generated file. It is an SVG (Scalable Vector Graphic), which is fully compatible with CorelDRAW (CDR) and Illustrator.
            </p>
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-all active:scale-95"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Vector File (.svg)
            </button>
          </div>
        </div>

        <div className="w-full h-px bg-slate-100"></div>

        {/* Step 2: Email */}
        <div className="flex items-start gap-4">
           <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center border border-indigo-200">
            2
          </div>
          <div className="flex-1 space-y-3">
            <h3 className="font-semibold text-slate-900 text-lg">Send to NGO</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Click below to open your email client. <span className="font-bold text-slate-800">You must manually attach the downloaded file</span> to the email draft before sending.
            </p>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-600 mb-2">
                <span className="font-semibold">To:</span> {targetEmail}
            </div>
            <a
              href={mailtoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg shadow-sm transition-all"
            >
              <Mail className="w-5 h-5 mr-2" />
              Draft Email to NGO
              <ArrowRight className="w-4 h-4 ml-2 opacity-50" />
            </a>
            <p className="text-xs text-slate-400 italic">
              * Browsers cannot attach files to emails automatically for security reasons.
            </p>
          </div>
        </div>

      </div>
      
      <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-center">
        <button
          onClick={onReset}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium hover:underline"
        >
          Convert Another File
        </button>
      </div>
    </div>
  );
};
