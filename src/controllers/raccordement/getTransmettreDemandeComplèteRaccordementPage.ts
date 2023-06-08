import routes from '@routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { notFoundResponse, vérifierPermissionUtilisateur } from '../helpers';
import { TransmettreDemandeComplèteRaccordementPage } from '@views';
import { Project } from '@infra/sequelize/projectionsNext';
import { mediator } from 'mediateur';
import {
  PermissionTransmettreDemandeComplèteRaccordement,
  convertirEnIdentifiantProjet,
  estUnRawIdentifiantProjet,
} from '@potentiel/domain';
import {
  ConsulterProjetQuery,
  ListerGestionnaireRéseauQuery,
  RésuméProjetReadModel,
} from '@potentiel/domain-views';
import { isSome } from '@potentiel/monads';

const schema = yup.object({
  params: yup.object({ identifiantProjet: yup.string().uuid().required() }),
});

v1Router.get(
  routes.GET_TRANSMETTRE_DEMANDE_COMPLETE_RACCORDEMENT_PAGE(),
  vérifierPermissionUtilisateur(PermissionTransmettreDemandeComplèteRaccordement),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response }) =>
        notFoundResponse({ request, response, ressourceTitle: 'Projet' }),
    },
    async (request, response) => {
      const {
        user,
        params: { identifiantProjet },
        query: { error },
      } = request;

      if (!estUnRawIdentifiantProjet(identifiantProjet)) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      const identifiantProjetValueType = convertirEnIdentifiantProjet(identifiantProjet);

      const projet = await Project.findOne({
        where: {
          appelOffreId: identifiantProjetValueType.appelOffre,
          periodeId: identifiantProjetValueType.période,
          familleId: isSome(identifiantProjetValueType.famille) ?? undefined,
          numeroCRE: identifiantProjetValueType.numéroCRE,
        },
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

      const { identifiantGestionnaire = { codeEIC: '' } } =
        await mediator.send<ConsulterProjetQuery>({
          type: 'CONSULTER_PROJET',
          data: {
            identifiantProjet: identifiantProjetValueType,
          },
        });

      const gestionnairesRéseau = await mediator.send<ListerGestionnaireRéseauQuery>({
        type: 'LISTER_GESTIONNAIRE_RÉSEAU_QUERY',
        data: {},
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

      return response.send(
        TransmettreDemandeComplèteRaccordementPage({
          identifiantGestionnaire: identifiantGestionnaire?.codeEIC,
          user,
          gestionnairesRéseau,
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
