import {
  PermissionConsulterDossierRaccordement,
  téléchargerFichierDemandeComplèteRaccordementQueryHandlerFactory,
} from '@potentiel/domain';
import routes from '@routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { notFoundResponse, vérifierPermissionUtilisateur } from '../helpers';
import { Project } from '@infra/sequelize/projectionsNext';
import { logger } from '@core/utils';
import { findProjection } from '@potentiel/pg-projections';
import { récupérerFichierDemandeComplèteRaccordement } from '@potentiel/adapter-domain';
import { extension } from 'mime-types';

const téléchargerFichierDemandeComplèteRaccordement =
  téléchargerFichierDemandeComplèteRaccordementQueryHandlerFactory({
    find: findProjection,
    récupérerFichierDemandeComplèteRaccordement,
  });

const schema = yup.object({
  params: yup.object({
    projetId: yup.string().uuid().required(),
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
        params: { projetId, reference },
      } = request;

      const projet = await Project.findByPk(projetId, {
        attributes: ['appelOffreId', 'periodeId', 'familleId', 'numeroCRE'],
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

      try {
        const fichier = await téléchargerFichierDemandeComplèteRaccordement({
          identifiantProjet,
          référenceDossierRaccordement: reference,
        });

        const extensionFichier = extension(fichier.format);

        response.type(fichier.format);
        response.setHeader(
          'Content-Disposition',
          `attachment; filename=accuse-reception-${reference}.${extensionFichier}`,
        );
        fichier.content.pipe(response);
        return response.status(200);
      } catch (error) {
        logger.error(error);
      }
    },
  ),
);
