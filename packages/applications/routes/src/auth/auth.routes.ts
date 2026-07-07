import { withFilters } from '../_helpers/withFilters.js';

export const signIn = withFilters<{ forceProConnect?: true }>(`/auth/signIn`);
export const signUp = () => `/auth/signUp`;
export const signOut = () => `/auth/signOut`;
export const redirectToDashboard = () => `/go-to-user-dashboard`;
export const error = () => `/auth/error`;
export const verifyRequest = () => `/auth/verifyRequest`;
