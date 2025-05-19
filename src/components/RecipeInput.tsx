import React, { useState } from 'react';
import { Plus, X, Edit } from 'lucide-react';
import { Material, RecipeComponent } from '../types';

interface RecipeInputProps {
  materials: Material[];
  recipe: RecipeComponent[];
  setRecipe: React.Dispatch<React.SetStateAction<RecipeComponent[]>>;
}

const RecipeInput: React.FC<RecipeInputProps> = ({ materials, recipe, setRecipe }) => {
  const [materialId, setMaterialId] = useState('');
  const [amountPerUnit, setAmountPerUnit] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddComponent = () => {
    if (!materialId || !amountPerUnit) return;

    if (editingId) {
      setRecipe(prevRecipe =>
        prevRecipe.map(component =>
          component.id === editingId
            ? {
                ...component,
                materialId,
                amountPerUnit: parseFloat(amountPerUnit)
              }
            : component
        )
      );
      setEditingId(null);
    } else {
      // Check if this material is already in the recipe
      const existingComponent = recipe.find(c => c.materialId === materialId);
      if (existingComponent) {
        alert('This material is already in the recipe. Edit the existing entry instead.');
        return;
      }

      const newComponent: RecipeComponent = {
        id: Date.now().toString(),
        materialId,
        amountPerUnit: parseFloat(amountPerUnit)
      };
      setRecipe(prevRecipe => [...prevRecipe, newComponent]);
    }

    setMaterialId('');
    setAmountPerUnit('');
  };

  const handleEdit = (component: RecipeComponent) => {
    setMaterialId(component.materialId);
    setAmountPerUnit(component.amountPerUnit.toString());
    setEditingId(component.id);
  };

  const handleRemove = (id: string) => {
    setRecipe(prevRecipe => prevRecipe.filter(component => component.id !== id));
  };

  const getMaterialName = (id: string): string => {
    return materials.find(m => m.id === id)?.name || 'Unknown';
  };

  const getMaterialUnit = (id: string): string => {
    return materials.find(m => m.id === id)?.unit || '';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Recipe</h2>
      
      {materials.length === 0 ? (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-700">Please add materials before defining the recipe.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Raw Material</label>
              <select
                value={materialId}
                onChange={(e) => setMaterialId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a material</option>
                {materials.map(material => (
                  <option key={material.id} value={material.id}>
                    {material.name} ({material.unit})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount Per Unit {materialId && `(${getMaterialUnit(materialId)})`}
              </label>
              <input
                type="number"
                value={amountPerUnit}
                onChange={(e) => setAmountPerUnit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2.5"
              />
            </div>
          </div>
          
          <button
            onClick={handleAddComponent}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
          >
            <Plus size={16} className="mr-1" />
            {editingId ? 'Update Component' : 'Add Component'}
          </button>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Recipe Components</h3>
            {recipe.length === 0 ? (
              <p className="text-gray-500 italic">No components added yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Per Unit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recipe.map((component) => (
                      <tr key={component.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{getMaterialName(component.materialId)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {component.amountPerUnit} {getMaterialUnit(component.materialId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(component)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleRemove(component.id)}
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
        </>
      )}
    </div>
  );
};

export default RecipeInput;