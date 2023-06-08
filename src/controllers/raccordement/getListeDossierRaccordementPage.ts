import routes from '@routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { notFoundResponse, vérifierPermissionUtilisateur } from '../helpers';
import {
  ConsulterDossierRaccordementQuery,
  ConsulterGestionnaireRéseauQuery,
  ConsulterProjetQuery,
  ListerDossiersRaccordementQuery,
  PermissionConsulterDossierRaccordement,
  RésuméProjetReadModel,
} from '@potentiel/domain-views';
import { Project } from '@infra/sequelize/projectionsNext';
import { ListeDossiersRaccordementPage } from '@views';
import { mediator } from 'mediateur';
import { userIs } from '@modules/users';
import {
  convertirEnIdentifiantGestionnaireRéseau,
  convertirEnIdentifiantProjet,
  convertirEnRéférenceDossierRaccordement,
} from '@potentiel/domain';
import { isNone, isSome } from '@potentiel/monads';

const schema = yup.object({
  params: yup.object({ identifiantProjet: yup.string().required() }),
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
        params: { identifiantProjet },
      } = request;

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

      const { références } = await mediator.send<ListerDossiersRaccordementQuery>({
        type: 'LISTER_DOSSIER_RACCORDEMENT_QUERY',
        data: { identifiantProjet: identifiantProjetValueType },
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
            const dossier = await mediator.send<ConsulterDossierRaccordementQuery>({
              type: 'CONSULTER_DOSSIER_RACCORDEMENT_QUERY',
              data: {
                identifiantProjet: identifiantProjetValueType,
                référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(référence),
              },
            });

            if (isNone(dossier)) {
              return null;
            }

            return {
              ...dossier,
              hasPTFFile: !!dossier.propositionTechniqueEtFinancière?.format,
              hasDCRFile: !!dossier.accuséRéception?.format,
            };
          }),
        );

        const { identifiantGestionnaire = { codeEIC: '' } } =
          await mediator.send<ConsulterProjetQuery>({
            type: 'CONSULTER_PROJET',
            data: {
              identifiantProjet: identifiantProjetValueType,
            },
          });

        const gestionnaireRéseau = await mediator.send<ConsulterGestionnaireRéseauQuery>({
          type: 'CONSULTER_GESTIONNAIRE_RÉSEAU_QUERY',
          data: {
            identifiantGestionnaireRéseau:
              convertirEnIdentifiantGestionnaireRéseau(identifiantGestionnaire),
          },
        });

        return response.send(
          ListeDossiersRaccordementPage({
            user,
            identifiantProjet: identifiantProjetValueType.formatter(),
            résuméProjet: {
              type: 'résumé-projet',
              identifiantProjet: identifiantProjetValueType.formatter(),
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
