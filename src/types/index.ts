export interface Material {
  id: string;
  name: string; 
  quantity: number;
  unit: string;
  costPerUnit: number;
}

export interface RecipeComponent {
  id: string;
  materialId: string;
  amountPerUnit: number;
}

export interface ProductionMetrics {
  maxProduction: number;
  totalCost: number;
  costPerUnit: number;
  bottleneckMaterial: string | null;
  revenue?: number;
  profit?: number;
  profitMargin?: number;
  materialUtilization: {
    materialId: string;
    materialName: string;
    used: number;
    available: number;
    utilizationPercentage: number;
  }[];
}

export interface ProductSettings {
  name: string;
  sellingPrice: number;
}