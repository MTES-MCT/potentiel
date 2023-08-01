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
import { mediator } from 'mediateur';
import {
  DomainUseCase,
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
  estUnRawIdentifiantProjet,
  PermissionEnregistrerGarantiesFinancières,
} from '@potentiel/domain';
import { isSome } from '@potentiel/monads';
import { Project, UserProjects } from '@infra/sequelize/projectionsNext';
import { DomainError } from '@core/domain';
import { addQueryParams } from '../../helpers/addQueryParams';
import { upload as uploadMiddleware } from '../upload';
import { createReadStream } from 'fs';

const schema = yup.object({
  params: yup.object({
    identifiantProjet: yup.string().required(),
  }),
  body: yup.object({
    typeGarantiesFinancières: yup
      .mixed<`avec date d'échéance` | 'type inconnu' | `consignation` | `6 mois après achèvement`>()
      .oneOf([`avec date d'échéance`, 'type inconnu', `consignation`, `6 mois après achèvement`]),
    dateEcheance: yup
      .date()
      .nullable()
      .transform(iso8601DateToDateYupTransformation)
      .typeError(`La date de qualification n'est pas valide`),
    dateConstitution: yup
      .date()
      .nullable()
      .transform(iso8601DateToDateYupTransformation)
      .typeError(`La date de qualification n'est pas valide`),
  }),
});

v1Router.post(
  routes.POST_ENREGISTRER_GARANTIES_FINANCIERES(),
  uploadMiddleware.single('file'),
  vérifierPermissionUtilisateur(PermissionEnregistrerGarantiesFinancières),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, error }) => {
        const identifiant = request.params.identifiantProjet;
        if (estUnRawIdentifiantProjet(identifiant)) {
          return response.redirect(
            addQueryParams(routes.GET_ENREGISTRER_GARANTIES_FINANCIERES_PAGE(identifiant), {
              error: `Votre garantie financière n'a pas pu être enregistrée. ${error}`,
            }),
          );
        }
        response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(identifiant), {
            error: `Une erreur est survenue lors de l'enregistrement de la garantie financière, merci de vérifier les informations communiquées.`,
          }),
        );
      },
    },
    async (request, response) => {
      const {
        user,
        params: { identifiantProjet },
        body: { typeGarantiesFinancières, dateEcheance, dateConstitution },
        file,
      } = request;

      console.log(JSON.stringify(user));
      console.log(JSON.stringify(request.params));
      console.log(JSON.stringify(request.body));

      if (!estUnRawIdentifiantProjet(identifiantProjet)) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      const identifiantProjetValueType = convertirEnIdentifiantProjet(identifiantProjet);

      const projet = await Project.findOne({
        where: {
          appelOffreId: identifiantProjetValueType.appelOffre,
          periodeId: identifiantProjetValueType.période,
          familleId: isSome(identifiantProjetValueType.famille)
            ? identifiantProjetValueType.famille
            : '',
          numeroCRE: identifiantProjetValueType.numéroCRE,
        },
        attributes: ['id'],
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
          where: { projectId: projet.id, userId: user.id },
        }));

        if (!porteurAAccèsAuProjet) {
          return unauthorizedResponse({
            request,
            response,
            customMessage: `Vous n'avez pas accès à ce projet.`,
          });
        }
      }

      try {
        await mediator.send<DomainUseCase>({
          type: 'ENREGISTRER_GARANTIES_FINANCIÈRES_USE_CASE',
          data: {
            currentUserRôle: user.role,
            identifiantProjet: identifiantProjetValueType,
            typeGarantiesFinancières,
            dateÉchéance: dateEcheance ? convertirEnDateTime(dateEcheance) : undefined,
            dateConstitution: dateConstitution ? convertirEnDateTime(dateConstitution) : undefined,
            attestationConstitution:
              file && dateConstitution
                ? {
                    format: file.mimetype,
                    content: createReadStream(file.path),
                    date: convertirEnDateTime(dateConstitution),
                  }
                : undefined,
          },
        });

        return response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: 'Les garanties financières ont bien été enregistrées',
            redirectUrl: routes.PROJECT_DETAILS(identifiantProjet),
            redirectTitle: 'Retourner sur la page projet',
          }),
        );
      } catch (error) {
        if (error instanceof DomainError) {
          return response.redirect(
            addQueryParams(routes.GET_ENREGISTRER_GARANTIES_FINANCIERES_PAGE(identifiantProjet), {
              error: error.message,
            }),
          );
        }

        return errorResponse({ request, response });
      }
    },
  ),
);
