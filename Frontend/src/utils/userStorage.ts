export interface StoredUserData {
  profileForm?: any;
  profilePayload?: any;
  moneyHealthResult?: any;
  firePlanResult?: any;
  mentorSummaryResult?: any;
  portfolioResult?: any;
}

export function getUserStorageKey(email: string) {
  return `userData:${email}`;
}

export function getUserData(email: string): StoredUserData | null {
  const raw = localStorage.getItem(getUserStorageKey(email));
  return raw ? JSON.parse(raw) : null;
}

export function saveUserData(email: string, data: StoredUserData) {
  const existing = getUserData(email) || {};
  const merged = { ...existing, ...data };
  localStorage.setItem(getUserStorageKey(email), JSON.stringify(merged));
}

export function clearUserData(email: string) {
  localStorage.removeItem(getUserStorageKey(email));
}