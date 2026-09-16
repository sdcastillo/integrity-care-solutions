(function () {
  'use strict';

  // TODO: Replace with your real Google OAuth client ID from Google Cloud Console.
  // Create a new OAuth 2.0 Client ID (Web application) in the same project you used
  // for predictiveinsightsai.com. Add https://my-integrity-hub.org as an Authorized
  // JavaScript origin. The callback path is /callback (see callback.html).
  var CLIENT_ID = 'ABC123';

  var AUTH_KEY = 'ics_auth_v1';
  var CALLBACK_PATH = '/callback';

  function isAuthenticated() {
    try {
      return localStorage.getItem(AUTH_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function setAuthenticated(email) {
    try {
      localStorage.setItem(AUTH_KEY, '1');
      if (email) localStorage.setItem(AUTH_KEY + '_email', email);
    } catch (e) {}
  }

  function clearAuth() {
    try {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(AUTH_KEY + '_email');
    } catch (e) {}
  }

  function isGmail(email) {
    return typeof email === 'string' && /@gmail\.com$/i.test(email.trim());
  }

  function getReturnUrl() {
    var params = new URLSearchParams(window.location.search);
    var ret = params.get('return');
    if (ret && ret.charAt(0) === '/' && ret.indexOf('//') !== 0) {
      return ret;
    }
    return '/';
  }

  function redirectToLogin() {
    var ret = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.replace(CALLBACK_PATH + '?return=' + ret);
  }

  // Expose a small API for the login page.
  window.ICSAuth = {
    CLIENT_ID: CLIENT_ID,
    isAuthenticated: isAuthenticated,
    setAuthenticated: setAuthenticated,
    clearAuth: clearAuth,
    isGmail: isGmail,
    getReturnUrl: getReturnUrl,
    redirectToLogin: redirectToLogin
  };

  // Gate: if not authenticated, send to the login/callback page.
  // Skip the gate on the callback page itself.
  if (!/\/callback(\.html)?$/.test(window.location.pathname) && !isAuthenticated()) {
    redirectToLogin();
  }
})();
