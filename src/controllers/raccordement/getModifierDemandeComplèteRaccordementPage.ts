import {
  PermissionTransmettrePropositionTechniqueEtFinancière,
  RésuméProjetReadModel,
  consulterDossierRaccordementQueryHandlerFactory,
  consulterGestionnaireRéseauQueryHandlerFactory,
  consulterProjetQueryHandlerFactory,
  formatIdentifiantProjet,
} from '@potentiel/domain';
import routes from '@routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { notFoundResponse, vérifierPermissionUtilisateur } from '../helpers';
import { Project } from '@infra/sequelize/projectionsNext';
import { findProjection } from '@potentiel/pg-projections';
import { ModifierDemandeComplèteRaccordementPage } from '@views';
import { getFiles } from '@potentiel/file-storage';
import { join } from 'path';

const consulterDossierRaccordement = consulterDossierRaccordementQueryHandlerFactory({
  find: findProjection,
});

const consulterProjet = consulterProjetQueryHandlerFactory({
  find: findProjection,
});

const consulterGestionnaireRéseau = consulterGestionnaireRéseauQueryHandlerFactory({
  find: findProjection,
});

const schema = yup.object({
  params: yup.object({
    projetId: yup.string().uuid().required(),
    reference: yup.string().required(),
  }),
});

v1Router.get(
  routes.GET_MODIFIER_DEMANDE_COMPLETE_RACCORDEMENT_PAGE(),
  vérifierPermissionUtilisateur(PermissionTransmettrePropositionTechniqueEtFinancière),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response }) =>
        notFoundResponse({ request, response, ressourceTitle: 'Projet' }),
    },
    async (request, response) => {
      const {
        user,
        params: { projetId, reference },
        query: { error },
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

      const dossierRaccordement = await consulterDossierRaccordement({
        identifiantProjet: {
          appelOffre: projet.appelOffreId,
          période: projet.periodeId,
          famille: projet.familleId,
          numéroCRE: projet.numeroCRE,
        },
        référence: reference,
      });

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

      const identifiantProjet = {
        appelOffre: projet.appelOffreId,
        numéroCRE: projet.numeroCRE,
        période: projet.periodeId,
        famille: projet.familleId,
      };

      const { identifiantGestionnaire } = await consulterProjet({
        identifiantProjet,
      });

      const gestionnaireRéseauActuel = await consulterGestionnaireRéseau({
        codeEIC: identifiantGestionnaire!.codeEIC,
      });

      const filePath = join(
        formatIdentifiantProjet(identifiantProjet),
        reference,
        `demande-complete-raccordement`,
      );
      const files = await getFiles(filePath);

      return response.send(
        ModifierDemandeComplèteRaccordementPage({
          user,
          identifiantProjet: projet.id,
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
          reference,
          dateQualificationActuelle: dossierRaccordement.dateQualification,
          error: error as string,
          gestionnaireRéseauActuel,
          existingFile: !!(files.length > 0),
        }),
      );
    },
  ),
);
