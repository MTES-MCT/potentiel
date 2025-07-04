export const signIn = (options?: { callbackUrl?: string; forceProConnect?: true }) => {
  const route = `/auth/signIn`;

  if (!options) {
    return route;
  }

  const params = new URLSearchParams();
  const { callbackUrl, forceProConnect } = options;

  if (callbackUrl) {
    params.set('callbackUrl', callbackUrl);
  }

  if (forceProConnect) {
    params.set('forceProConnect', 'true');
  }

  return `${route}?${params}`;
};

export const signUp = () => `/auth/signUp`;

// The signout page, where the user is redirected after federeated logout
export const signOut = (options?: { callbackUrl?: string; idToken?: string }) => {
  const route = `/auth/signOut`;
  const params = new URLSearchParams(options ?? {});
  return params.size > 0 ? `${route}?${params}` : route;
};

export const redirectToDashboard = () => `/go-to-user-dashboard`;
export const error = () => `/auth/error`;
export const verifyRequest = () => `/auth/verifyRequest`;
