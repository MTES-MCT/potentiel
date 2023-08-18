import { mediator } from 'mediateur';
import * as yup from 'yup';

import { estUnRawIdentifiantProjet } from '@potentiel/domain';
import {
  ConsulterAccuséRéceptionDemandeComplèteRaccordementQuery,
  PermissionConsulterDossierRaccordement,
} from '@potentiel/domain-views';
import routes from '../../routes';
import { logger } from '../../core/utils';

import { v1Router } from '../v1Router';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { notFoundResponse, vérifierPermissionUtilisateur } from '../helpers';
import { isNone } from '@potentiel/monads';
import { sendFile } from '../helpers/sendFile';

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

      if (!estUnRawIdentifiantProjet(identifiantProjet)) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      try {
        const accuséRéception =
          await mediator.send<ConsulterAccuséRéceptionDemandeComplèteRaccordementQuery>({
            type: 'CONSULTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT',
            data: {
              identifiantProjet: identifiantProjet,
              référenceDossierRaccordement: reference,
            },
          });

        if (isNone(accuséRéception)) {
          return notFoundResponse({
            request,
            response,
            ressourceTitle: 'Accusé de réception de la demande complète de raccordement',
          });
        }

        await sendFile(response, {
          content: accuséRéception.content,
          fileName: 'accuse-reception',
          mimeType: accuséRéception.format,
        });
      } catch (error) {
        logger.error(error);
        return response.status(404);
      }
    },
  ),
);
