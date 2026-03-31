/**
 * Модуль проверки и управления кредитами пользователей
 * Каждый запрос к AI расходует 1 кредит
 */

interface UserCredits {
  userId: number;
  credits: number;
  maxCredits: number;
}

// Симуляция БД кредитов
const userCreditsStore: Map<number, UserCredits> = new Map([
  [1, { userId: 1, credits: 100, maxCredits: 1000 }],
  [2, { userId: 2, credits: 50, maxCredits: 100 }],
]);

/**
 * Проверяет, есть ли у пользователя доступные кредиты
 */
export async function checkCredits(userId: number): Promise<boolean> {
  const userCredits = userCreditsStore.get(userId);

  if (!userCredits) {
    console.warn(`Пользователь ${userId} не найден в системе кредитов`);
    return false;
  }

  if (userCredits.credits <= 0) {
    console.warn(`У пользователя ${userId} закончились кредиты`);
    return false;
  }

  return true;
}

/**
 * Списывает 1 кредит у пользователя
 */
export async function deductCredit(userId: number): Promise<boolean> {
  const userCredits = userCreditsStore.get(userId);

  if (!userCredits) {
    return false;
  }

  if (userCredits.credits <= 0) {
    return false;
  }

  userCredits.credits -= 1;
  userCreditsStore.set(userId, userCredits);

  return true;
}

/**
 * Получает текущий баланс кредитов пользователя
 */
export async function getCreditBalance(userId: number): Promise<number> {
  const userCredits = userCreditsStore.get(userId);
  return userCredits?.credits ?? 0;
}
