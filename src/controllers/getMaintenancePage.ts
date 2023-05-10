import asyncHandler from './helpers/asyncHandler';
import routes from '@routes';
import { MaintenancePage } from '@views';
import { v1Router } from './v1Router';

v1Router.get(
  routes.GET_MAINTENANCE_PAGE,
  asyncHandler(async (request, response) => {
    if (!process.env.MAINTENANCE_DATE) {
      return response.redirect(routes.HOME);
    }

    return response.send(
      MaintenancePage({
        dateFinMaintenance: process.env.MAINTENANCE_DATE!,
      }),
    );
  }),
);
