import { Material, RecipeComponent, ProductionMetrics, ProductSettings } from '../types';

export const calculateProductionMetrics = (
  materials: Material[],
  recipe: RecipeComponent[],
  productSettings: ProductSettings
): ProductionMetrics => {
  // Calculate maximum production possible based on material constraints
  const productionLimits = recipe.map(component => {
    const material = materials.find(m => m.id === component.materialId);
    if (!material) return 0;
    return material.quantity / component.amountPerUnit;
  });

  // Maximum production is limited by the most constrained material
  const maxProduction = Math.floor(Math.min(...productionLimits));
  
  // Calculate cost per unit and total cost
  let totalCost = 0;
  recipe.forEach(component => {
    const material = materials.find(m => m.id === component.materialId);
    if (material) {
      totalCost += material.costPerUnit * component.amountPerUnit;
    }
  });
  
  const costPerUnit = totalCost;
  const totalProductionCost = totalCost * maxProduction;
  
  // Calculate financial metrics if selling price is provided
  const revenue = productSettings.sellingPrice * maxProduction;
  const profit = revenue - totalProductionCost;
  const profitMargin = profit / revenue * 100;
  
  // Identify bottleneck material
  const bottleneckIndex = productionLimits.indexOf(Math.min(...productionLimits));
  const bottleneckComponent = recipe[bottleneckIndex];
  const bottleneckMaterial = bottleneckComponent 
    ? materials.find(m => m.id === bottleneckComponent.materialId)?.name || null
    : null;
  
  // Calculate material utilization
  const materialUtilization = materials.map(material => {
    const recipeComponent = recipe.find(r => r.materialId === material.id);
    const used = recipeComponent ? recipeComponent.amountPerUnit * maxProduction : 0;
    
    return {
      materialId: material.id,
      materialName: material.name,
      used,
      available: material.quantity,
      utilizationPercentage: used / material.quantity * 100
    };
  });
  
  return {
    maxProduction,
    totalCost: totalProductionCost,
    costPerUnit,
    bottleneckMaterial,
    revenue,
    profit,
    profitMargin,
    materialUtilization
  };
};