export const signIn = (callbackUrl?: string) => {
  const route = `/auth/signIn`;
  if (!callbackUrl) return route;
  const params = new URLSearchParams({ callbackUrl });
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
