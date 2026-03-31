/**
 * Модуль проверки и управления балансом пользователей
 * Списание производится в рублях (₽) согласно тарифам услуг
 *
 * Admin override: ADMIN_USER_IDS имеют безлимитный доступ
 */

import { PRICING, type ServiceType } from './pricing';

interface UserCredits {
  userId: number;
  credits: number;
  maxCredits: number;
}

/** ID пользователей с безлимитным доступом (admin override) */
const ADMIN_USER_IDS = [1, 2061792301];

/**
 * Проверяет, является ли пользователь администратором
 */
export function isAdmin(userId: number): boolean {
  return ADMIN_USER_IDS.includes(userId);
}

// Симуляция БД балансов пользователей (значения в рублях)
const userCreditsStore: Map<number, UserCredits> = new Map([
  [1, { userId: 1, credits: 0, maxCredits: 1000 }],
  [2, { userId: 2, credits: 5000, maxCredits: 100000 }],
  [2061792301, { userId: 2061792301, credits: 0, maxCredits: 1000 }],
]);

/**
 * Проверяет, достаточно ли средств у пользователя для выполнения операции.
 * Администраторы имеют безлимитный доступ.
 */
export async function checkCredits(userId: number, serviceType?: ServiceType): Promise<boolean> {
  // Безлимитный доступ для администраторов
  if (isAdmin(userId)) {
    return true;
  }

  const userCredits = userCreditsStore.get(userId);

  if (!userCredits) {
    console.warn(`Пользователь ${userId} не найден в системе`);
    return false;
  }

  const cost = serviceType ? PRICING[serviceType] : 1;

  if (userCredits.credits < cost) {
    console.warn(`У пользователя ${userId} недостаточно средств (баланс: ${userCredits.credits} ₽, требуется: ${cost} ₽)`);
    return false;
  }

  return true;
}

/**
 * Списывает стоимость услуги с баланса пользователя.
 * Для администраторов средства не списываются.
 */
export async function deductCredit(userId: number, serviceType?: ServiceType): Promise<boolean> {
  // Администраторы — не списываем
  if (isAdmin(userId)) {
    return true;
  }

  const userCredits = userCreditsStore.get(userId);

  if (!userCredits) {
    return false;
  }

  const cost = serviceType ? PRICING[serviceType] : 1;

  if (userCredits.credits < cost) {
    return false;
  }

  userCredits.credits -= cost;
  userCreditsStore.set(userId, userCredits);

  return true;
}

/**
 * Получает текущий баланс пользователя в рублях
 */
export async function getCreditBalance(userId: number): Promise<number> {
  // Для администраторов возвращаем Infinity (отображается как «∞»)
  if (isAdmin(userId)) {
    return Infinity;
  }

  const userCredits = userCreditsStore.get(userId);
  return userCredits?.credits ?? 0;
}
