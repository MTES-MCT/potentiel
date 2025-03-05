export const signIn = (options?: {
  callbackUrl?: string;
  showProConnect?: boolean;
  error?: string;
}) => {
  const route = `/auth/signIn`;

  if (!options) {
    return route;
  }

  const params = new URLSearchParams();
  const { callbackUrl, showProConnect, error } = options;

  if (callbackUrl) {
    params.set('callbackUrl', callbackUrl);
  }

  if (error) {
    params.set('error', error);
  }

  if (showProConnect) {
    params.set('showProConnect', 'true');
  }

  return `${route}?${params}`;
};

// The signout page, where the user is redirected after federeated logout
export const signOut = (options?: {
  callbackUrl?: string;
  idToken?: string;
  proConnectNotAvailableForUser?: boolean;
}) => {
  const route = `/auth/signOut`;
  const { proConnectNotAvailableForUser, ...stringOptions } = options ?? {};
  const params = new URLSearchParams(stringOptions);
  if (proConnectNotAvailableForUser) {
    params.set('proConnectNotAvailableForUser', 'true');
  }
  return params.size > 0 ? `${route}?${params}` : route;
};

export const redirectToDashboard = () => `/go-to-user-dashboard`;
export const unauthorized = () => `/auth/unauthorized`;
export const verifyRequest = () => `/auth/verifyRequest`;
