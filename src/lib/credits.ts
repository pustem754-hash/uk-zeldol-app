/**
 * Модуль проверки и управления балансом пользователей
 * Списание производится в рублях (₽) согласно тарифам услуг
 *
 * Directive V8.7: userId === 1 имеет безлимитный доступ
 */

import { PRICING, type ServiceType } from './pricing';

interface UserCredits {
  userId: number;
  credits: number;
  maxCredits: number;
}

/** ID пользователей с безлимитным доступом */
const UNLIMITED_USER_IDS = [1];

// Симуляция БД балансов пользователей (значения в рублях)
const userCreditsStore: Map<number, UserCredits> = new Map([
  [1, { userId: 1, credits: 0, maxCredits: 1000 }],
  [2, { userId: 2, credits: 5000, maxCredits: 100000 }],
]);

/**
 * Проверяет, достаточно ли средств у пользователя для выполнения операции.
 * Пользователи из UNLIMITED_USER_IDS имеют безлимитный доступ.
 */
export async function checkCredits(userId: number, serviceType?: ServiceType): Promise<boolean> {
  // Безлимитный доступ для привилегированных пользователей
  if (UNLIMITED_USER_IDS.includes(userId)) {
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
 * Для безлимитных пользователей средства не списываются.
 */
export async function deductCredit(userId: number, serviceType?: ServiceType): Promise<boolean> {
  // Безлимитные пользователи — не списываем
  if (UNLIMITED_USER_IDS.includes(userId)) {
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
  // Для безлимитных пользователей возвращаем 0 (отображается как «0 ₽»)
  if (UNLIMITED_USER_IDS.includes(userId)) {
    return 0;
  }

  const userCredits = userCreditsStore.get(userId);
  return userCredits?.credits ?? 0;
}
