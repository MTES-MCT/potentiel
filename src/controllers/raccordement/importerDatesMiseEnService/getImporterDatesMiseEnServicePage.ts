import { PermissionTransmettreDateMiseEnService } from '@potentiel/legacy-permissions';

import { v1Router } from '../../v1Router';
import { ImporterDatesMiseEnServicePage } from '../../../views';
import { getApiResult } from '../../helpers/apiResult';
import { ImporterDatesMiseEnServiceApiResult } from './importerDatesMiseEnServiceApiResult';
import { CsvError } from '../../helpers/mapCsvYupValidationErrorToCsvErrors';
import { vérifierPermissionUtilisateur } from '../../helpers';

import {
  GET_IMPORT_DATES_MISE_EN_SERVICE,
  POST_IMPORT_DATES_MISE_EN_SERVICE,
} from '@potentiel/legacy-routes';

v1Router.get(
  GET_IMPORT_DATES_MISE_EN_SERVICE,
  vérifierPermissionUtilisateur(PermissionTransmettreDateMiseEnService),
  async (request, response) => {
    const { user } = request;

    const apiResult = getApiResult<ImporterDatesMiseEnServiceApiResult>(
      request,
      POST_IMPORT_DATES_MISE_EN_SERVICE,
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
