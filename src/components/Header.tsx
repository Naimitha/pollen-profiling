import React from 'react';
import { Microscope, Leaf } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 shadow-2xl border-b border-gray-800 backdrop-blur-sm bg-gray-900/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                <Microscope className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-gray-900"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Pollen Analysis
              </h1>
              <p className="text-sm text-gray-400 font-medium">Cerrado Species Classification</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-gradient-to-r from-emerald-900/50 to-teal-900/50 px-4 py-2 rounded-full border border-emerald-800/50">
            <Leaf className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-300">Brazilian Savannah</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;