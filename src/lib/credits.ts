/**
 * Модуль проверки и управления кредитами пользователей
 * Каждый запрос к AI расходует 1 кредит
 *
 * Directive V8.7: userId === 1 имеет безлимитный доступ
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

/** ID пользователей с безлимитным доступом */
const UNLIMITED_USER_IDS = [1];

/**
 * Проверяет, есть ли у пользователя доступные кредиты.
 * Пользователи из UNLIMITED_USER_IDS имеют безлимитный доступ.
 */
export async function checkCredits(userId: number): Promise<boolean> {
  // Безлимитный доступ для привилегированных пользователей
  if (UNLIMITED_USER_IDS.includes(userId)) {
    return true;
  }

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
 * Списывает 1 кредит у пользователя.
 * Для безлимитных пользователей кредиты не списываются.
 */
export async function deductCredit(userId: number): Promise<boolean> {
  // Безлимитные пользователи — не списываем
  if (UNLIMITED_USER_IDS.includes(userId)) {
    return true;
  }

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
  // Для безлимитных пользователей возвращаем Infinity
  if (UNLIMITED_USER_IDS.includes(userId)) {
    return Infinity;
  }

  const userCredits = userCreditsStore.get(userId);
  return userCredits?.credits ?? 0;
}
