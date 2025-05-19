import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MaterialInput from './components/MaterialInput';
import RecipeInput from './components/RecipeInput';
import ProductSettings from './components/ProductSettings';
import ProductionMetrics from './components/ProductionMetrics';
import SaveLoadPanel from './components/SaveLoadPanel';
import { Material, RecipeComponent, ProductionMetrics as ProductionMetricsType, ProductSettings as ProductSettingsType } from './types';
import { calculateProductionMetrics } from './utils/calculations';

function App() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [recipe, setRecipe] = useState<RecipeComponent[]>([]);
  const [productSettings, setProductSettings] = useState<ProductSettingsType>({
    name: 'Product',
    sellingPrice: 0
  });
  const [metrics, setMetrics] = useState<ProductionMetricsType | null>(null);

  // Calculate metrics whenever inputs change
  useEffect(() => {
    if (materials.length > 0 && recipe.length > 0) {
      const calculatedMetrics = calculateProductionMetrics(
        materials,
        recipe,
        productSettings
      );
      setMetrics(calculatedMetrics);
    } else {
      setMetrics(null);
    }
  }, [materials, recipe, productSettings]);

  // Sample data for demonstration
  const loadSampleData = () => {
    setMaterials([
      { id: '1', name: 'Aluminum', quantity: 1000, unit: 'kg', costPerUnit: 5 },
      { id: '2', name: 'Plastic', quantity: 500, unit: 'kg', costPerUnit: 3 },
      { id: '3', name: 'Circuit Boards', quantity: 200, unit: 'units', costPerUnit: 10 }
    ]);
    
    setRecipe([
      { id: '1', materialId: '1', amountPerUnit: 2 },
      { id: '2', materialId: '2', amountPerUnit: 1 },
      { id: '3', materialId: '3', amountPerUnit: 1 }
    ]);
    
    setProductSettings({
      name: 'Smart Thermostat',
      sellingPrice: 50
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Manufacturing Calculator</h2>
            <button
              onClick={loadSampleData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
            >
              Load Sample Data
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MaterialInput materials={materials} setMaterials={setMaterials} />
            <RecipeInput materials={materials} recipe={recipe} setRecipe={setRecipe} />
          </div>
          
          <ProductSettings 
            productSettings={productSettings} 
            setProductSettings={setProductSettings} 
          />
          
          {metrics && (
            <ProductionMetrics metrics={metrics} productName={productSettings.name} />
          )}
          
          <SaveLoadPanel 
            materials={materials}
            recipe={recipe}
            productSettings={productSettings}
            setMaterials={setMaterials}
            setRecipe={setRecipe}
            setProductSettings={setProductSettings}
          />
        </div>
      </main>
      
      <footer className="bg-gray-800 text-gray-300 py-6 px-4 mt-8">
        <div className="container mx-auto">
          <p className="text-center">
            Production Process Calculator &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;