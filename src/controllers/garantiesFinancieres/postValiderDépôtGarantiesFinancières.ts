import routes from '../../routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import {
  errorResponse,
  iso8601DateToDateYupTransformation,
  notFoundResponse,
  vérifierPermissionUtilisateur,
} from '../helpers';
import { mediator } from 'mediateur';
import {
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
  estUnRawIdentifiantProjet,
  PermissionValiderDépôtGarantiesFinancières,
} from '@potentiel/domain';
import { isNone, isSome } from '@potentiel/monads';
import { Project, UserDreal } from '../../infra/sequelize/projectionsNext';
import { DomainError } from '@potentiel/core-domain';
import { addQueryParams } from '../../helpers/addQueryParams';
import { getProjectAppelOffre } from '../../config';
import { GarantiesFinancièresUseCase } from '@potentiel/domain/dist/garantiesFinancières/garantiesFinancières.usecase';
import { logger } from '../../core/utils';
import { ConsulterFichierDépôtAttestationGarantiesFinancièreQuery } from '@potentiel/domain-views';

const schema = yup.object({
  params: yup.object({
    identifiantProjet: yup.string().required(),
  }),
  body: yup.object({
    typeGarantiesFinancieres: yup
      .mixed<`avec date d'échéance` | `consignation` | `6 mois après achèvement`>()
      .oneOf(
        [`avec date d'échéance`, `consignation`, `6 mois après achèvement`],
        `Le type de garanties financières doit être : avec date d'échéance, consignation ou 6 mois après achèvement`,
      )
      .required('Le type de garanties financières doit être renseigné'),
    dateEcheance: yup
      .date()
      .nullable()
      .transform(iso8601DateToDateYupTransformation)
      .typeError(`La date d'échéance n'est pas valide.`),
    dateConstitution: yup
      .date()
      .required('La date de constitution est requise.')
      .transform(iso8601DateToDateYupTransformation)
      .typeError(`La date de constitution n'est pas valide.`),
    origine: yup.mixed<`liste` | `projet`>().oneOf([`liste`, `projet`]),
  }),
});

v1Router.post(
  routes.POST_VALIDER_DEPOT_GARANTIES_FINANCIERES(),
  vérifierPermissionUtilisateur(PermissionValiderDépôtGarantiesFinancières),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, error }) => {
        const identifiant = request.params.identifiantProjet;
        return response.redirect(
          addQueryParams(
            request.body.origine === 'liste'
              ? routes.GET_LISTE_DEPOTS_GARANTIES_FINANCIERES_PAGE
              : routes.PROJECT_DETAILS(identifiant),
            {
              error: `Le dépôt de garanties financières n'a pas pu être validé. ${error.errors.join(
                ' ',
              )}`,
            },
          ),
        );
      },
    },
    async (request, response) => {
      const {
        user,
        params: { identifiantProjet },
        body: { typeGarantiesFinancieres, dateEcheance, dateConstitution, origine },
      } = request;

      if (!estUnRawIdentifiantProjet(identifiantProjet)) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      const redirectUrl =
        origine === 'liste'
          ? routes.GET_LISTE_DEPOTS_GARANTIES_FINANCIERES_PAGE()
          : routes.PROJECT_DETAILS(identifiantProjet);

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
        attributes: ['id', 'appelOffreId', 'periodeId', 'familleId', 'regionProjet'],
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
        return response.redirect(
          addQueryParams(redirectUrl, {
            error: `L'appel d'offres n'est pas soumis aux garanties financières.`,
          }),
        );
      }

      if (user.role === 'dreal') {
        const drealUserRegion = await UserDreal.findOne({
          where: { userId: user.id },
          attributes: ['dreal'],
        });

        if (
          !drealUserRegion ||
          (drealUserRegion && !projet.regionProjet.includes(drealUserRegion.dreal))
        ) {
          logger.error(
            new Error(
              `Echec validation garanties financières. Accès non autorité. Projet ${projet.id}`,
            ),
          );
          return response.redirect(
            addQueryParams(origine === 'liste' ? redirectUrl : routes.LISTE_PROJETS, {
              error:
                "Vous n'avez pas pu valider le dépôt de garanties financières car vous n'avez pas accès au projet",
            }),
          );
        }
      }

      const fichier = await mediator.send<ConsulterFichierDépôtAttestationGarantiesFinancièreQuery>(
        {
          type: 'CONSULTER_DÉPÔT_ATTESTATION_GARANTIES_FINANCIÈRES',
          data: {
            identifiantProjet: identifiantProjetValueType,
          },
        },
      );

      if (isNone(fichier)) {
        logger.error(
          new Error(
            `Echec validation garanties financières. Fichier non trouvé. Projet ${projet.id}`,
          ),
        );
        return response.redirect(
          addQueryParams(redirectUrl, {
            error: `Le dépôt n'a pas pu être validé, veuillez contacter un administrateur si le problème persiste.`,
          }),
        );
      }

      try {
        await mediator.send<GarantiesFinancièresUseCase>({
          type: 'VALIDER_DÉPÔT_GARANTIES_FINANCIÈRES_USE_CASE',
          data: {
            utilisateur: {
              rôle: user.role,
            },
            identifiantProjet: identifiantProjetValueType,
            typeGarantiesFinancières: typeGarantiesFinancieres,
            dateÉchéance: dateEcheance ? convertirEnDateTime(dateEcheance) : undefined,
            attestationConstitution: {
              ...fichier,
              date: convertirEnDateTime(dateConstitution),
            },
          },
        });

        return response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: 'Le dépôt de garanties financières a bien été validé',
            redirectUrl,
            redirectTitle:
              origine === 'liste'
                ? `Retourner sur la listes des dépôts à valider`
                : `Retourner sur le projet`,
          }),
        );
      } catch (error) {
        if (error instanceof DomainError) {
          return response.redirect(
            addQueryParams(redirectUrl, {
              error: error.message,
            }),
          );
        }

        logger.error(error);

        return errorResponse({ request, response });
      }
    },
  ),
);
