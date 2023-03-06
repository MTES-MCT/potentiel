import { getDonnéesCourriersRéponse } from '@entities/donnéesCourriersRéponse';
import { getProjectAppelOffre } from '@config/queryProjectAO.config';
import { oldUserRepo } from '@config/repos.config';
import { errAsync, logger, ok, okAsync, ResultAsync, wrapInfra } from '@core/utils';
import {
  GetModificationRequestDateForResponseTemplate,
  ModificationRequestDataForResponseTemplateDTO,
} from '@modules/modificationRequest';
import { getDelaiDeRealisation } from '@modules/projectAppelOffre';
import { EntityNotFoundError, InfraNotAvailableError } from '@modules/shared';
import { formatDateToString } from '../../../../helpers/formatDateToString';
import models from '../../models';
import { Région } from '@modules/dreal/région';
import { ModificationRequest } from '../../projectionsNext/modificationRequest';
import { add, sub } from 'date-fns';

const { Project, File, User } = models;

export const getModificationRequestDataForResponseTemplate: GetModificationRequestDateForResponseTemplate =
  (modificationRequestId, user, dgecEmail) => {
    if (!ModificationRequest || !Project || !File || !User)
      return errAsync(new InfraNotAvailableError());
    return _getModificationRequestById(modificationRequestId, models)
      .andThen(
        (
          modificationRequest: any,
        ): ResultAsync<
          { modificationRequest: any; previousRequest: any },
          EntityNotFoundError | InfraNotAvailableError
        > => {
          if (!modificationRequest) return errAsync(new EntityNotFoundError());
          const { type, projectId } = modificationRequest;
          if (type === 'delai') {
            return _getPreviouslyAcceptedDelaiRequest(projectId, models).map((previousRequest) => ({
              modificationRequest,
              previousRequest,
            }));
          }

          return okAsync({ modificationRequest, previousRequest: null });
        },
      )
      .andThen(
        ({
          modificationRequest,
          previousRequest,
        }): ResultAsync<
          { dreal: Région | ''; modificationRequest; previousRequest },
          InfraNotAvailableError
        > => {
          if (user.role === 'dreal') {
            const {
              project: { regionProjet },
            } = modificationRequest;
            return wrapInfra(oldUserRepo.findDrealsForUser(user.id)).map((userDreals) => {
              // If there are multiple, use the first to coincide with the project
              const dreal = userDreals.find((dreal) => regionProjet.includes(dreal)) || '';

              return {
                dreal,
                modificationRequest,
                previousRequest,
              };
            });
          }

          return okAsync({ dreal: '', modificationRequest, previousRequest });
        },
      )
      .andThen(({ dreal, modificationRequest, previousRequest }) => {
        const {
          type,
          project,
          requestedOn,
          delayInMonths = null,
          justification,
          actionnaire,
          status,
          confirmationRequestedOn,
          confirmedOn,
          producteur,
          dateAchèvementDemandée = null,
        } = modificationRequest;

        const { appelOffreId, periodeId, familleId, technologie } = project;
        const appelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId });

        if (!appelOffre || !appelOffre?.periode) {
          logger.error(
            new Error(
              `getModificationRequestDataForResponseTemplate failed to find the appelOffre for this id ${appelOffreId}`,
            ),
          );
          return errAsync(new InfraNotAvailableError());
        }

        const {
          nomRepresentantLegal,
          nomCandidat,
          details,
          email,
          nomProjet,
          puissance,
          codePostalProjet,
          communeProjet,
          completionDueOn,
          motifsElimination,
          prixReference,
          evaluationCarbone,
          isFinancementParticipatif,
          actionnariat,
          isInvestissementParticipatif,
          engagementFournitureDePuissanceAlaPointe,
          notifiedOn,
          potentielIdentifier,
          cahierDesChargesActuel,
        } = project;

        const {
          periode,
          tarifOuPrimeRetenue,
          tarifOuPrimeRetenueAlt,
          paragraphePrixReference,
          affichageParagrapheECS,
          unitePuissance,
          renvoiDemandeCompleteRaccordement,
          renvoiRetraitDesignationGarantieFinancieres,
          paragrapheDelaiDerogatoire,
          paragrapheAttestationConformite,
          paragrapheEngagementIPFPGPFC,
          renvoiModification,
          delaiRealisationTexte,
          renvoiSoumisAuxGarantiesFinancieres,
          isSoumisAuxGF,
        } = appelOffre;

        const commonData = {
          type,
          suiviPar: user.fullName,
          suiviParEmail: user.role === 'dreal' ? user.email : dgecEmail,
          dreal,
          refPotentiel: potentielIdentifier,
          nomRepresentantLegal,
          nomCandidat,
          status,
          adresseCandidat: (details && details['Adresse postale du contact']) || '',
          email,
          titrePeriode: periode.title,
          periodeId: periode.id,
          appelOffreId: appelOffre.id,
          titreAppelOffre: `${periode.cahierDesCharges.référence} ${appelOffre.title}`,
          familles: appelOffre.familles.length ? 'yes' : '',
          titreFamille: familleId,
          nomProjet,
          puissance: puissance.toString(),
          codePostalProjet,
          communeProjet,
          unitePuissance,
          dateDemande: formatDateToString(requestedOn),
          justificationDemande: justification,
          dateNotification: formatDateToString(notifiedOn),
        };

        const {
          texteChangementDActionnariat,
          texteChangementDeProducteur,
          texteChangementDePuissance,
          texteDélaisDAchèvement,
          texteEngagementRéalisationEtModalitésAbandon,
          texteIdentitéDuProducteur,
        } = getDonnéesCourriersRéponse(cahierDesChargesActuel, appelOffre);
        switch (type) {
          case 'delai':
            return ok({
              ...commonData,
              referenceParagrapheAchevement: texteDélaisDAchèvement.référenceParagraphe,
              contenuParagrapheAchevement: texteDélaisDAchèvement.dispositions,
              dateLimiteAchevementInitiale: formatDateToString(
                sub(
                  add(notifiedOn, {
                    months: getDelaiDeRealisation(appelOffre, technologie) || 0,
                  }),
                  { days: 1 },
                ),
              ),
              dateAchèvementDemandée: dateAchèvementDemandée
                ? formatDateToString(dateAchèvementDemandée)
                : formatDateToString(
                    add(completionDueOn, {
                      months: delayInMonths,
                    }),
                  ),
              dateLimiteAchevementActuelle: formatDateToString(completionDueOn),
              ..._makePreviousDelaiFromPreviousRequest(previousRequest),
            } as ModificationRequestDataForResponseTemplateDTO);
          case 'abandon':
          case 'annulation abandon':
            return ok({
              ...commonData,
              referenceParagrapheAbandon:
                texteEngagementRéalisationEtModalitésAbandon.référenceParagraphe,
              contenuParagrapheAbandon: texteEngagementRéalisationEtModalitésAbandon.dispositions,
              dateDemandeConfirmation:
                confirmationRequestedOn && formatDateToString(confirmationRequestedOn),
              dateConfirmation: confirmedOn && formatDateToString(confirmedOn),
            } as ModificationRequestDataForResponseTemplateDTO);
          case 'actionnaire':
            return ok({
              ...commonData,
              nouvelActionnaire: actionnaire,
              referenceParagrapheActionnaire: texteChangementDActionnariat.référenceParagraphe,
              contenuParagrapheActionnaire: texteChangementDActionnariat.dispositions,
            } as ModificationRequestDataForResponseTemplateDTO);
          case 'recours':
            return ok({
              ...commonData,
              prixReference: prixReference.toString(),
              evaluationCarbone: evaluationCarbone.toString(),
              isFinancementParticipatif: isFinancementParticipatif ? 'yes' : '',
              isInvestissementParticipatif: isInvestissementParticipatif ? 'yes' : '',
              isEngagementParticipatif:
                isFinancementParticipatif || isInvestissementParticipatif ? 'yes' : '',
              engagementFournitureDePuissanceAlaPointe: engagementFournitureDePuissanceAlaPointe
                ? 'yes'
                : '',

              nonInstruit: motifsElimination.toLowerCase().includes('non instruit') ? 'yes' : '',
              motifsElimination,
              tarifOuPrimeRetenue,
              tarifOuPrimeRetenueAlt,
              paragraphePrixReference,
              affichageParagrapheECS: affichageParagrapheECS ? 'yes' : '',
              unitePuissance,
              eolien: appelOffre.type === 'eolien' ? 'yes' : '',
              AOInnovation: appelOffre.type === 'innovation' ? 'yes' : '',
              soumisGF: isSoumisAuxGF ? 'yes' : '',
              renvoiSoumisAuxGarantiesFinancieres,
              renvoiDemandeCompleteRaccordement,
              renvoiRetraitDesignationGarantieFinancieres,
              paragrapheDelaiDerogatoire,
              paragrapheAttestationConformite,
              paragrapheEngagementIPFPGPFC,
              renvoiModification,
              delaiRealisationTexte,
              isFinancementCollectif: actionnariat === 'financement-collectif' ? 'yes' : '',
              isGouvernancePartagée: actionnariat === 'gouvernance-partagee' ? 'yes' : '',
            } as ModificationRequestDataForResponseTemplateDTO);

          case 'puissance':
            const { puissance: puissanceActuelle } = modificationRequest.project;
            const {
              project: { puissanceInitiale },
              puissance: nouvellePuissance,
            } = modificationRequest;

            return ok({
              ...commonData,
              puissanceInitiale:
                puissanceInitiale !== puissanceActuelle ? puissanceInitiale : undefined,
              nouvellePuissance,
              puissanceActuelle,
              referenceParagraphePuissance: texteChangementDePuissance.référenceParagraphe,
              contenuParagraphePuissance: texteChangementDePuissance.dispositions,
            } as ModificationRequestDataForResponseTemplateDTO);

          case 'producteur':
            return ok({
              ...commonData,
              nouveauProducteur: producteur,
              referenceParagrapheIdentiteProducteur: texteIdentitéDuProducteur.référenceParagraphe,
              contenuParagrapheIdentiteProducteur: texteIdentitéDuProducteur.dispositions,
              referenceParagrapheChangementProducteur:
                texteChangementDeProducteur.référenceParagraphe,
              contenuParagrapheChangementProducteur: texteChangementDeProducteur.dispositions,
            } as ModificationRequestDataForResponseTemplateDTO);
        }

        return errAsync(new EntityNotFoundError());
      });
  };

function _getModificationRequestById(modificationRequestId, models) {
  const { ModificationRequest, Project } = models;

  return wrapInfra(
    ModificationRequest.findByPk(modificationRequestId, {
      include: [
        {
          model: Project,
          as: 'project',
        },
      ],
    }),
  ).map((rawData: any) => rawData?.get());
}

function _getPreviouslyAcceptedDelaiRequest(projectId, models) {
  const { ModificationRequest } = models;

  return wrapInfra(
    ModificationRequest.findOne({
      where: {
        projectId,
        status: 'acceptée',
        type: 'delai',
      },
    }),
  ).map((rawData: any) => rawData?.get());
}

function _makePreviousDelaiFromPreviousRequest(previousRequest) {
  if (!previousRequest) return { demandePrecedente: '' };

  const {
    requestedOn,
    delayInMonths = null,
    acceptanceParams,
    respondedOn,
    isLegacy,
    dateAchèvementDemandée,
  } = previousRequest;

  if (isLegacy) {
    const legacyDelay = monthDiff(
      new Date(acceptanceParams.ancienneDateLimiteAchevement),
      new Date(acceptanceParams.nouvelleDateLimiteAchevement),
    );
    return {
      demandePrecedente: 'yes',
      dateDepotDemandePrecedente: formatDateToString(requestedOn),
      dureeDelaiDemandePrecedenteEnMois: legacyDelay.toString(),
      dateReponseDemandePrecedente: formatDateToString(respondedOn),
      autreDelaiDemandePrecedenteAccorde: '',
      delaiDemandePrecedenteAccordeEnMois: legacyDelay.toString(),
    };
  }
  const common = {
    demandePrecedente: 'yes',
    dateDepotDemandePrecedente: formatDateToString(requestedOn),
    dateReponseDemandePrecedente: formatDateToString(respondedOn),
  };

  if (dateAchèvementDemandée) {
    return {
      ...common,
      dateDemandePrecedenteDemandée: formatDateToString(dateAchèvementDemandée),
      dateDemandePrecedenteAccordée: formatDateToString(acceptanceParams.dateAchèvementAccordée),
      demandeEnDate: 'yes',
      autreDelaiDemandePrecedenteAccorde:
        dateAchèvementDemandée !== acceptanceParams.dateAchèvementAccordée ? 'yes' : '',
    };
  }

  if (delayInMonths) {
    return {
      ...common,
      demandeEnMois: 'yes',
      dureeDelaiDemandePrecedenteEnMois: delayInMonths.toString(),
      ...(acceptanceParams.delayInMonths && {
        delaiDemandePrecedenteAccordeEnMois: acceptanceParams.delayInMonths.toString(),
        autreDelaiDemandePrecedenteAccorde:
          delayInMonths !== acceptanceParams.delayInMonths ? 'yes' : '',
      }),
      ...(acceptanceParams.dateAchèvementAccordée && {
        demandeEnMoisAccordéeEnDate: 'yes',
        dateDemandePrecedenteAccordée: formatDateToString(acceptanceParams.dateAchèvementAccordée),
        autreDelaiDemandePrecedenteAccorde:
          dateAchèvementDemandée !== acceptanceParams.dateAchèvementAccordée ? 'yes' : '',
      }),
    };
  }

  return { demandePrecedente: '' };
}

function monthDiff(dateFrom, dateTo) {
  return (
    dateTo.getMonth() - dateFrom.getMonth() + 12 * (dateTo.getFullYear() - dateFrom.getFullYear())
  );
}
