import routes from '@routes';
import { v1Router } from '../v1Router';
import { ImporterDatesMiseEnServicePage } from '@views';

v1Router.get(routes.GET_IMPORTER_DATES_MISE_EN_SERVICE_PAGE, async (request, response) => {
  const { user } = request;

  // const référence = 'XXX-RP-2021-999999';

  // const result = await executeSelect<DossierRaccordementReadModel>(
  //   `SELECT "key", "value" FROM "PROJECTION" where "key" like $1`,
  //   `dossier-raccordement#%#${référence}`,
  // );

  // console.info(result);

  return response.send(
    ImporterDatesMiseEnServicePage({
      user,
    }),
  );
});
