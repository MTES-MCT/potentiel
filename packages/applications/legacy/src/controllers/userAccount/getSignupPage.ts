import asyncHandler from '../helpers/asyncHandler';
import routes from '../../routes';
import { v1Router } from '../v1Router';
import { SignupPage } from '../../views';
import { Routes } from '@potentiel-applications/routes';

v1Router.get(
  routes.SIGNUP,
  asyncHandler(async (request, response) => {
    const { user, query } = request;

    if (user) {
      return response.redirect(Routes.Auth.redirectToDashboard());
    }

    const validationErrors: Array<{ [fieldName: string]: string }> = Object.entries(query).reduce(
      (errors, [key, value]) => ({
        ...errors,
        ...(key.startsWith('error-') && { [key.replace('error-', '')]: value }),
      }),
      [] as Array<{ [fieldName: string]: string }>,
    );

    return response.send(
      SignupPage({
        request,
        ...(validationErrors.length > 0 && { validationErrors }),
        error: query['error']?.toString(),
        success: query['success']?.toString(),
        ...(query.email
          ? { utilisateurInvité: true, email: query.email.toString() }
          : { utilisateurInvité: false }),
      }),
    );
  }),
);
