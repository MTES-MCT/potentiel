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
  AttestationConstitution,
  PermissionDéposerGarantiesFinancières,
} from '@potentiel/domain';
import { isNone, isSome } from '@potentiel/monads';
import { Project, UserProjects } from '../../infra/sequelize/projectionsNext';
import { DomainError } from '@potentiel/core-domain';
import { addQueryParams } from '../../helpers/addQueryParams';
import { upload as uploadMiddleware } from '../upload';
import { FileReadableStream } from '../../helpers/fileReadableStream';
import { getProjectAppelOffre } from '../../config';
import { ConsulterFichierDépôtAttestationGarantiesFinancièreQuery } from '@potentiel/domain-views';

const schema = yup.object({
  params: yup.object({
    identifiantProjet: yup.string().required(),
  }),
  body: yup.object({
    typeGarantiesFinancieres: yup
      .mixed<`avec date d'échéance` | `consignation` | `6 mois après achèvement`>()
      .oneOf([`avec date d'échéance`, `consignation`, `6 mois après achèvement`])
      .required('Vous devez préciser le type de garanties financières'),
    dateEcheance: yup
      .date()
      .nullable()
      .transform(iso8601DateToDateYupTransformation)
      .typeError(`La date d'échéance n'est pas valide`),
    dateConstitution: yup
      .date()
      .required('Vous devez renseigner la date de constitution')
      .transform(iso8601DateToDateYupTransformation)
      .typeError(`La date de constitution n'est pas valide`),
  }),
});

v1Router.post(
  routes.POST_MODIFIER_DEPOT_GARANTIES_FINANCIERES(),
  uploadMiddleware.single('file'),
  vérifierPermissionUtilisateur(PermissionDéposerGarantiesFinancières),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, error }) => {
        const identifiant = request.params.identifiantProjet;
        if (estUnRawIdentifiantProjet(identifiant)) {
          return response.redirect(
            addQueryParams(routes.GET_MODIFIER_DEPOT_GARANTIES_FINANCIERES_PAGE(identifiant), {
              error: `Le dépôt de garanties financières n'a pas pu être modifié. ${error}`,
            }),
          );
        }
        response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(identifiant), {
            error: `Une erreur est survenue lors de la modification du dépôt des garanties financières, merci de vérifier les informations communiquées.`,
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

      let fichierAttestation: AttestationConstitution | undefined = undefined;

      if (!estUnRawIdentifiantProjet(identifiantProjet)) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      const identifiantProjetValueType = convertirEnIdentifiantProjet(identifiantProjet);

      if (!file) {
        const fichierAttestationActuel =
          await mediator.send<ConsulterFichierDépôtAttestationGarantiesFinancièreQuery>({
            type: 'CONSULTER_DÉPÔT_ATTESTATION_GARANTIES_FINANCIÈRES',
            data: {
              identifiantProjet: identifiantProjetValueType,
            },
          });

        if (isNone(fichierAttestationActuel)) {
          return response.redirect(
            addQueryParams(
              routes.GET_MODIFIER_DEPOT_GARANTIES_FINANCIERES_PAGE(identifiantProjet),
              {
                error: `Vous devez joindre l'attestation de constitution des garanties financières`,
              },
            ),
          );
        }

        fichierAttestation = {
          ...fichierAttestationActuel,
          date: convertirEnDateTime(dateConstitution),
        };
      } else {
        fichierAttestation = {
          format: file.mimetype,
          content: new FileReadableStream(file.path),
          date: convertirEnDateTime(dateConstitution),
        };
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
            error: `L'appel d'offres n'est pas soumis aux garanties financières.`,
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
          type: 'MODIFIER_DÉPÔT_GARANTIES_FINANCIÈRES_USE_CASE',
          data: {
            utilisateur: {
              rôle: user.role,
            },
            identifiantProjet: identifiantProjetValueType,
            typeGarantiesFinancières: typeGarantiesFinancieres,
            dateÉchéance: dateEcheance ? convertirEnDateTime(dateEcheance) : undefined,
            attestationConstitution: fichierAttestation,
          },
        });

        return response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: 'Le dépôt de garanties financières a bien été modifié',
            redirectUrl: routes.PROJECT_DETAILS(identifiantProjet),
            redirectTitle: 'Retourner sur la page projet',
          }),
        );
      } catch (error) {
        if (error instanceof DomainError) {
          return response.redirect(
            addQueryParams(
              routes.GET_MODIFIER_DEPOT_GARANTIES_FINANCIERES_PAGE(identifiantProjet),
              {
                error: error.message,
              },
            ),
          );
        }

        return errorResponse({ request, response });
      }
    },
  ),
);
