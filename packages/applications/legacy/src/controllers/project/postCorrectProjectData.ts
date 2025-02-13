import asyncHandler from '../helpers/asyncHandler';
import fs from 'fs';
import moment from 'moment-timezone';
import sanitize from 'sanitize-filename';
import { correctProjectData, ensureRole } from '../../config';
import { logger } from '../../core/utils';
import { addQueryParams } from '../../helpers/addQueryParams';
import { validateUniqueId } from '../../helpers/validateUniqueId';
import { IllegalProjectDataError, CertificateFileIsMissingError } from '../../modules/project';
import routes from '../../routes';
import { errorResponse } from '../helpers';
import { upload } from '../upload';
import { v1Router } from '../v1Router';
import { ProjetDéjàClasséError } from '../../modules/modificationRequest';
import { request } from 'http';

const FORMAT_DATE = 'DD/MM/YYYY';

v1Router.post(
  routes.ADMIN_CORRECT_PROJECT_DATA_ACTION,
  upload.single('file', (request, response, error) =>
    response.redirect(
      addQueryParams(routes.PROJECT_DETAILS(request.body.projectId), {
        error,
      }),
    ),
  ),
  ensureRole(['admin', 'dgec-validateur']),
  asyncHandler(async (request, response) => {
    if (request.body.numeroCRE || request.body.familleId || request.body.appelOffreAndPeriode) {
      return response.redirect(
        addQueryParams(routes.PROJECT_DETAILS(request.body.projectId), {
          error:
            'Vous tentez de changer une donnée non-modifiable, votre demande ne peut être prise en compte.',
          ...request.body,
        }),
      );
    }

    const {
      projectId,
      projectVersionDate,
      nomProjet,
      territoireProjet,
      puissance,
      prixReference,
      evaluationCarbone,
      note,
      nomCandidat,
      nomRepresentantLegal,
      email,
      adresseProjet,
      codePostalProjet,
      communeProjet,
      engagementFournitureDePuissanceAlaPointe,
      participatif,
      isClasse,
      motifsElimination,
      actionnariat,
    } = request.body;

    if (!validateUniqueId(projectId)) {
      return errorResponse({
        request,
        response,
        customMessage:
          'Il y a eu une erreur lors de la soumission de votre demande. Merci de recommencer.',
      });
    }

    const { isFinancementParticipatif, isInvestissementParticipatif } =
      participatif === 'investissement'
        ? { isFinancementParticipatif: false, isInvestissementParticipatif: true }
        : participatif === 'financement'
          ? { isFinancementParticipatif: true, isInvestissementParticipatif: false }
          : { isFinancementParticipatif: false, isInvestissementParticipatif: false };

    const correctedData = {
      territoireProjet: territoireProjet.length ? territoireProjet : undefined,
      nomProjet,
      puissance: Number(puissance),
      prixReference: Number(prixReference),
      evaluationCarbone: Number(evaluationCarbone),
      note: Number(note),
      nomCandidat,
      nomRepresentantLegal,
      email,
      adresseProjet,
      codePostalProjet,
      communeProjet,
      engagementFournitureDePuissanceAlaPointe: Boolean(engagementFournitureDePuissanceAlaPointe),
      isFinancementParticipatif: Boolean(isFinancementParticipatif),
      isInvestissementParticipatif: Boolean(isInvestissementParticipatif),
      motifsElimination,
      actionnariat,
    };
    const result = await correctProjectData({
      projectId,
      projectVersionDate: new Date(Number(projectVersionDate)),
      correctedData,
      user: request.user,
      shouldGrantClasse: Number(isClasse) === 1,
    });

    return result.match(
      () => {
        response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: 'Les données du projet ont bien été mises à jour.',
            redirectUrl: routes.PROJECT_DETAILS(projectId),
            redirectTitle: 'Retourner à la page projet',
          }),
        );
      },
      (e) => {
        if (e instanceof IllegalProjectDataError) {
          return response.redirect(
            addQueryParams(routes.PROJECT_DETAILS(projectId), {
              error:
                "Votre demande n'a pas pu être prise en compte: " +
                Object.entries(e.errors)
                  .map(([key, value]) => `${key} (${value})`)
                  .join(', '),
              ...request.body,
            }),
          );
        }

        if (e instanceof CertificateFileIsMissingError || e instanceof ProjetDéjàClasséError) {
          return response.redirect(
            addQueryParams(routes.PROJECT_DETAILS(projectId), {
              error: e.message,
              ...request.body,
            }),
          );
        }

        logger.error(e as Error);

        return response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(projectId), {
            error: "Votre demande n'a pas pu être prise en compte.",
            ...request.body,
          }),
        );
      },
    );
  }),
);
