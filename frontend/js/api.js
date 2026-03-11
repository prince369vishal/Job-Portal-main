/**
 * GetJob - API Client
 * Handles all backend API communication using Fetch API
 */

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const baseUrl = typeof CONFIG !== 'undefined' ? CONFIG.API_BASE_URL : 'http://localhost:8080/api';
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    throw new Error(data.message || data.error || 'Request failed');
  }
  
  return data;
};

// Auth API
const authApi = {
  signup: (data) => apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  signin: (email, password) => apiRequest('/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
};

// Profile API
const profileApi = {
  getByUserId: (userId) => apiRequest(`/profiles/user/${userId}`),
  updateBasicInfo: (userId, data) => apiRequest(`/profiles/user/${userId}/basic`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  addEducation: (profileId, data) => apiRequest(`/profiles/${profileId}/education`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  addExperience: (profileId, data) => apiRequest(`/profiles/${profileId}/experience`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateSkills: (profileId, data) => apiRequest(`/profiles/${profileId}/skills`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
};

// Jobs API
const jobsApi = {
  getAll: () => apiRequest('/jobs'),
  getFeatured: () => apiRequest('/jobs/featured'),
  getById: (id) => apiRequest(`/jobs/${id}`)
};

// Organizations API
const orgsApi = {
  getAll: () => apiRequest('/organizations'),
  getById: (id) => apiRequest(`/organizations/${id}`)
};
