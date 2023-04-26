import {
  DossierRaccordementNonRéférencéError,
  PermissionTransmettreDemandeComplèteRaccordement,
  formatIdentifiantProjet,
  modifierDemandeComplèteRaccordementCommandHandlerFactory,
} from '@potentiel/domain';
import routes from '@routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import {
  errorResponse,
  iso8601DateToDateYupTransformation,
  notFoundResponse,
  vérifierPermissionUtilisateur,
} from '../helpers';
import { Project } from '@infra/sequelize/projectionsNext';
import { loadAggregate, publish } from '@potentiel/pg-event-sourcing';
import { addQueryParams } from '../../helpers/addQueryParams';
import { logger } from '@core/utils';
import { upload as uploadMiddleware } from '../upload';
import { extname, join } from 'path';
import { createReadStream } from 'fs';
import { upload } from '@potentiel/file-storage';

const modifierDemandeComplèteRaccordement =
  modifierDemandeComplèteRaccordementCommandHandlerFactory({
    publish,
    loadAggregate,
  });

const schema = yup.object({
  params: yup.object({
    projetId: yup.string().uuid().required(),
    reference: yup.string().required(),
  }),
  body: yup.object({
    dateQualification: yup
      .date()
      .required(`La date de qualification est obligatoire`)
      .nullable()
      .transform(iso8601DateToDateYupTransformation)
      .typeError(`La date de qualification n'est pas valide`),
  }),
});

v1Router.post(
  routes.POST_MODIFIER_DEMANDE_COMPLETE_RACCORDEMENT(),
  uploadMiddleware.single('file'),
  vérifierPermissionUtilisateur(PermissionTransmettreDemandeComplèteRaccordement),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response }) =>
        notFoundResponse({ request, response, ressourceTitle: 'Projet' }),
    },
    async (request, response) => {
      const {
        params: { projetId, reference },
        body: { dateQualification },
        file,
      } = request;

      if (!file) {
        return response.redirect(
          addQueryParams(
            routes.GET_MODIFIER_DEMANDE_COMPLETE_RACCORDEMENT_PAGE(projetId, reference),
            {
              error: `Vous devez joindre l'accusé de réception de la demande complète de raccordement`,
            },
          ),
        );
      }

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
        await modifierDemandeComplèteRaccordement({
          identifiantProjet,
          référenceDossierRaccordement: reference,
          dateQualification,
        });

        const filePath = join(
          formatIdentifiantProjet(identifiantProjet),
          reference,
          `proposition-technique-et-financiere${extname(file.originalname)}`,
        );
        const content = createReadStream(file.path);
        await upload(filePath, content);

        return response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: 'La demande complète de raccordement est bien mise à jour',
            redirectUrl: routes.GET_LISTE_DOSSIERS_RACCORDEMENT(projetId),
            redirectTitle: 'Retourner sur la page raccordement',
          }),
        );
      } catch (error) {
        if (error instanceof DossierRaccordementNonRéférencéError) {
          return response.redirect(
            addQueryParams(
              routes.GET_MODIFIER_DEMANDE_COMPLETE_RACCORDEMENT_PAGE(projetId, reference),
              {
                error: error.message,
              },
            ),
          );
        }

        logger.error(error);

        return errorResponse({ request, response });
      }
    },
  ),
);
