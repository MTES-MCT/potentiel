import asyncHandler from '../../helpers/asyncHandler';
import { ensureRole, getPartnersList } from '../../../config';
import { v1Router } from '../../v1Router';
import { PartnersListPage } from '../../../views';
import { GET_LISTE_PARTENAIRES } from '@potentiel/legacy-routes';

v1Router.get(
  GET_LISTE_PARTENAIRES,
  ensureRole(['admin', 'dgec-validateur']),
  asyncHandler(async (request, response) => {
    const { query } = request;
    const validationErrors: Array<{ [fieldName: string]: string }> = Object.entries(query).reduce(
      (errors, [key, value]) => ({
        ...errors,
        ...(key.startsWith('error-') && { [key.replace('error-', '')]: value }),
      }),
      [] as Array<{ [fieldName: string]: string }>,
    );
    const users = await getPartnersList();

    return response.send(PartnersListPage({ request, users, validationErrors }));
  }),
);
