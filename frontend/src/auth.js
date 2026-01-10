export const saveToken = (token) => {
  localStorage.setItem('auth_token', token);
};

export const getToken = () => {
  return localStorage.getItem('auth_token');
};

export const removeToken = () => {
  localStorage.removeItem('auth_token');
};

export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;
  return decodeToken(token);
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return false;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp > currentTime;
};

export const logout = () => {
  removeToken();
  window.location.href = '/';
};
