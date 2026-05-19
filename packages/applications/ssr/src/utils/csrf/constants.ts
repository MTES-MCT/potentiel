// the secret cookie, generated per user session (http only : true)
export const CSRF_SECRET_COOKIE = '__Host-csrf-secret';
// the token cookie, generated per page load (http only : false)
export const CSRF_TOKEN_COOKIE = 'csrf-token';
export const CSRF_FORM_FIELD = 'csrf_token';
