import routes from '@routes';
import { v1Router } from '../../v1Router';
import { ImporterDatesMiseEnServicePage } from '@views';
import { getApiResult } from '../../helpers/apiResult';
import { Project } from '@infra/sequelize';
import {
  ImporterDatesMiseEnServiceApiResult,
  isRéussi,
  isÉchec,
  Échec,
} from './importerDatesMiseEnServiceApiResult';
import { CsvError } from '../../helpers/mapCsvYupValidationErrorToCsvErrors';

v1Router.get(routes.GET_IMPORTER_DATES_MISE_EN_SERVICE_PAGE, async (request, response) => {
  const { user } = request;

  const apiResult = getApiResult<ImporterDatesMiseEnServiceApiResult>(
    request,
    routes.POST_IMPORTER_DATES_MISE_EN_SERVICE,
  );

  const résultatImport = apiResult?.status === 'OK' ? apiResult.result : undefined;
  const importsRéussis = résultatImport?.filter(isRéussi) ?? [];
  const importsEnÉchec = résultatImport?.filter(isÉchec) ?? [];

  const importsEnÉchecMapped = await ajoutInfoProjetDesImportEnÉchec(importsEnÉchec);

  return response.send(
    ImporterDatesMiseEnServicePage({
      user,
      résultatImport: [...importsRéussis, ...importsEnÉchecMapped],
      csvErrors:
        apiResult?.status === 'BAD_REQUEST' && apiResult.formErrors
          ? (apiResult.formErrors['fichier-dates-mise-en-service'] as ReadonlyArray<CsvError>)
          : [],
    }),
  );
});

const ajoutInfoProjetDesImportEnÉchec = (importsEnÉchec: ReadonlyArray<Échec>) =>
  Promise.all(
    importsEnÉchec.map(async ({ référenceDossier, statut, raison, identifiantsProjet }) => {
      const projets = await Promise.all(
        identifiantsProjet.map(async (identifiantProjet) => {
          const projet = await Project.findOne({
            where: {
              appelOffreId: identifiantProjet.appelOffre,
              periodeId: identifiantProjet.période,
              familleId: identifiantProjet.famille,
              numeroCRE: identifiantProjet.numéroCRE,
            },
          });

          return projet
            ? {
                id: projet.id,
                nom: projet.nomProjet,
              }
            : null;
        }),
      );

      return {
        référenceDossier,
        statut,
        raison,
        projets: projets.filter(
          (
            p,
          ): p is {
            id: string;
            nom: string;
          } => p !== null,
        ),
      };
    }),
  );
