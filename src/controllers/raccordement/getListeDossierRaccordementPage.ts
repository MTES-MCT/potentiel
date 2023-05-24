import routes from '@routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { notFoundResponse, vérifierPermissionUtilisateur } from '../helpers';
import {
  PermissionConsulterDossierRaccordement,
  RésuméProjetReadModel,
  buildConsulterGestionnaireRéseauQuery,
  buildConsulterProjetQuery,
  buildListerDossiersRaccordementUseCase,
  buildConsulterDossierRaccordementUseCase,
} from '@potentiel/domain';
import { Project } from '@infra/sequelize/projectionsNext';
import { ListeDossiersRaccordementPage } from '@views';
import { mediator } from 'mediateur';
import { userIs } from '@modules/users';

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

      const { références } = await mediator.send(
        buildListerDossiersRaccordementUseCase({
          identifiantProjet,
        }),
      );

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
            const dossier = await mediator.send(
              buildConsulterDossierRaccordementUseCase({ identifiantProjet, référence }),
            );

            return {
              ...dossier,
              hasPTFFile: !!dossier.propositionTechniqueEtFinancière,
              hasDCRFile: !!dossier.accuséRéception,
            };
          }),
        );

        const { identifiantGestionnaire = { codeEIC: '' } } = await mediator.send(
          buildConsulterProjetQuery({
            identifiantProjet,
          }),
        );

        const gestionnaireRéseau = await mediator.send(
          buildConsulterGestionnaireRéseauQuery({
            identifiantGestionnaireRéseau: { codeEIC: identifiantGestionnaire.codeEIC },
          }),
        );

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

      if (userIs(['porteur-projet', 'admin', 'dgec-validateur'])(user)) {
        return response.redirect(
          routes.GET_TRANSMETTRE_DEMANDE_COMPLETE_RACCORDEMENT_PAGE(projetId),
        );
      }

      return response.redirect(routes.GET_PAGE_RACCORDEMENT_SANS_DOSSIER_PAGE(projetId));
    },
  ),
);
