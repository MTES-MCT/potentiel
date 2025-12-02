type SignInProps = {
  forceProConnect?: true;
};

export const signIn = (options?: SignInProps) => {
  const route = `/auth/signIn`;

  if (!options) {
    return route;
  }

  const params = new URLSearchParams();
  const { forceProConnect } = options;

  if (forceProConnect) {
    params.set('forceProConnect', 'true');
  }

  return `${route}?${params}`;
};

export const signUp = () => `/auth/signUp`;

// The signout page, where the user is redirected after federeated logout
type SignOutProps = {
  idToken?: string;
};

export const signOut = (options?: SignOutProps) => {
  const route = `/auth/signOut`;
  const params = new URLSearchParams(options ?? {});
  return params.size > 0 ? `${route}?${params}` : route;
};

export const redirectToDashboard = () => `/go-to-user-dashboard`;
export const error = () => `/auth/error`;
export const verifyRequest = () => `/auth/verifyRequest`;
