// API service
const API_BASE_URL = 'http://localhost:3000/api';

const api = {
  // Общий fetch wrapper
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = authService.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  },

  // GET request
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  // POST request
  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  // PUT request
  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  // DELETE request
  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  // PATCH request
  patch(endpoint, body) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body)
    });
  },

  // Auth API
  auth: {
    register(username, email, password) {
      return api.post('/auth/register', { username, email, password });
    },
    login(username, password) {
      return api.post('/auth/login', { username, password });
    },
    refresh() {
      return api.post('/auth/refresh', {});
    }
  },

  // Chats API
  chats: {
    getAll() {
      return api.get('/chats');
    },
    getById(id) {
      return api.get(`/chats/${id}`);
    },
    create(chat_id, chat_name, description) {
      return api.post('/chats', { chat_id, chat_name, description });
    },
    update(id, chat_name, description) {
      return api.put(`/chats/${id}`, { chat_name, description });
    },
    delete(id) {
      return api.delete(`/chats/${id}`);
    },
    toggle(id, is_active) {
      return api.patch(`/chats/${id}/toggle`, { is_active });
    }
  },

  // Templates API
  templates: {
    getAll() {
      return api.get('/templates');
    },
    getBySlot(slot) {
      return api.get(`/templates/${slot}`);
    },
    save(slot_number, title, content, variables) {
      return api.post('/templates', { slot_number, title, content, variables });
    },
    delete(slot) {
      return api.delete(`/templates/${slot}`);
    }
  },

  // Broadcast API
  broadcast: {
    preview(content, variables, chatIds) {
      return api.post('/broadcast/preview', { content, variables, chatIds });
    },
    send(content, chatIds, templateId) {
      return api.post('/broadcast/send', { content, chatIds, templateId });
    },
    getHistory(limit = 50) {
      return api.get(`/broadcast/history?limit=${limit}`);
    },
    getById(id) {
      return api.get(`/broadcast/${id}`);
    },
    getDetails(id) {
      return api.get(`/broadcast/${id}/details`);
    }
  },

  // Settings API
  settings: {
    getBot() {
      return api.get('/settings/bot');
    },
    updateBot(bot_token) {
      return api.put('/settings/bot', { bot_token });
    },
    testBot() {
      return api.post('/settings/bot/test', {});
    },
    getProfile() {
      return api.get('/settings/profile');
    },
    updatePassword(old_password, new_password) {
      return api.put('/settings/password', { old_password, new_password });
    }
  }
};
