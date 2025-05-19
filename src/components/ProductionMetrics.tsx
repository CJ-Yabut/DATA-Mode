import React from 'react';
import { ProductionMetrics as ProductionMetricsType } from '../types';

interface ProductionMetricsProps {
  metrics: ProductionMetricsType | null;
  productName: string;
}

const ProductionMetrics: React.FC<ProductionMetricsProps> = ({ metrics, productName }) => {
  if (!metrics) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Production Metrics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-sm font-medium text-blue-800 mb-1">Maximum Production</h3>
          <p className="text-2xl font-bold text-blue-900">{metrics.maxProduction} units</p>
          <p className="text-xs text-blue-700 mt-1">
            {metrics.bottleneckMaterial 
              ? `Limited by ${metrics.bottleneckMaterial}`
              : 'No bottleneck detected'}
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <h3 className="text-sm font-medium text-gray-800 mb-1">Total Cost</h3>
          <p className="text-2xl font-bold text-gray-900">₱{metrics.totalCost.toFixed(2)}</p>
          <p className="text-xs text-gray-700 mt-1">
            ₱{metrics.costPerUnit.toFixed(2)} per unit
          </p>
        </div>
        
        {metrics.revenue !== undefined && (
          <div className={`p-4 rounded-lg border ${
            metrics.profit && metrics.profit > 0 
              ? 'bg-green-50 border-green-100' 
              : 'bg-red-50 border-red-100'
          }`}>
            <h3 className={`text-sm font-medium mb-1 ${
              metrics.profit && metrics.profit > 0 
                ? 'text-green-800' 
                : 'text-red-800'
            }`}>
              Profit
            </h3>
            <p className={`text-2xl font-bold ${
              metrics.profit && metrics.profit > 0 
                ? 'text-green-900' 
                : 'text-red-900'
            }`}>
              ₱{metrics.profit?.toFixed(2)}
            </p>
            <p className={`text-xs mt-1 ${
              metrics.profit && metrics.profit > 0 
                ? 'text-green-700' 
                : 'text-red-700'
            }`}>
              {metrics.profitMargin?.toFixed(2)}% margin
            </p>
          </div>
        )}
      </div>
      
      <h3 className="text-lg font-medium text-gray-700 mb-3">Material Utilization</h3>
      <div className="space-y-4">
        {metrics.materialUtilization.map(material => (
          <div key={material.materialId} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between mb-1">
              <span className="font-medium">{material.materialName}</span>
              <span className="text-sm text-gray-600">
                {material.used.toFixed(2)} / {material.available.toFixed(2)}
                {' '}({material.utilizationPercentage.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  material.utilizationPercentage > 90 
                    ? 'bg-orange-500' 
                    : 'bg-blue-600'
                }`}
                style={{ width: `${Math.min(material.utilizationPercentage, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductionMetrics;