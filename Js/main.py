import json
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional
from datetime import datetime
import math

@dataclass
class Material:
    name: str
    quantity: float
    unit: str
    cost_per_unit: float

@dataclass
class RecipeComponent:
    material_name: str
    amount_per_unit: float

@dataclass
class Product:
    name: str
    selling_price: float
    fixed_costs: float
    recipe: List[RecipeComponent]

class ProductionCalculator:
    def __init__(self):
        self.materials: Dict[str, Material] = {}
        self.product: Optional[Product] = None

    def get_float_input(self, prompt: str) -> float:
        while True:
            try:
                value = float(input(prompt))
                if value < 0:
                    raise ValueError("Value must be non-negative.")
                return value
            except ValueError:
                print("Invalid input. Please enter a non-negative number.")

    def add_material(self, name: str, quantity: float, unit: str, cost_per_unit: float):
        self.materials[name] = Material(name, quantity, unit, cost_per_unit)
        print(f"Added material: {name}")

    def set_product(self, name: str, selling_price: float, fixed_costs: float, recipe: List[RecipeComponent]):
        self.product = Product(name, selling_price, fixed_costs, recipe)
        print(f"Set product: {name}")

    def calculate_metrics(self) -> dict:
        if not self.product or not self.materials:
            return {"error": "Product or materials not defined"}

        # Calculate maximum production based on material constraints
        max_units = float('inf')
        bottleneck = None
        
        for component in self.product.recipe:
            if component.material_name not in self.materials:
                return {"error": f"Material not found: {component.material_name}"}
            
            material = self.materials[component.material_name]
            possible_units = material.quantity / component.amount_per_unit
            
            if possible_units < max_units:
                max_units = possible_units
                bottleneck = material.name

        max_units = int(max_units)  # Round down to whole units

        # Calculate costs and profits
        variable_cost = 0
        material_usage = {}
        
        for component in self.product.recipe:
            material = self.materials[component.material_name]
            material_cost = component.amount_per_unit * material.cost_per_unit
            variable_cost += material_cost * max_units
            
            material_usage[component.material_name] = {
                "used": component.amount_per_unit * max_units,
                "available": material.quantity,
                "utilization": (component.amount_per_unit * max_units / material.quantity) * 100
            }

        total_cost = variable_cost + self.product.fixed_costs
        cost_per_unit = total_cost / max_units if max_units > 0 else 0
        revenue = max_units * self.product.selling_price
        profit = revenue - total_cost
        profit_margin = (profit / revenue * 100) if revenue > 0 else 0

        # Calculate break-even point
        variable_cost_per_unit = variable_cost / max_units if max_units > 0 else 0
        contribution_margin = self.product.selling_price - variable_cost_per_unit
        break_even_units = math.ceil(self.product.fixed_costs / contribution_margin) if contribution_margin > 0 else float('inf')

        return {
            "max_production": max_units,
            "bottleneck_material": bottleneck,
            "variable_cost": round(variable_cost, 2),
            "fixed_cost": round(self.product.fixed_costs, 2),
            "total_cost": round(total_cost, 2),
            "cost_per_unit": round(cost_per_unit, 2),
            "revenue": round(revenue, 2),
            "profit": round(profit, 2),
            "profit_margin": round(profit_margin, 2),
            "break_even_units": break_even_units,
            "material_utilization": material_usage
        }

    def save_scenario(self, name: str):
        if not self.product:
            print("No product defined")
            return

        scenario = {
            "name": name,
            "date": datetime.now().isoformat(),
            "materials": {name: asdict(material) for name, material in self.materials.items()},
            "product": asdict(self.product)
        }

        try:
            with open(f"{name}.json", "w") as f:
                json.dump(scenario, f, indent=2)
            print(f"Scenario saved as: {name}.json")
        except Exception as e:
            print(f"Error saving scenario: {e}")

    def load_test_case(self):
        # Coffee production test case
        self.materials = {
            "Arabica": Material("Arabica", 120, "kg", 7.0),
            "Robusta": Material("Robusta", 80, "kg", 5.0),
            "Instant": Material("Instant", 15, "kg", 12.0),
            "Flavoring": Material("Flavoring", 5, "kg", 15.0),
            "Packaging": Material("Packaging", 200, "units", 0.4)
        }
        
        recipe = [
            RecipeComponent("Arabica", 0.7),
            RecipeComponent("Robusta", 0.2),
            RecipeComponent("Instant", 0.05),
            RecipeComponent("Flavoring", 0.03),
            RecipeComponent("Packaging", 1.0)
        ]
        
        self.product = Product("Premium Coffee Blend", 18.0, 250.0, recipe)
        return self.calculate_metrics()

def main():
    calc = ProductionCalculator()
    
    while True:
        print("\nProduction Process Calculator")
        print("1. Add material")
        print("2. Set product recipe")
        print("3. Calculate metrics")
        print("4. Save scenario")
        print("5. Load test case")
        print("6. Exit")
        
        choice = input("\nEnter your choice (1-6): ")
        
        if choice == "1":
            name = input("Material name: ")
            quantity = calc.get_float_input("Quantity: ")
            unit = input("Unit (e.g., kg, liters): ")
            cost = calc.get_float_input("Cost per unit: ")
            calc.add_material(name, quantity, unit, cost)

        elif choice == "2":
            name = input("Product name: ")
            price = calc.get_float_input("Selling price per unit: ")
            fixed_costs = calc.get_float_input("Fixed costs: ")
            
            recipe = []
            while True:
                material = input("Material name (or 'done' to finish): ")
                if material.lower() == 'done':
                    break
                amount = calc.get_float_input(f"Amount of {material} per unit: ")
                recipe.append(RecipeComponent(material, amount))
            
            calc.set_product(name, price, fixed_costs, recipe)

        elif choice == "3":
            metrics = calc.calculate_metrics()
            print("\nProduction Metrics:")
            print(json.dumps(metrics, indent=2))

        elif choice == "4":
            name = input("Scenario name: ")
            calc.save_scenario(name)

        elif choice == "5":
            metrics = calc.load_test_case()
            print("\nTest Case Metrics:")
            print(json.dumps(metrics, indent=2))

        elif choice == "6":
            print("Goodbye!")
            break

        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()