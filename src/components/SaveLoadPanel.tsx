import React, { useState } from 'react';
import { Save, FolderOpen, Download, Trash2 } from 'lucide-react';
import { Material, RecipeComponent, ProductSettings } from '../types';
import { saveScenario, getSavedScenarios, loadScenario, deleteScenario, exportToCSV } from '../utils/storage';

interface SaveLoadPanelProps {
  materials: Material[];
  recipe: RecipeComponent[];
  productSettings: ProductSettings;
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
  setRecipe: React.Dispatch<React.SetStateAction<RecipeComponent[]>>;
  setProductSettings: React.Dispatch<React.SetStateAction<ProductSettings>>;
}

const SaveLoadPanel: React.FC<SaveLoadPanelProps> = ({
  materials,
  recipe,
  productSettings,
  setMaterials,
  setRecipe,
  setProductSettings
}) => {
  const [showSavedScenarios, setShowSavedScenarios] = useState(false);
  const [scenarioName, setScenarioName] = useState('');
  
  const handleSave = () => {
    if (!scenarioName) {
      alert('Please enter a name for this scenario');
      return;
    }
    
    saveScenario(scenarioName, materials, recipe, productSettings);
    setScenarioName('');
    alert('Scenario saved successfully');
  };
  
  const handleLoad = (id: string) => {
    const scenario = loadScenario(id);
    if (!scenario) return;
    
    setMaterials(scenario.materials);
    setRecipe(scenario.recipe);
    setProductSettings(scenario.productSettings);
    setShowSavedScenarios(false);
  };
  
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this scenario?')) {
      deleteScenario(id);
      // Force refresh of saved scenarios
      setShowSavedScenarios(false);
      setTimeout(() => setShowSavedScenarios(true), 10);
    }
  };
  
  const handleExport = () => {
    const csvContent = exportToCSV(materials, recipe, productSettings);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${productSettings.name || 'production'}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const savedScenarios = getSavedScenarios();
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Save & Load</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Scenario Name
          </label>
          <input
            type="text"
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Summer 2025 Production"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleSave}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300 mr-2"
          >
            <Save size={16} className="mr-1" />
            Save
          </button>
          <button
            onClick={() => setShowSavedScenarios(!showSavedScenarios)}
            className="flex items-center bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors duration-300 mr-2"
          >
            <FolderOpen size={16} className="mr-1" />
            {showSavedScenarios ? 'Hide Saved' : 'Load Saved'}
          </button>
          <button
            onClick={handleExport}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
          >
            <Download size={16} className="mr-1" />
            Export
          </button>
        </div>
      </div>
      
      {showSavedScenarios && (
        <div className="mt-4 border rounded-md p-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Saved Scenarios</h3>
          {savedScenarios.length === 0 ? (
            <p className="text-gray-500 italic">No saved scenarios found</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {savedScenarios.map(scenario => (
                <div
                  key={scenario.id}
                  onClick={() => handleLoad(scenario.id)}
                  className="flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-md cursor-pointer"
                >
                  <div>
                    <h4 className="font-medium text-gray-800">{scenario.name}</h4>
                    <p className="text-xs text-gray-500">
                      {new Date(scenario.date).toLocaleDateString()} - 
                      {scenario.materials.length} materials, 
                      {scenario.recipe.length} recipe components
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(scenario.id, e)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SaveLoadPanel;