import React, { useState } from 'react';
import { Plus, X, Edit } from 'lucide-react';
import { Material } from '../types';

interface MaterialInputProps {
  materials: Material[];
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
}

const MaterialInput: React.FC<MaterialInputProps> = ({ materials, setMaterials }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [costPerUnit, setCostPerUnit] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddMaterial = () => {
    if (!name || !quantity || !unit || !costPerUnit) return;

    if (editingId) {
      setMaterials(prevMaterials =>
        prevMaterials.map(material =>
          material.id === editingId
            ? {
                ...material,
                name,
                quantity: parseFloat(quantity),
                unit,
                costPerUnit: parseFloat(costPerUnit)
              }
            : material
        )
      );
      setEditingId(null);
    } else {
      const newMaterial: Material = {
        id: Date.now().toString(),
        name,
        quantity: parseFloat(quantity),
        unit,
        costPerUnit: parseFloat(costPerUnit)
      };
      setMaterials(prevMaterials => [...prevMaterials, newMaterial]);
    }

    setName('');
    setQuantity('');
    setUnit('');
    setCostPerUnit('');
  };

  const handleEdit = (material: Material) => {
    setName(material.name);
    setQuantity(material.quantity.toString());
    setUnit(material.unit);
    setCostPerUnit(material.costPerUnit.toString());
    setEditingId(material.id);
  };

  const handleRemove = (id: string) => {
    setMaterials(prevMaterials => prevMaterials.filter(material => material.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Raw Materials</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Material Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Aluminum"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Available</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="kg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cost Per Unit</label>
          <input
            type="number"
            value={costPerUnit}
            onChange={(e) => setCostPerUnit(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="5.00"
          />
        </div>
      </div>
      
      <button
        onClick={handleAddMaterial}
        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
      >
        <Plus size={16} className="mr-1" />
        {editingId ? 'Update Material' : 'Add Material'}
      </button>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Materials List</h3>
        {materials.length === 0 ? (
          <p className="text-gray-500 italic">No materials added yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {materials.map((material) => (
                  <tr key={material.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{material.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{material.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{material.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap">₱{material.costPerUnit}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(material)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleRemove(material.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialInput;