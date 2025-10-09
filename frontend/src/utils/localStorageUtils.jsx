// Store JWT token
export function setAuthToken(token) {
  localStorage.setItem('authToken', token);
}

// Get JWT token
export function getAuthToken() {
  return localStorage.getItem('authToken');
}

// Remove JWT token
export function clearAuthToken() {
  localStorage.removeItem('authToken');
}
