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
  PermissionEnregistrerGarantiesFinancières,
  DateTimeValueType,
} from '@potentiel/domain';
import { isNone, isSome } from '@potentiel/monads';
import { Project, UserProjects } from '../../infra/sequelize/projectionsNext';
import { DomainError } from '@potentiel/core-domain';
import { addQueryParams } from '../../helpers/addQueryParams';
import { upload as uploadMiddleware } from '../upload';
import { FileReadableStream } from '../../helpers/fileReadableStream';
import { getProjectAppelOffre } from '../../config';
import { ConsulterFichierAttestationGarantiesFinancièreQuery } from '@potentiel/domain-views';

const schema = yup.object({
  params: yup.object({
    identifiantProjet: yup.string().required(),
  }),
  body: yup.object({
    typeGarantiesFinancieres: yup
      .mixed<`avec date d'échéance` | `consignation` | `6 mois après achèvement`>()
      .oneOf([`avec date d'échéance`, `consignation`, `6 mois après achèvement`])
      .required('Vous devez renseigner le type de garanties financières.'),
    dateEcheance: yup
      .date()
      .nullable()
      .transform(iso8601DateToDateYupTransformation)
      .typeError(`La date d'échéance n'est pas valide`),
    dateConstitution: yup
      .date()
      .transform(iso8601DateToDateYupTransformation)
      .typeError(`La date de constitution n'est pas valid.e`)
      .required('Vous devez renseigner la date de constitution des garanties financières.'),
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
              error: `Les garanties financières n'ont pas pu être enregistrées. ${error}`,
            }),
          );
        }
        response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(identifiant), {
            error: `Une erreur est survenue lors de l'enregistrement des garanties financières, merci de vérifier les informations communiquées.`,
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

      let fichierAttestation:
        | { format: string; date: DateTimeValueType; content: ReadableStream }
        | undefined = undefined;

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
        attributes: ['id', 'appelOffreId', 'periodeId', 'familleId', 'classe', 'abandonedOn'],
      });

      if (!projet) {
        return notFoundResponse({
          request,
          response,
          ressourceTitle: 'Projet',
        });
      }

      if (projet.abandonedOn > 0 || projet.classe === 'Eliminé') {
        response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(identifiantProjet), {
            error: `Vous ne pouvez pas enregistrer des garanties financières car le projet n'est pas "classé"`,
          }),
        );
      }

      const appelOffre = getProjectAppelOffre({
        appelOffreId: projet.appelOffreId,
        periodeId: projet.periodeId,
        familleId: projet.familleId,
      });
      if (appelOffre && !appelOffre.isSoumisAuxGF) {
        response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(identifiantProjet), {
            error: `Vous ne pouvez pas enregistrer des garanties financières car l'appel d'offres n'est pas soumis à garanties financières`,
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

      if (
        dateEcheance &&
        [`consignation`, `6 mois après achèvement`].includes(typeGarantiesFinancieres)
      ) {
        return response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(identifiantProjet), {
            error:
              "Il ne peut pas y avoir une date d'échéance avec ce type de garanties financières. Nous vous invions à corriger ces données.",
          }),
        );
      }

      if (!dateEcheance && typeGarantiesFinancieres === "avec date d'échéance") {
        return response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(identifiantProjet), {
            error:
              "Une date d'échéance doit être renseignée avec ce type de garanties financières. Nous vous invions à corriger ces données.",
          }),
        );
      }

      if (!file) {
        const fichierAttestationActuel =
          await mediator.send<ConsulterFichierAttestationGarantiesFinancièreQuery>({
            type: 'CONSULTER_ATTESTATION_GARANTIES_FINANCIÈRES',
            data: {
              identifiantProjet: identifiantProjetValueType,
            },
          });

        if (isNone(fichierAttestationActuel)) {
          return response.redirect(
            addQueryParams(routes.GET_ENREGISTRER_GARANTIES_FINANCIERES_PAGE(identifiantProjet), {
              error: `Vous devez joindre l'attestation de constitution`,
            }),
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

      try {
        await mediator.send<DomainUseCase>({
          type: 'ENREGISTRER_GARANTIES_FINANCIÈRES_USE_CASE',
          data: {
            utilisateur: {
              rôle: user.role,
            },
            identifiantProjet: identifiantProjetValueType,
            ...(typeGarantiesFinancieres === "avec date d'échéance"
              ? {
                  typeGarantiesFinancières: "avec date d'échéance",
                  dateÉchéance: convertirEnDateTime(dateEcheance!),
                }
              : { typeGarantiesFinancières: typeGarantiesFinancieres }),
            attestationConstitution: fichierAttestation ?? undefined,
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
