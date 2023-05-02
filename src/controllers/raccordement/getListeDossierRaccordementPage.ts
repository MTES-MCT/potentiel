import routes from '@routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { notFoundResponse, vérifierPermissionUtilisateur } from '../helpers';
import {
  PermissionConsulterDossierRaccordement,
  RésuméProjetReadModel,
  consulterDossierRaccordementQueryHandlerFactory,
  consulterGestionnaireRéseauQueryHandlerFactory,
  consulterProjetQueryHandlerFactory,
  formatIdentifiantProjet,
  listerDossiersRaccordementQueryHandlerFactory,
} from '@potentiel/domain';
import { Project } from '@infra/sequelize/projectionsNext';
import { findProjection } from '@potentiel/pg-projections';
import { ListeDossiersRaccordementPage } from '@views';
import { join } from 'path';
import { getFiles } from '@potentiel/file-storage';

const listerDossiersRaccordement = listerDossiersRaccordementQueryHandlerFactory({
  find: findProjection,
});

const consulterDossierRaccordement = consulterDossierRaccordementQueryHandlerFactory({
  find: findProjection,
});

const consulterProjet = consulterProjetQueryHandlerFactory({ find: findProjection });

const consulterGestionnaireRéseau = consulterGestionnaireRéseauQueryHandlerFactory({
  find: findProjection,
});

const schema = yup.object({
  params: yup.object({ projetId: yup.string().uuid().required() }),
});

v1Router.get(
  routes.GET_LISTE_DOSSIERS_RACCORDEMENT(),
  vérifierPermissionUtilisateur(PermissionConsulterDossierRaccordement),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response }) =>
        notFoundResponse({ request, response, ressourceTitle: 'Projet' }),
    },
    async (request, response) => {
      const {
        user,
        params: { projetId },
        query: { success },
      } = request;

      const projet = await Project.findByPk(projetId, {
        attributes: [
          'id',
          'nomProjet',
          'nomCandidat',
          'communeProjet',
          'regionProjet',
          'departementProjet',
          'periodeId',
          'familleId',
          'appelOffreId',
          'numeroCRE',
          'notifiedOn',
          'abandonedOn',
          'classe',
        ],
      });

      if (!projet) {
        return notFoundResponse({
          request,
          response,
          ressourceTitle: 'Projet',
        });
      }

      const identifiantProjet = {
        appelOffre: projet.appelOffreId,
        période: projet.periodeId,
        famille: projet.familleId,
        numéroCRE: projet.numeroCRE,
      };

      const { références } = await listerDossiersRaccordement({
        identifiantProjet,
      });

      if (références.length > 0) {
        const getStatutProjet = (): RésuméProjetReadModel['statut'] => {
          if (!projet.notifiedOn) {
            return 'non-notifié';
          }
          if (projet.abandonedOn !== 0) {
            return 'abandonné';
          }
          if (projet.classe === 'Classé') {
            return 'classé';
          }

          return 'éliminé';
        };

        const dossiers = await Promise.all(
          références.map(async (référence) => {
            const fileDCRPath = join(
              formatIdentifiantProjet(identifiantProjet),
              référence,
              `demande-complete-raccordement`,
            );
            const DCRFiles = await getFiles(fileDCRPath);

            const filePTFPath = join(
              formatIdentifiantProjet(identifiantProjet),
              référence,
              `demande-complete-raccordement`,
            );
            const PTFFiles = await getFiles(filePTFPath);

            const dossier = await consulterDossierRaccordement({ identifiantProjet, référence });

            return {
              ...dossier,
              hasPTFFile: !!(PTFFiles.length > 0),
              hasDCRFile: !!(DCRFiles.length > 0),
            };
          }),
        );

        const { identifiantGestionnaire = { codeEIC: '' } } = await consulterProjet({
          identifiantProjet,
        });

        const gestionnaireRéseau = await consulterGestionnaireRéseau({
          codeEIC: identifiantGestionnaire.codeEIC,
        });

        return response.send(
          ListeDossiersRaccordementPage({
            user,
            identifiantProjet: projetId,
            résuméProjet: {
              type: 'résumé-projet',
              identifiantProjet: projet.id,
              appelOffre: projet.appelOffreId,
              période: projet.periodeId,
              famille: projet.familleId,
              numéroCRE: projet.numeroCRE,
              statut: getStatutProjet(),
              nom: projet.nomProjet,
              localité: {
                commune: projet.communeProjet,
                département: projet.departementProjet,
                région: projet.regionProjet,
              },
            },
            gestionnaireRéseau,
            dossiers,
            success: success as string,
          }),
        );
      }

      return response.redirect(routes.GET_TRANSMETTRE_DEMANDE_COMPLETE_RACCORDEMENT_PAGE(projetId));
    },
  ),
);
