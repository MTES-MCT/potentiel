import asyncHandler from '../helpers/asyncHandler';
import { ensureRole, getIdentifiantProjetByLegacyId } from '../../config';
import routes from '../../routes';
import { shouldUserAccessProject } from '../../useCases';
import { v1Router } from '../v1Router';
import { validateUniqueId } from '../../helpers/validateUniqueId';
import { notFoundResponse, unauthorizedResponse } from '../helpers';

import { ModèleRéponseSignée } from '@potentiel-applications/document-builder';
import { ModificationRequest, Project } from '../../infra/sequelize';
import { mediator } from 'mediateur';
import { CahierDesCharges, Lauréat, ReprésentantLégal } from '@potentiel-domain/laureat';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/candidature';
import { mapToPuissanceModèleRéponseProps } from './_utils/modèles/puissance';
import { logger } from '../../core/utils';
import { docxContentType, downloadFile } from './_utils/downloadFile';
import { ReadableStream } from 'stream/web';
import { mapToDélaiModèleRéponseProps, DemandePrécédente } from './_utils/modèles/délai';
import { getDelaiDeRealisation } from '../../modules/projectAppelOffre';

v1Router.get(
  routes.TELECHARGER_MODELE_REPONSE(),
  ensureRole(['admin', 'dgec-validateur', 'dreal']),
  asyncHandler(async (request, response) => {
    const { projectId, modificationRequestId } = request.params;

    if (!validateUniqueId(projectId) || !validateUniqueId(modificationRequestId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
    }

    // Verify that the current user has the rights to check this out
    if (!(await shouldUserAccessProject({ user: request.user, projectId }))) {
      return unauthorizedResponse({ request, response });
    }

    const identifiantProjetValue = await getIdentifiantProjetByLegacyId(projectId);
    const modificationRequest = await ModificationRequest.findByPk(modificationRequestId, {
      include: [
        {
          model: Project,
          as: 'project',
        },
      ],
    });

    if (!identifiantProjetValue || !modificationRequest) {
      return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
    }
    const identifiantProjet = IdentifiantProjet.bind(identifiantProjetValue);

    const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
      type: 'Lauréat.Query.ConsulterLauréat',
      data: { identifiantProjet: identifiantProjet.formatter() },
    });

    const appelOffres = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: { identifiantAppelOffre: identifiantProjet.appelOffre },
    });

    const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: { identifiantProjet: identifiantProjet.formatter() },
    });
    const cahierDesChargesChoisi =
      await mediator.send<CahierDesCharges.ConsulterCahierDesChargesChoisiQuery>({
        type: 'Lauréat.CahierDesCharges.Query.ConsulterCahierDesChargesChoisi',
        data: { identifiantProjet: identifiantProjet.formatter() },
      });

    const représentantLégal =
      await mediator.send<ReprésentantLégal.ConsulterReprésentantLégalQuery>({
        type: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

    if (
      Option.isNone(lauréat) ||
      Option.isNone(appelOffres) ||
      Option.isNone(candidature) ||
      Option.isNone(cahierDesChargesChoisi)
    ) {
      return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
    }

    if (modificationRequest.type === 'puissance') {
      const content = await ModèleRéponseSignée.générerModèleRéponseAdapter({
        type: 'puissance',
        data: mapToPuissanceModèleRéponseProps({
          identifiantProjet,
          lauréat,
          appelOffres,
          candidature,
          cahierDesChargesChoisi,
          représentantLégal,
          dateDemande: new Date(modificationRequest.requestedOn),
          justification: modificationRequest.justification ?? '',
          nouvellePuissance: modificationRequest.puissance!,
          puissanceActuelle: modificationRequest.project.puissance,
          utilisateur: { nom: request.user.fullName },
        }),
      });

      return downloadFile(response, {
        filename: `réponse-changement-puissance-${lauréat.nomProjet.replaceAll(' ', '_')}.docx`,
        content: content as ReadableStream<any>,
        contentType: docxContentType,
      });
    } else if (modificationRequest.type === 'delai') {
      const previousRequest = await ModificationRequest.findOne({
        where: {
          projectId,
          status: 'acceptée',
          type: 'delai',
        },
      });
      const completionDueOn = new Date(modificationRequest.project.completionDueOn);
      const notifiedOn = new Date(modificationRequest.project.notifiedOn);
      const délaiAO = getDelaiDeRealisation(
        appelOffres,
        modificationRequest.project.technologie ?? 'N/A',
      );

      const dateLimiteAchevementInitiale = DateTime.convertirEnValueType(notifiedOn)
        .ajouterNombreDeMois(délaiAO ?? 0)
        .retirerNombreDeJours(1).date;

      // NB toutes les modificationRequests ont une `dateAchèvementDemandée` depuis 2022,
      // mais il reste des demandes avec statut "demandé" qui n'en ont pas.
      const dateAchèvementDemandée = modificationRequest.dateAchèvementDemandée
        ? modificationRequest.dateAchèvementDemandée
        : DateTime.convertirEnValueType(completionDueOn).ajouterNombreDeMois(
            modificationRequest.delayInMonths ?? 0,
          ).date;

      const content = await ModèleRéponseSignée.générerModèleRéponseAdapter({
        type: 'délai',
        data: mapToDélaiModèleRéponseProps({
          identifiantProjet,
          lauréat,
          appelOffres,
          candidature,
          cahierDesChargesChoisi,
          représentantLégal,
          dateDemande: new Date(modificationRequest.requestedOn),
          justification: modificationRequest.justification ?? '',
          puissanceActuelle: modificationRequest.project.puissance,
          utilisateur: { nom: request.user.fullName },
          dateAchèvementDemandée,
          dateLimiteAchevementActuelle: completionDueOn,
          dateLimiteAchevementInitiale,
          demandePrécédente: getDemandePrécédente(previousRequest),
        }),
      });

      return downloadFile(response, {
        filename: `réponse-délai-${lauréat.nomProjet.replaceAll(' ', '_')}.docx`,
        content: content as ReadableStream<any>,
        contentType: docxContentType,
      });
    }

    logger.warning(`Modèle de documents inexistant pour ${modificationRequest.type}`);
    return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
  }),
);

const getDemandePrécédente = (
  previousRequest: ModificationRequest | null,
): DemandePrécédente | undefined => {
  if (!previousRequest) return undefined;

  const { dateAchèvementDemandée, delayInMonths, requestedOn, acceptanceParams, respondedOn } =
    previousRequest;

  if (!acceptanceParams || !respondedOn) return undefined;

  if (dateAchèvementDemandée) {
    const dateAchevementAccordéeEstCelleDemandée =
      dateAchèvementDemandée.toString() === String(acceptanceParams.dateAchèvementAccordée);
    return {
      dateDepotDemandePrecedente: new Date(requestedOn),
      dateReponseDemandePrecedente: new Date(respondedOn),
      dateDemandePrecedenteDemandée: new Date(dateAchèvementDemandée),
      dateDemandePrecedenteAccordée: new Date(acceptanceParams.dateAchèvementAccordée),
      demandeEnDate: true,
      autreDelaiDemandePrecedenteAccorde: !dateAchevementAccordéeEstCelleDemandée,
    };
  }

  if (delayInMonths) {
    if (acceptanceParams.delayInMonths) {
      return {
        dateDepotDemandePrecedente: new Date(requestedOn),
        dateReponseDemandePrecedente: new Date(respondedOn),
        demandeEnMois: true,
        dureeDelaiDemandePrecedenteEnMois: delayInMonths,

        delaiDemandePrecedenteAccordeEnMois: Number(acceptanceParams.delayInMonths),
        autreDelaiDemandePrecedenteAccorde: delayInMonths !== acceptanceParams.delayInMonths,
      };
    }
    if (acceptanceParams.dateAchèvementAccordée) {
      return {
        dateDepotDemandePrecedente: new Date(requestedOn),
        dateReponseDemandePrecedente: new Date(respondedOn),
        demandeEnMois: true,
        dureeDelaiDemandePrecedenteEnMois: delayInMonths,

        demandeEnMoisAccordéeEnDate: true,
        dateDemandePrecedenteAccordée: new Date(acceptanceParams.dateAchèvementAccordée),
        autreDelaiDemandePrecedenteAccorde: true,
      };
    }
  }
};
