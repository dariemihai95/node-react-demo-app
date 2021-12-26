export const setAuthToken = (token: string): void => {
  localStorage.setItem('jwt', token)
}

export const getAuthToken = (): string => {
  const jwt = localStorage.getItem('jwt');
  if (jwt == null) {
    return '';
  } else {
    return jwt;
  }
}

export const removeAuthToken = (): void => {
  localStorage.removeItem('jwt')
}

export const isAuth = (): boolean => {
  const authToken = getAuthToken();
  if (authToken) {
    return true;
  }
  return false;
}