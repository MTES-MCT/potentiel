import routes from '@routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { notFoundResponse, vérifierPermissionUtilisateur } from '../helpers';
import {
  ConsulterDossierRaccordementQuery,
  ConsulterGestionnaireRéseauQuery,
  ConsulterProjetQuery,
  DossierRaccordementReadModel,
  ListerDossiersRaccordementQuery,
  PermissionConsulterDossierRaccordement,
} from '@potentiel/domain-views';
import { ListeDossiersRaccordementPage } from '@views';
import { mediator } from 'mediateur';
import { userIs } from '@modules/users';
import {
  convertirEnIdentifiantProjet,
  convertirEnRéférenceDossierRaccordement,
  estUnRawIdentifiantProjet,
} from '@potentiel/domain';
import { isNone, isSome, none } from '@potentiel/monads';

const schema = yup.object({
  params: yup.object({
    identifiantProjet: yup.string().required(),
  }),
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

      if (!estUnRawIdentifiantProjet(identifiantProjet)) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      const identifiantProjetValueType = convertirEnIdentifiantProjet(identifiantProjet);

      const projet = await mediator.send<ConsulterProjetQuery>({
        type: 'CONSULTER_PROJET',
        data: {
          identifiantProjet: identifiantProjetValueType,
        },
      });

      if (isNone(projet)) {
        return notFoundResponse({
          request,
          response,
          ressourceTitle: 'Projet',
        });
      }

      const gestionnaireRéseau = projet.identifiantGestionnaire
        ? await mediator.send<ConsulterGestionnaireRéseauQuery>({
            type: 'CONSULTER_GESTIONNAIRE_RÉSEAU_QUERY',
            data: {
              identifiantGestionnaireRéseau: projet.identifiantGestionnaire,
            },
          })
        : none;

      if (isNone(gestionnaireRéseau)) {
        return response.redirect(routes.GET_PAGE_RACCORDEMENT_SANS_DOSSIER_PAGE(identifiantProjet));
      }

      const { références } = await mediator.send<ListerDossiersRaccordementQuery>({
        type: 'LISTER_DOSSIER_RACCORDEMENT_QUERY',
        data: { identifiantProjet: identifiantProjetValueType },
      });

      if (références.length > 0) {
        const dossiers: Array<DossierRaccordementReadModel> = (
          await Promise.all(
            références.map(async (référence) => {
              const dossier = await mediator.send<ConsulterDossierRaccordementQuery>({
                type: 'CONSULTER_DOSSIER_RACCORDEMENT_QUERY',
                data: {
                  identifiantProjet: identifiantProjetValueType,
                  référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(référence),
                },
              });

              return dossier;
            }),
          )
        ).filter(isSome);

        return response.send(
          ListeDossiersRaccordementPage({
            user,
            projet,
            gestionnaireRéseau,
            dossiers,
          }),
        );
      }

      if (userIs(['porteur-projet', 'admin', 'dgec-validateur'])(user)) {
        return response.redirect(
          routes.GET_TRANSMETTRE_DEMANDE_COMPLETE_RACCORDEMENT_PAGE(identifiantProjet),
        );
      }

      return response.redirect(routes.GET_PAGE_RACCORDEMENT_SANS_DOSSIER_PAGE(identifiantProjet));
    },
  ),
);
