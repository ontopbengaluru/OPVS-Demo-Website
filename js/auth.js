/**
 * OPVS – auth.js
 * Demo authentication using sessionStorage. No real security.
 */

const OPVS_AUTH = {

  login(username, password, role) {
    const user = OPVS_DATA.users.find(u =>
      u.username === username.trim() &&
      u.password === password.trim() &&
      u.role === role
    );
    if (user) {
      sessionStorage.setItem('opvs_user', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false };
  },

  logout() {
    sessionStorage.removeItem('opvs_user');
    window.location.href = 'index.html';
  },

  currentUser() {
    const raw = sessionStorage.getItem('opvs_user');
    return raw ? JSON.parse(raw) : null;
  },

  requireLogin() {
    const user = this.currentUser();
    if (!user) {
      window.location.href = 'index.html';
      return null;
    }
    return user;
  },

  requireRole(roles) {
    const user = this.requireLogin();
    if (!user) return null;
    if (!roles.includes(user.role)) {
      window.location.href = 'dashboard.html';
      return null;
    }
    return user;
  }
};
