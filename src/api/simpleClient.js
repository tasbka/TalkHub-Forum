// src/api/simpleClient.js
const API_BASE_URL = 'http://localhost:5234/api';

const simpleClient = {
  get: async (endpoint) => {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`GET: ${url}`);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`GET response status: ${response.status}`);
      
      // Если ответ пустой
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return { success: true, data: null };
      }
      
      const text = await response.text();
      console.log(`GET response text: ${text}`);
      
      if (!text) {
        throw new Error('Empty response from server');
      }
      
      const result = JSON.parse(text);
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP error ${response.status}`);
      }
      
      return result;
    } catch (error) {
      console.error(`GET ${url} error:`, error);
      throw error;
    }
  },
  
  post: async (endpoint, body) => {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`POST: ${url}`, body);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body),
         credentials: 'include'
      });
      
      console.log(`POST response status: ${response.status}`);
      
      const text = await response.text();
      console.log(`POST response text: ${text}`);
      
      if (!text) {
        throw new Error('Empty response from server');
      }
      
      const result = JSON.parse(text);
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP error ${response.status}`);
      }
      
      return result;
    } catch (error) {
      console.error(`POST ${url} error:`, error);
      throw error;
    }
  },
  
  delete: async (endpoint, body = null) => {
  try {
      const options = {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'include'
      };
      
      if (body) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP error ${response.status}`);
      }
      
      return result;
    } catch (error) {
      console.error(`DELETE ${endpoint} error:`, error);
      throw error;
    }
  },

  patch: async (endpoint, body) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP error ${response.status}`);
      }
      
      return result;
    } catch (error) {
      console.error(`PATCH ${endpoint} error:`, error);
      throw error;
    }
  }
};

export default simpleClient;