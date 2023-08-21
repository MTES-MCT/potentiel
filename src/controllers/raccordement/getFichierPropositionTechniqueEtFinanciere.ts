import { mediator } from 'mediateur';
import {
  ConsulterPropositionTechniqueEtFinancièreSignéeQuery,
  PermissionConsulterDossierRaccordement,
} from '@potentiel/domain-views';
import routes from '../../routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { notFoundResponse, vérifierPermissionUtilisateur } from '../helpers';
import { logger } from '../../core/utils';
import { estUnRawIdentifiantProjet } from '@potentiel/domain';
import { isNone } from '@potentiel/monads';
import { sendFile } from '../helpers/sendFile';

const schema = yup.object({
  params: yup.object({
    identifiantProjet: yup.string().required(),
    reference: yup.string().required(),
  }),
});

v1Router.get(
  routes.GET_PROPOSITION_TECHNIQUE_ET_FINANCIERE_FILE(),
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
        const propositionTechniqueEtFinancièreSignée =
          await mediator.send<ConsulterPropositionTechniqueEtFinancièreSignéeQuery>({
            type: 'CONSULTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE',
            data: {
              identifiantProjet,
              référenceDossierRaccordement: reference,
            },
          });

        if (isNone(propositionTechniqueEtFinancièreSignée)) {
          return notFoundResponse({
            request,
            response,
            ressourceTitle: 'Accusé de réception de la demande complète de raccordement',
          });
        }

        await sendFile(response, {
          content: propositionTechniqueEtFinancièreSignée.content,
          fileName: 'proposition-technique-et-financiere',
          mimeType: propositionTechniqueEtFinancièreSignée.format,
        });
      } catch (error) {
        logger.error(error);
        return response.status(404);
      }
    },
  ),
);
