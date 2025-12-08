// Check if user is authenticated
export function isAuthenticated() {
  const token = localStorage.getItem("token");
  return !!token;
}

// Redirect to login if not authenticated
export function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = "/login";
    return false;
  }
  return true;
}

// Clear auth data and redirect to login
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  window.location.href = "/login";
}

// Get token for debugging
export function getToken() {
  return localStorage.getItem("token");
}
