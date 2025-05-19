import React from 'react';
import { ProductSettings as ProductSettingsType } from '../types';

interface ProductSettingsProps {
  productSettings: ProductSettingsType;
  setProductSettings: React.Dispatch<React.SetStateAction<ProductSettingsType>>;
}

const ProductSettings: React.FC<ProductSettingsProps> = ({ 
  productSettings, 
  setProductSettings 
}) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductSettings(prev => ({
      ...prev,
      name: e.target.value
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductSettings(prev => ({
      ...prev,
      sellingPrice: parseFloat(e.target.value) || 0
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <input
            type="text"
            value={productSettings.name}
            onChange={handleNameChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Widget Pro 2000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Selling Price Per Unit (₱)
          </label>
          <input
            type="number"
            value={productSettings.sellingPrice || ''}
            onChange={handlePriceChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="25.00"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductSettings;