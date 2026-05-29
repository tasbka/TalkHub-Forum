// src/api/simpleClient.js
const API_BASE_URL = 'http://localhost:5234/api';

const getAuthHeaders = () => {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            if (user && user.id) {
                headers['X-User-Id'] = user.id;
                console.log('X-User-Id header set:', user.id);
            }
        } catch (e) {
            console.error('Error parsing user from localStorage:', e);
        }
    }
    
    return headers;
};

const simpleClient = {
    get: async (endpoint) => {
        const url = `${API_BASE_URL}${endpoint}`;
        console.log(`GET: ${url}`);
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: getAuthHeaders()  
            });
            
            console.log(`GET response status: ${response.status}`);
            
            if (response.status === 204 || response.headers.get('content-length') === '0') {
                return { success: true, data: null };
            }
            
            const text = await response.text();
            console.log(`GET response text: ${text.substring(0, 500)}`);
            
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
                headers: getAuthHeaders(),  
                body: JSON.stringify(body),
                credentials: 'include'
            });
            
            console.log(`POST response status: ${response.status}`);
            
            const text = await response.text();
            console.log(`POST response text: ${text.substring(0, 500)}`);
            
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
    
    put: async (endpoint, body) => {
        const url = `${API_BASE_URL}${endpoint}`;
        console.log(`PUT: ${url}`, body);
        
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(body)
            });
            
            const text = await response.text();
            let result;
            try {
                result = JSON.parse(text);
            } catch (e) {
                result = { success: true, message: text };
            }
            
            if (!response.ok) {
                throw new Error(result.message || `HTTP error ${response.status}`);
            }
            
            return result;
        } catch (error) {
            console.error(`PUT ${url} error:`, error);
            throw error;
        }
    },
    
    delete: async (endpoint, body = null) => {
        try {
            console.log(`DELETE ${API_BASE_URL}${endpoint}`);
            const options = {
                method: 'DELETE',
                headers: getAuthHeaders(), 
                credentials: 'include'
            };
            
            if (body) {
                options.headers['Content-Type'] = 'application/json';
                options.body = JSON.stringify(body);
            }
            
            const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
            
            const text = await response.text();
            console.log('Raw response:', text);
            
            let result;
            try {
                result = JSON.parse(text);
            } catch (e) {
                result = { success: true, message: text };
            }
            
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
            console.log(`PATCH ${API_BASE_URL}${endpoint}`);
            const options = {
                method: 'PATCH',
                headers: getAuthHeaders(),  
                body: body ? JSON.stringify(body) : undefined
            };
            
            const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || `HTTP error ${response.status}`);
            }
            return data;
        } catch (error) {
            console.error(`PATCH ${endpoint} error:`, error);
            throw error;
        }
    }
};

export default simpleClient;