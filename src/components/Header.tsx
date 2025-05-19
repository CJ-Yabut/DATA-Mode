import React from 'react';
import { Factory } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-6 px-4 shadow-lg">
      <div className="container mx-auto flex items-center">
        <Factory size={32} className="mr-3" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Production Process Calculator</h1>
          <p className="text-blue-200">Optimize your manufacturing with precise material calculations</p>
        </div>
      </div>
    </header>
  );
};

export default Header;