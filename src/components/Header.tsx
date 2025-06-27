import React from 'react';
import { Microscope, Leaf } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <Microscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Pollen Profiling</h1>
              <p className="text-xs text-gray-500">Cerrado Pollen Classification</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Leaf className="w-4 h-4 text-green-500" />
            <span>Brazilian Savannah Species</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;