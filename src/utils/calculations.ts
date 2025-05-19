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
  
  // Calculate raw cost per unit (excluding fixed costs)
  let rawCostPerUnit = 0;
  recipe.forEach(component => {
    const material = materials.find(m => m.id === component.materialId);
    if (material) {
      rawCostPerUnit += material.costPerUnit * component.amountPerUnit;
    }
  });
  
  // Calculate total raw cost (excluding fixed costs)
  const totalRawCost = rawCostPerUnit * maxProduction;
  
  // Add fixed cost to get total cost
  const totalCost = totalRawCost + productSettings.fixedCost;
  
  // Calculate cost per unit including fixed costs
  const costPerUnit = maxProduction > 0 ? totalCost / maxProduction : 0;
  
  // Calculate financial metrics
  const revenue = productSettings.sellingPrice * maxProduction;
  const profit = revenue - totalCost;
  const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
  
  // Calculate break-even units using contribution margin
  const contributionMarginPerUnit = productSettings.sellingPrice - rawCostPerUnit;
  const breakEvenUnits = contributionMarginPerUnit > 0 
    ? Math.ceil(productSettings.fixedCost / contributionMarginPerUnit)
    : Infinity;
  
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
    totalRawCost,
    totalCost,
    costPerUnit,
    bottleneckMaterial,
    revenue,
    profit,
    profitMargin,
    breakEvenUnits,
    materialUtilization
  };
};