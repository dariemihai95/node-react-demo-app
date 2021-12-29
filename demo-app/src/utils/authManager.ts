export const setLocalStorageToken = (token: string): void => {
  localStorage.setItem('jwt', token)
}

export const getLocalStorageToken = (): string => {
  const jwt = localStorage.getItem('jwt');
  if (jwt == null) {
    return '';
  } else {
    return jwt;
  }
}

export const removeLocalStorageToken = (): void => {
  localStorage.removeItem('jwt')
}

export const isAuth = (): boolean => {
  const authToken = getLocalStorageToken();
  if (authToken) {
    return true;
  }
  return false;
}