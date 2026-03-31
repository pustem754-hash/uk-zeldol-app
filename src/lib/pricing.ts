/**
 * Константы ценообразования — Marquis AI
 * Все цены указаны в рублях (₽)
 */

export const PRICING = {
  PHOTO: 149,
  VIDEO: 399,
  BACKGROUND_REMOVAL: 29,
  ALL_IN_ONE: 499,
} as const;

export const PRICING_DISPLAY = {
  PHOTO: '149 ₽',
  VIDEO: '399 ₽',
  BACKGROUND_REMOVAL: '29 ₽',
  ALL_IN_ONE: '499 ₽',
} as const;

export type ServiceType = keyof typeof PRICING;

/**
 * Получает стоимость услуги по типу
 */
export function getServicePrice(serviceType: ServiceType): number {
  return PRICING[serviceType];
}

/**
 * Получает отображаемую стоимость услуги
 */
export function getServicePriceDisplay(serviceType: ServiceType): string {
  return PRICING_DISPLAY[serviceType];
}

/**
 * Форматирует сумму в рублях для отображения
 */
export function formatRubles(amount: number): string {
  return `${amount} ₽`;
}
