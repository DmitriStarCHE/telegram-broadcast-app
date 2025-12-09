// Authentication service
const authService = {
  TOKEN_KEY: 'auth_token',
  USER_KEY: 'user_data',

  // Сохранить токен
  saveToken(token) {
    storage.set(this.TOKEN_KEY, token);
  },

  // Получить токен
  getToken() {
    return storage.get(this.TOKEN_KEY);
  },

  // Удалить токен
  removeToken() {
    storage.remove(this.TOKEN_KEY);
  },

  // Сохранить данные пользователя
  saveUser(user) {
    storage.set(this.USER_KEY, user);
  },

  // Получить данные пользователя
  getUser() {
    return storage.get(this.USER_KEY);
  },

  // Удалить данные пользователя
  removeUser() {
    storage.remove(this.USER_KEY);
  },

  // Проверка авторизации
  isAuthenticated() {
    return !!this.getToken();
  },

  // Logout
  logout() {
    this.removeToken();
    this.removeUser();
  }
};
