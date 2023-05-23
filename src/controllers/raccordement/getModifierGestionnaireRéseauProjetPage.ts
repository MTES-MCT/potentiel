import {
  PermissionModifierGestionnaireRéseauProjet,
  RésuméProjetReadModel,
  buildConsulterProjetQuery,
  buildListerGestionnaireRéseauQuery,
} from '@potentiel/domain';
import routes from '@routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { notFoundResponse, vérifierPermissionUtilisateur } from '../helpers';
import { ModifierGestionnaireRéseauProjetPage } from '@views';
import { Project } from '@infra/sequelize/projectionsNext';
import { mediator } from 'mediateur';

const schema = yup.object({
  params: yup.object({ projetId: yup.string().uuid().required() }),
});

v1Router.get(
  routes.GET_MODIFIER_GESTIONNAIRE_RESEAU_PROJET_PAGE(),
  vérifierPermissionUtilisateur(PermissionModifierGestionnaireRéseauProjet),
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

      const identifiantProjet = {
        appelOffre: projet.appelOffreId,
        période: projet.periodeId,
        famille: projet.familleId,
        numéroCRE: projet.numeroCRE,
      };

      const { identifiantGestionnaire } = await mediator.send(
        buildConsulterProjetQuery({ identifiantProjet }),
      );

      const listeGestionnairesRéseau = await mediator.send(buildListerGestionnaireRéseauQuery({}));

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

      return response.send(
        ModifierGestionnaireRéseauProjetPage({
          identifiantGestionnaireActuel: identifiantGestionnaire!.codeEIC,
          user,
          listeGestionnairesRéseau,
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
          error: error as string,
        }),
      );
    },
  ),
);
