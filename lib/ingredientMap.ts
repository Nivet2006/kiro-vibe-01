// Ingredient deduction mapping for order items
// Validates: Requirements 3.2

/**
 * Represents the deduction of a single ingredient when an order item is dispatched
 */
export interface IngredientDeduction {
  ingredientId: string;
  quantityPerItem: number; // percentage points to deduct
}

/**
 * Hardcoded mapping of menu items to their ingredient deductions
 * Used by the order pipeline to automatically decrement inventory when orders are dispatched
 */
export const INGREDIENT_DEDUCTION_MAP: Record<string, IngredientDeduction[]> = {
  'Margherita Pizza': [
    { ingredientId: 'flour', quantityPerItem: 2.5 },
    { ingredientId: 'tomato-sauce', quantityPerItem: 1.5 },
    { ingredientId: 'mozzarella', quantityPerItem: 3.0 },
  ],
  'Caesar Salad': [
    { ingredientId: 'romaine-lettuce', quantityPerItem: 4.0 },
    { ingredientId: 'parmesan', quantityPerItem: 1.0 },
    { ingredientId: 'caesar-dressing', quantityPerItem: 2.0 },
  ],
  'Grilled Chicken': [
    { ingredientId: 'chicken-breast', quantityPerItem: 5.0 },
    { ingredientId: 'olive-oil', quantityPerItem: 0.5 },
  ],
};
