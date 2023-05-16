import {
  DossierRaccordementNonRéférencéError,
  PermissionTransmettrePropositionTechniqueEtFinancière,
  modifierPropositionTechniqueEtFinancièreCommandHandlerFactory,
  createModifierPropositionTechniqueEtFinancièreCommand,
  newModifierPropositionTechniqueEtFinancièreCommand,
  buildModifierPropositionTechniqueEtFinancièreCommand,
  formatIdentifiantProjet,
} from '@potentiel/domain';
import routes from '@routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import {
  errorResponse,
  iso8601DateToDateYupTransformation,
  notFoundResponse,
  unauthorizedResponse,
  vérifierPermissionUtilisateur,
} from '../helpers';
import { Project, UserProjects } from '@infra/sequelize/projectionsNext';
import { addQueryParams } from '../../helpers/addQueryParams';
import { logger } from '@core/utils';
import { upload as uploadMiddleware } from '../upload';
import { createReadStream } from 'fs';
import { enregistrerFichierPropositionTechniqueEtFinancière } from '@potentiel/adapter-domain';

const modifierPropositionTechniqueEtFinancière =
  modifierPropositionTechniqueEtFinancièreCommandHandlerFactory({
    publish,
    loadAggregate,
    enregistrerFichierPropositionTechniqueEtFinancière,
  });
import { deleteFile, getFiles, upload } from '@potentiel/file-storage';
import { mediator } from 'mediateur';

const schema = yup.object({
  params: yup.object({
    projetId: yup.string().uuid().required(),
    reference: yup.string().required(),
  }),
  body: yup.object({
    dateSignature: yup
      .date()
      .required(`La date de signature est obligatoire`)
      .nullable()
      .transform(iso8601DateToDateYupTransformation)
      .typeError(`La date de signature n'est pas valide`),
  }),
});

v1Router.post(
  routes.POST_MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIERE(),
  uploadMiddleware.single('file'),
  vérifierPermissionUtilisateur(PermissionTransmettrePropositionTechniqueEtFinancière),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response }) =>
        response.redirect(
          addQueryParams(routes.GET_LISTE_DOSSIERS_RACCORDEMENT(request.params.projetId), {
            error: `Une erreur est survenue lors de la mise à jour de la date de signature de la proposition technique et financière, merci de vérifier les informations communiquées.`,
          }),
        ),
    },
    async (request, response) => {
      const {
        params: { projetId, reference },
        body: { dateSignature },
        file,
        user,
      } = request;

      if (!file) {
        return response.redirect(
          addQueryParams(routes.GET_MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIERE_PAGE(projetId), {
            error: `Vous devez joindre la proposition technique et financière`,
          }),
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

      if (user.role === 'porteur-projet') {
        const porteurAAccèsAuProjet = !!(await UserProjects.findOne({
          where: { projectId: projetId, userId: user.id },
        }));

        if (!porteurAAccèsAuProjet) {
          return unauthorizedResponse({
            request,
            response,
            customMessage: `Vous n'avez pas accès à ce projet.`,
          });
        }
      }

      const identifiantProjet = {
        appelOffre: projet.appelOffreId,
        période: projet.periodeId,
        famille: projet.familleId,
        numéroCRE: projet.numeroCRE,
      };

      try {
        await modifierPropositionTechniqueEtFinancière({
          identifiantProjet,
          référenceDossierRaccordement: reference,
          dateSignature,
          nouveauFichier: {
            format: file.mimetype,
            content: createReadStream(file.path),
          },
        });
        await mediator.send(
          buildModifierPropositionTechniqueEtFinancièreCommand({
            identifiantProjet,
            référenceDossierRaccordement: reference,
            dateSignature,
          }),
        );

        return response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: 'La proposition technique et financière a bien été mise à jour',
            redirectUrl: routes.GET_LISTE_DOSSIERS_RACCORDEMENT(projetId),
            redirectTitle: 'Retourner sur la page raccordement',
          }),
        );
      } catch (error) {
        if (error instanceof DossierRaccordementNonRéférencéError) {
          return response.redirect(
            addQueryParams(
              routes.GET_MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIERE_PAGE(projetId, reference),
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
