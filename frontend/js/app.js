// Initialize Framework7 app
const app = new Framework7({
  el: '#app',
  name: 'Telegram Broadcast',
  theme: 'auto',
  routes: routes,

  // Panel settings
  panel: {
    swipe: true,
    swipeOnlyClose: true
  },

  // View settings
  view: {
    pushState: true,
    pushStateRoot: window.location.pathname.split('index.html')[0],
    pushStateSeparator: '#'
  },

  // Toast settings
  toast: {
    closeTimeout: 3000,
    position: 'center'
  }
});

// Main view
const mainView = app.views.create('.view-main', {
  url: '/'
});

// Global app instance
window.app = app;
window.mainView = mainView;

// Auto-login check on app init
app.on('init', () => {
  console.log('App initialized');

  // Check if user is already logged in
  const token = authService.getToken();
  if (token && window.location.hash !== '#/login') {
    // User has token, redirect to chats
    mainView.router.navigate('/chats', {
      animate: false
    });
  } else if (!token && window.location.hash !== '#/login') {
    // No token, redirect to login
    mainView.router.navigate('/login', {
      animate: false
    });
  }
});

// Global logout function
window.logout = function() {
  app.dialog.confirm('Вы уверены что хотите выйти?', 'Выход', () => {
    authService.removeToken();
    storage.clear();
    mainView.router.navigate('/login', {
      clearPreviousHistory: true
    });
    app.toast.create({
      text: 'Вы вышли из системы',
      position: 'center',
      closeTimeout: 2000
    }).open();
  });
};

// Global error handler
window.handleApiError = function(error) {
  console.error('API Error:', error);

  // Check if token expired (401)
  if (error.message && error.message.includes('401')) {
    app.dialog.alert('Сессия истекла. Пожалуйста войдите снова.', 'Ошибка', () => {
      authService.removeToken();
      mainView.router.navigate('/login', {
        clearPreviousHistory: true
      });
    });
    return;
  }

  // Show generic error
  app.toast.create({
    text: error.message || 'Произошла ошибка',
    position: 'center',
    closeTimeout: 3000,
    cssClass: 'toast-error'
  }).open();
};

// Helper: Show success toast
window.showSuccess = function(message) {
  app.toast.create({
    text: message,
    position: 'center',
    closeTimeout: 2000,
    cssClass: 'toast-success'
  }).open();
};

// Helper: Show loading
window.showLoading = function(text = 'Загрузка...') {
  app.preloader.show();
};

window.hideLoading = function() {
  app.preloader.hide();
};

console.log('Framework7 app ready');
