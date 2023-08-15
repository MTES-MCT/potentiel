import routes from '../../../routes';
import { PermissionTransmettreDateMiseEnService } from '@potentiel/domain';

import { v1Router } from '../../v1Router';
import { ImporterDatesMiseEnServicePage } from '../../../views';
import { getApiResult } from '../../helpers/apiResult';
import { ImporterDatesMiseEnServiceApiResult } from './importerDatesMiseEnServiceApiResult';
import { CsvError } from '../../helpers/mapCsvYupValidationErrorToCsvErrors';
import { vérifierPermissionUtilisateur } from '../../helpers';

v1Router.get(
  routes.GET_IMPORTER_DATES_MISE_EN_SERVICE_PAGE,
  vérifierPermissionUtilisateur(PermissionTransmettreDateMiseEnService),
  async (request, response) => {
    const { user } = request;

    const apiResult = getApiResult<ImporterDatesMiseEnServiceApiResult>(
      request,
      routes.POST_IMPORTER_DATES_MISE_EN_SERVICE,
    );

    const résultatImport = apiResult?.status === 'OK' ? apiResult.result : undefined;

    return response.send(
      ImporterDatesMiseEnServicePage({
        user,
        résultatImport,
        csvErrors:
          apiResult?.status === 'BAD_REQUEST' && apiResult.formErrors
            ? (apiResult.formErrors['fichier-dates-mise-en-service'] as ReadonlyArray<CsvError>)
            : [],
      }),
    );
  },
);
