import {
  PermissionTransmettrePropositionTechniqueEtFinancière,
  RésuméProjetReadModel,
  buildConsulterDossierRaccordementUseCase,
  buildConsulterGestionnaireRéseauQuery,
  buildConsulterProjetQuery,
} from '@potentiel/domain';
import routes from '@routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { notFoundResponse, vérifierPermissionUtilisateur } from '../helpers';
import { Project } from '@infra/sequelize/projectionsNext';
import { ModifierDemandeComplèteRaccordementPage } from '@views';
import { mediator } from 'mediateur';

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

      const dossierRaccordement = await mediator.send(
        buildConsulterDossierRaccordementUseCase({
          identifiantProjet: {
            appelOffre: projet.appelOffreId,
            période: projet.periodeId,
            famille: projet.familleId,
            numéroCRE: projet.numeroCRE,
          },
          référence: reference,
        }),
      );

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

      const { identifiantGestionnaire } = await mediator.send(
        buildConsulterProjetQuery({
          identifiantProjet,
        }),
      );

      const gestionnaireRéseauActuel = await mediator.send(
        buildConsulterGestionnaireRéseauQuery({
          identifiantGestionnaireRéseau: { codeEIC: identifiantGestionnaire!.codeEIC },
        }),
      );

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
          existingFile: !!dossierRaccordement.accuséRéception,
        }),
      );
    },
  ),
);
