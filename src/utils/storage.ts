export const getStoredUserId = (): number => {
  const storedValue = localStorage.getItem("userId");
  return storedValue ? Number(storedValue) : NaN;
};

export const getStoredUserName = (): string => {
  return localStorage.getItem("name") || "User";
};

export const setStoredUserId = (userId: number): void => {
  localStorage.setItem("userId", userId.toString());
};

export const setStoredUserName = (name: string): void => {
  localStorage.setItem("name", name);
};
