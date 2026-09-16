(function () {
  'use strict';

  // TODO: Replace these placeholders with your Auth0 tenant values.
  // Create a new Auth0 tenant (or application) and set:
  // - Domain: your-tenant.auth0.com (or custom domain)
  // - Client ID: the SPA application client ID
  // - Callback: https://my-integrity-hub.org/callback
  // - Logout: https://my-integrity-hub.org/
  // - Allowed Web Origins: https://my-integrity-hub.org
  // - Allowed Callback URLs: https://my-integrity-hub.org/callback
  // - Allowed Logout URLs: https://my-integrity-hub.org/
  var AUTH0_DOMAIN = 'YOUR_TENANT.auth0.com';
  var AUTH0_CLIENT_ID = 'ABC123';

  var AUTH_KEY = 'ics_auth_v1';
  var CALLBACK_PATH = '/callback';

  var auth0Client = null;

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

  async function initAuth0() {
    if (auth0Client) return auth0Client;
    if (!window.auth0 || !window.auth0.createAuth0Client) {
      throw new Error('Auth0 SDK not loaded');
    }
    auth0Client = await window.auth0.createAuth0Client({
      domain: AUTH0_DOMAIN,
      clientId: AUTH0_CLIENT_ID,
      authorizationParams: {
        redirect_uri: window.location.origin + CALLBACK_PATH
      },
      cacheLocation: 'localstorage'
    });
    return auth0Client;
  }

  async function handleCallbackIfPresent() {
    if (!/\/callback(\.html)?$/.test(window.location.pathname)) return false;
    try {
      var client = await initAuth0();
      if (window.location.search.includes('code=') || window.location.search.includes('error=')) {
        await client.handleRedirectCallback();
        var user = await client.getUser();
        if (user && user.email) {
          setAuthenticated(user.email);
        } else {
          setAuthenticated('');
        }
        var target = getReturnUrl();
        window.location.replace(target);
        return true;
      }
    } catch (e) {
      console.error('Auth0 callback error', e);
    }
    return false;
  }

  async function ensureAuthenticated() {
    if (isAuthenticated()) return true;
    try {
      var client = await initAuth0();
      var isAuth = await client.isAuthenticated();
      if (isAuth) {
        var user = await client.getUser();
        setAuthenticated(user ? user.email : '');
        return true;
      }
    } catch (e) {
      console.error('Auth0 check error', e);
    }
    redirectToLogin();
    return false;
  }

  async function login() {
    try {
    var client = await initAuth0();
      await client.loginWithRedirect({
        authorizationParams: {
          redirect_uri: window.location.origin + CALLBACK_PATH,
          appState: { target: getReturnUrl() }
        }
      });
    } catch (e) {
      console.error('Login error', e);
      alert('Sign-in failed. Check the Auth0 config in auth.js.');
    }
  }

  async function logout() {
    try {
      var client = await initAuth0();
      clearAuth();
      await client.logout({
        logoutParams: {
          returnTo: window.location.origin + '/'
        }
      });
    } catch (e) {
      clearAuth();
      window.location.replace('/');
    }
  }

  // Expose API
  window.ICSAuth = {
    AUTH0_DOMAIN: AUTH0_DOMAIN,
    AUTH0_CLIENT_ID: AUTH0_CLIENT_ID,
    isAuthenticated: isAuthenticated,
    setAuthenticated: setAuthenticated,
    clearAuth: clearAuth,
    getReturnUrl: getReturnUrl,
    redirectToLogin: redirectToLogin,
    login: login,
    logout: logout,
    initAuth0: initAuth0,
    handleCallbackIfPresent: handleCallbackIfPresent,
    ensureAuthenticated: ensureAuthenticated
  };

  // Auto-run on load
  (async function () {
    var handled = await handleCallbackIfPresent();
    if (handled) return;
    if (!/\/callback(\.html)?$/.test(window.location.pathname)) {
      await ensureAuthenticated();
    }
  })();
})();
