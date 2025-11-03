// API Configuration
// Nếu deploy cùng backend, API sẽ ở cùng domain
// Development: http://localhost:3001
// Production: cùng domain với frontend (tự động detect)
const getBaseURL = () => {
  // Nếu có environment variable thì dùng
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Nếu đang ở production (cùng domain với backend)
  if (import.meta.env.PROD) {
    // API ở cùng domain, chỉ cần relative path
    return '';
  }
  
  // Development: localhost
  return 'http://localhost:3001';
};

export const API_BASE_URL = getBaseURL();

// Helper để tạo full URL
export const getApiUrl = (endpoint) => {
  if (API_BASE_URL) {
    return `${API_BASE_URL}${endpoint}`;
  }
  return endpoint;
};

