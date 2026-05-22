import { CategoryDiscount } from '../models/product.model';

/** Local discount table (simulates backend). Replace with API when ready. */
export const DISCOUNTS: readonly CategoryDiscount[] = [
  { category: 'electronics', discount: 10 },
  { category: 'jewelery', discount: 5 },
  { category: "men's clothing", discount: 15 },
] as const;

export const getDiscountForCategory = (category: string): number =>
  DISCOUNTS.find((d) => d.category === category)?.discount ?? 0;

export const calculateFinalPrice = (price: number, discount: number): number =>
  discount <= 0 ? price : price - (price * discount) / 100;

const MXN = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 2,
});

export const formatMXN = (value: number): string => MXN.format(value);
