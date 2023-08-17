import routes from '../../routes';
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
  PermissionDéposerGarantiesFinancières,
} from '@potentiel/domain';
import { isSome } from '@potentiel/monads';
import { Project, UserProjects } from '../../infra/sequelize/projectionsNext';
import { DomainError } from '@potentiel/core-domain';
import { addQueryParams } from '../../helpers/addQueryParams';
import { upload as uploadMiddleware } from '../upload';
import { createReadStream } from 'fs';
import { getProjectAppelOffre } from '../../config';

const schema = yup.object({
  params: yup.object({
    identifiantProjet: yup.string().required(),
  }),
  body: yup.object({
    typeGarantiesFinancieres: yup
      .mixed<`avec date d'échéance` | `consignation` | `6 mois après achèvement`>()
      .oneOf([`avec date d'échéance`, `consignation`, `6 mois après achèvement`]),
    dateEcheance: yup
      .date()
      .nullable()
      .transform(iso8601DateToDateYupTransformation)
      .typeError(`La date d'échéance n'est pas valide`),
    dateConstitution: yup
      .date()
      .required('La date de constitution est requise')
      .transform(iso8601DateToDateYupTransformation)
      .typeError(`La date de constitution n'est pas valide`),
  }),
});

v1Router.post(
  routes.POST_DEPOSER_GARANTIES_FINANCIERES(),
  uploadMiddleware.single('file'),
  vérifierPermissionUtilisateur(PermissionDéposerGarantiesFinancières),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, error }) => {
        const identifiant = request.params.identifiantProjet;
        if (estUnRawIdentifiantProjet(identifiant)) {
          return response.redirect(
            addQueryParams(routes.GET_DEPOSER_GARANTIES_FINANCIERES_PAGE(identifiant), {
              error: `Les garanties financières n'ont pas pu être déposées. ${error}`,
            }),
          );
        }
        response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(identifiant), {
            error: `Une erreur est survenue lors du dépôt des garanties financières, merci de vérifier les informations communiquées.`,
          }),
        );
      },
    },
    async (request, response) => {
      const {
        user,
        params: { identifiantProjet },
        body: { typeGarantiesFinancieres, dateEcheance, dateConstitution },
        file,
      } = request;

      if (!estUnRawIdentifiantProjet(identifiantProjet)) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      const identifiantProjetValueType = convertirEnIdentifiantProjet(identifiantProjet);

      if (!file) {
        return response.redirect(
          addQueryParams(routes.GET_DEPOSER_GARANTIES_FINANCIERES_PAGE(identifiantProjet), {
            error: `Vous devez joindre l'attestation de constitution des garanties financières`,
          }),
        );
      }

      const projet = await Project.findOne({
        where: {
          appelOffreId: identifiantProjetValueType.appelOffre,
          periodeId: identifiantProjetValueType.période,
          familleId: isSome(identifiantProjetValueType.famille)
            ? identifiantProjetValueType.famille
            : '',
          numeroCRE: identifiantProjetValueType.numéroCRE,
        },
        attributes: ['id', 'appelOffreId', 'periodeId', 'familleId'],
      });

      if (!projet) {
        return notFoundResponse({
          request,
          response,
          ressourceTitle: 'Projet',
        });
      }

      const appelOffre = getProjectAppelOffre({
        appelOffreId: projet.appelOffreId,
        periodeId: projet.periodeId,
        familleId: projet.familleId,
      });
      if (appelOffre && !appelOffre.isSoumisAuxGF) {
        response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(identifiantProjet), {
            error: `Enregistrement impossible car l'appel d'offres n'est pas soumis aux garanties financières.`,
          }),
        );
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
          type: 'DÉPOSER_GARANTIES_FINANCIÈRES_USE_CASE',
          data: {
            utilisateur: {
              rôle: user.role,
            },
            identifiantProjet: identifiantProjetValueType,
            typeGarantiesFinancières: typeGarantiesFinancieres,
            dateÉchéance: dateEcheance ? convertirEnDateTime(dateEcheance) : undefined,
            attestationConstitution: {
              format: file.mimetype,
              content: createReadStream(file.path),
              date: convertirEnDateTime(dateConstitution),
            },
            dateDépôt: convertirEnDateTime(new Date()),
          },
        });

        return response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: 'Les garanties financières ont bien été déposées',
            redirectUrl: routes.PROJECT_DETAILS(identifiantProjet),
            redirectTitle: 'Retourner sur la page projet',
          }),
        );
      } catch (error) {
        if (error instanceof DomainError) {
          return response.redirect(
            addQueryParams(routes.GET_DEPOSER_GARANTIES_FINANCIERES_PAGE(identifiantProjet), {
              error: error.message,
            }),
          );
        }

        return errorResponse({ request, response });
      }
    },
  ),
);
