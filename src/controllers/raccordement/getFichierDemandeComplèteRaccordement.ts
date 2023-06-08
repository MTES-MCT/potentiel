import { mediator } from 'mediateur';
import { extension } from 'mime-types';
import * as yup from 'yup';

import {
  convertirEnIdentifiantProjet,
  convertirEnRéférenceDossierRaccordement,
} from '@potentiel/domain';
import {
  ConsulterDossierRaccordementQuery,
  PermissionConsulterDossierRaccordement,
} from '@potentiel/domain-views';
import routes from '@routes';
import { logger } from '@core/utils';

import { v1Router } from '../v1Router';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { notFoundResponse, vérifierPermissionUtilisateur } from '../helpers';
import { isNone } from '@potentiel/monads';

const schema = yup.object({
  params: yup.object({
    identifiantProjet: yup.string().required(),
    reference: yup.string().required(),
  }),
});

v1Router.get(
  routes.GET_DEMANDE_COMPLETE_RACCORDEMENT_FILE(),
  vérifierPermissionUtilisateur(PermissionConsulterDossierRaccordement),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response }) =>
        notFoundResponse({ request, response, ressourceTitle: 'Projet' }),
    },
    async (request, response) => {
      const {
        params: { identifiantProjet, reference },
      } = request;

      try {
        const demandeComplèteRaccordement = await mediator.send<ConsulterDossierRaccordementQuery>({
          type: 'CONSULTER_DOSSIER_RACCORDEMENT_QUERY',
          data: {
            identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
            référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(reference),
          },
        });

        if (
          isNone(demandeComplèteRaccordement) ||
          !demandeComplèteRaccordement.accuséRéception?.format
        ) {
          return notFoundResponse({
            request,
            response,
            ressourceTitle: 'Accusé de réception de la demande complète de raccordement',
          });
        }

        const extensionFichier = extension(demandeComplèteRaccordement.accuséRéception.format);

        response.type(demandeComplèteRaccordement.accuséRéception.format);
        response.setHeader(
          'Content-Disposition',
          `attachment; filename=accuse-reception-${reference}.${extensionFichier}`,
        );
        demandeComplèteRaccordement.accuséRéception..pipe(response);
        return response.status(200);
      } catch (error) {
        logger.error(error);
      }
    },
  ),
);
