import routes from '@routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { notFoundResponse } from '../helpers';
import { ConsulterProjetQuery } from '@potentiel/domain-views';
import { EnregistrerGarantiesFinancièresPage } from '@views';
import { mediator } from 'mediateur';
import { convertirEnIdentifiantProjet, estUnRawIdentifiantProjet } from '@potentiel/domain';
import { isNone } from '@potentiel/monads';

const schema = yup.object({
  params: yup.object({
    identifiantProjet: yup.string().required(),
  }),
});

v1Router.get(
  routes.GET_ENREGISTRER_GARANTIES_FINANCIERES_PAGE(),
  //   vérifierPermissionUtilisateur(PermissionConsulterDossierRaccordement),
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

      //   const gestionnaireRéseau = projet.identifiantGestionnaire
      //     ? await mediator.send<ConsulterGestionnaireRéseauQuery>({
      //         type: 'CONSULTER_GESTIONNAIRE_RÉSEAU_QUERY',
      //         data: {
      //           identifiantGestionnaireRéseau: projet.identifiantGestionnaire,
      //         },
      //       })
      //     : none;

      //   if (isSome(gestionnaireRéseau)) {
      return response.send(
        EnregistrerGarantiesFinancièresPage({
          user,
          projet,
        }),
      );
      // }
      //   }

      //   if (userIs(['porteur-projet', 'admin', 'dgec-validateur'])(user)) {
      //     return response.redirect(
      //       routes.GET_TRANSMETTRE_DEMANDE_COMPLETE_RACCORDEMENT_PAGE(identifiantProjet),
      //     );
      //   }

      //   return response.redirect(routes.GET_PAGE_RACCORDEMENT_SANS_DOSSIER_PAGE(identifiantProjet));
    },
  ),
);
