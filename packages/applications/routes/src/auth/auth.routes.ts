export const signIn = (options?: {
  callbackUrl?: string;
  showProConnect?: boolean;
  proConnectNotAvailableForUser?: boolean;
}) => {
  const route = `/auth/signIn`;

  if (!options) {
    return route;
  }

  const params = new URLSearchParams();
  const { callbackUrl, proConnectNotAvailableForUser, showProConnect } = options;

  if (callbackUrl) {
    params.set('callbackUrl', callbackUrl);
  }

  if (proConnectNotAvailableForUser) {
    params.set('proConnectNotAvailableForUser', 'true');
  }

  if (showProConnect) {
    params.set('showProConnect', 'true');
  }

  return `${route}?${params}`;
};

// The signout page, where the user is redirected after federeated logout
export const signOut = (callbackUrl?: string) => {
  const route = `/auth/signOut`;
  if (!callbackUrl) return route;
  const params = new URLSearchParams({ callbackUrl });
  return `${route}?${params}`;
};

export const redirectToDashboard = () => `/go-to-user-dashboard`;
export const unauthorized = () => `/auth/unauthorized`;
