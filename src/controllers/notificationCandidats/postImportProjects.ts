import { ensureRole, importProjects } from '../../config';
import { DomainError, UniqueEntityID } from '../../core/domain';
import asyncHandler from '../helpers/asyncHandler';
import { addQueryParams } from '../../helpers/addQueryParams';
import { parseCsv } from '../../helpers/parseCsv';
import { IllegalProjectDataError } from '../../modules/project';
import routes from '../../routes';
import { upload } from '../upload';
import { v1Router } from '../v1Router';
import { AdminImporterCandidatsPage } from '../../views';
import { mediator } from 'mediateur';
import {
  DomainUseCase,
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
} from '@potentiel/domain';

v1Router.post(
  routes.IMPORT_PROJECTS_ACTION,
  ensureRole(['admin', 'dgec-validateur']),
  upload.single('candidats'),
  asyncHandler(async (request, response) => {
    if (!request.file || !request.file.path) {
      return response.redirect(
        addQueryParams(routes.IMPORT_PROJECTS, {
          error: 'Le fichier candidat est manquant.',
        }),
      );
    }

    // Parse the csv file
    const linesResult = await parseCsv(request.file.path, { delimiter: ';', encoding: 'win1252' });
    if (linesResult.isErr()) {
      const csvError = linesResult.error;
      return response.send(
        AdminImporterCandidatsPage({
          request,
          otherError: `Le fichier csv n'a pas pu être importé: ${csvError.message}`,
        }),
      );
    }

    const importId = new UniqueEntityID().toString();

    try {
      const rawProjetsImportés = await importProjects({
        lines: linesResult.value,
        importedBy: request.user,
        importId,
      });

      const projetsPourEnregistrementsGFs = rawProjetsImportés
        .map((projet) => projet.projectData)
        .filter((projet) => projet.garantiesFinancièresType);

      if (projetsPourEnregistrementsGFs.length > 0) {
        const erreursEnregistrementGfs: string[] = [];

        await Promise.all(
          projetsPourEnregistrementsGFs.map(async (projet) => {
            try {
              await mediator.send<DomainUseCase>({
                type: 'ENREGISTRER_GARANTIES_FINANCIÈRES_USE_CASE',
                data: {
                  utilisateur: {
                    rôle: request.user!.role,
                  },
                  identifiantProjet: convertirEnIdentifiantProjet({
                    appelOffre: projet.appelOffreId,
                    famille: projet.familleId,
                    numéroCRE: projet.numeroCRE,
                    période: projet.periodeId,
                  }),
                  typeGarantiesFinancières: projet.garantiesFinancièresType,
                  dateÉchéance: projet.garantiesFinancièresDateEchéance
                    ? convertirEnDateTime(projet.garantiesFinancièresDateEchéance)
                    : undefined,
                  attestationConstitution: undefined,
                },
              });
            } catch (e) {
              if (e instanceof DomainError) {
                erreursEnregistrementGfs.push(`Projet ${projet.nomProjet} - ${e.message}`);
              }
            }
          }),
        );

        if (erreursEnregistrementGfs.length > 0) {
          return response.send(
            AdminImporterCandidatsPage({ request, importErrors: erreursEnregistrementGfs }),
          );
        }
      }

      return response.send(AdminImporterCandidatsPage({ request, isSuccess: true }));
    } catch (e) {
      if (e instanceof IllegalProjectDataError) {
        return response.send(AdminImporterCandidatsPage({ request, importErrors: e.errors }));
      }

      return response.send(AdminImporterCandidatsPage({ request, otherError: e.message }));
    }
  }),
);
