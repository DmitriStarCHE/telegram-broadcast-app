// Routes configuration for Framework7
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    url: './pages/login.html',
    options: {
      animate: false
    }
  },
  {
    path: '/chats',
    url: './pages/chats.html',
    options: {
      transition: 'f7-dive'
    }
  },
  {
    path: '/templates',
    url: './pages/templates.html',
    options: {
      transition: 'f7-dive'
    }
  },
  {
    path: '/broadcast',
    url: './pages/broadcast.html',
    options: {
      transition: 'f7-dive'
    }
  },
  {
    path: '/settings',
    url: './pages/settings.html',
    options: {
      transition: 'f7-dive'
    }
  }
];
