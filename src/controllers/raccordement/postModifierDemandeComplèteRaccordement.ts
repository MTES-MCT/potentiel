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
import { deleteFile, getFiles, renameFile, upload } from '@potentiel/file-storage';

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
    nouvelleReference: yup.string().required(),
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
        body: { dateQualification, nouvelleReference },
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
          dateQualification,
          nouvelleReference,
          referenceActuelle: reference,
        });

        const fileToDeletePath = join(
          formatIdentifiantProjet(identifiantProjet),
          reference,
          `demande-complete-raccordement`,
        );

        const files = await getFiles(fileToDeletePath);

        if (files.length > 0) {
          await deleteFile(files[0]);
        }

        const newFilePath = join(
          formatIdentifiantProjet(identifiantProjet),
          nouvelleReference,
          `demande-complete-raccordement${extname(file.originalname)}`,
        );
        const content = createReadStream(file.path);
        await upload(newFilePath, content);

        const fichierPTF = await getFiles(
          join(
            formatIdentifiantProjet(identifiantProjet),
            reference,
            `proposition-technique-et-financiere`,
          ),
        );

        if (fichierPTF.length > 0) {
          await renameFile(
            fichierPTF[0],
            join(
              formatIdentifiantProjet(identifiantProjet),
              nouvelleReference,
              `proposition-technique-et-financiere${extname(fichierPTF[0])}`,
            ),
          );
        }

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
