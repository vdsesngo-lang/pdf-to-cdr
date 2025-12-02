import React from 'react';
import { FileOutput, Mail } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-indigo-700 text-white shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/10 p-2 rounded-lg">
            <FileOutput className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">PDF to CDR Converter</h1>
            <p className="text-indigo-200 text-sm">AI-Powered Vector Reconstruction</p>
          </div>
        </div>
        <div className="hidden md:flex items-center text-sm font-medium bg-indigo-800/50 px-4 py-2 rounded-full border border-indigo-500/30">
          <Mail className="w-4 h-4 mr-2" />
          Auto-draft to: vdses.ngo@gmail.com
        </div>
      </div>
    </header>
  );
};
