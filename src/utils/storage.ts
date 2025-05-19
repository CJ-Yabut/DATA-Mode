import { Material, RecipeComponent, ProductSettings } from '../types';

interface SavedScenario {
  id: string;
  name: string;
  date: string;
  materials: Material[];
  recipe: RecipeComponent[];
  productSettings: ProductSettings;
}

export const saveScenario = (
  name: string,
  materials: Material[],
  recipe: RecipeComponent[],
  productSettings: ProductSettings
): void => {
  const savedScenarios = getSavedScenarios();
  
  const newScenario: SavedScenario = {
    id: Date.now().toString(),
    name,
    date: new Date().toISOString(),
    materials,
    recipe,
    productSettings
  };
  
  const updatedScenarios = [...savedScenarios, newScenario];
  localStorage.setItem('productionScenarios', JSON.stringify(updatedScenarios));
};

export const getSavedScenarios = (): SavedScenario[] => {
  const scenariosJson = localStorage.getItem('productionScenarios');
  if (!scenariosJson) return [];
  return JSON.parse(scenariosJson);
};

export const loadScenario = (id: string): SavedScenario | null => {
  const scenarios = getSavedScenarios();
  return scenarios.find(scenario => scenario.id === id) || null;
};

export const deleteScenario = (id: string): void => {
  const scenarios = getSavedScenarios();
  const updatedScenarios = scenarios.filter(scenario => scenario.id !== id);
  localStorage.setItem('productionScenarios', JSON.stringify(updatedScenarios));
};

export const exportToCSV = (
  materials: Material[],
  recipe: RecipeComponent[],
  productSettings: ProductSettings
): string => {
  // Implement CSV export logic
  const materialRows = materials.map(m => 
    `Material,${m.name},${m.quantity},${m.unit},${m.costPerUnit}`
  ).join('\n');
  
  const recipeRows = recipe.map(r => {
    const material = materials.find(m => m.id === r.materialId);
    return `Recipe,${material?.name || 'Unknown'},${r.amountPerUnit}`;
  }).join('\n');
  
  const productRow = `Product,${productSettings.name},${productSettings.sellingPrice}`;
  
  return `${materialRows}\n${recipeRows}\n${productRow}`;
};