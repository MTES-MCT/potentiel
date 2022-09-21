import { getProjectAppelOffre } from '@config/queries.config'
import { oldUserRepo } from '@config/repos.config'
import { errAsync, logger, ok, okAsync, ResultAsync, wrapInfra } from '@core/utils'
import { DREAL } from '@entities'
import {
  GetModificationRequestDateForResponseTemplate,
  ModificationRequestDataForResponseTemplateDTO,
} from '@modules/modificationRequest'
import { getDelaiDeRealisation } from '@modules/projectAppelOffre'
import { EntityNotFoundError, InfraNotAvailableError } from '@modules/shared'
import moment from 'moment'
import { formatDate } from '../../../../helpers/formatDate'
import models from '../../models'

const { ModificationRequest, Project, File, User } = models

export const getModificationRequestDataForResponseTemplate: GetModificationRequestDateForResponseTemplate =
  (modificationRequestId, user, dgecEmail) => {
    if (!ModificationRequest || !Project || !File || !User)
      return errAsync(new InfraNotAvailableError())

    return _getModificationRequestById(modificationRequestId, models)
      .andThen(
        (
          modificationRequest: any
        ): ResultAsync<
          { modificationRequest: any; previousRequest: any },
          EntityNotFoundError | InfraNotAvailableError
        > => {
          if (!modificationRequest) return errAsync(new EntityNotFoundError())
          const { type, projectId } = modificationRequest
          if (type === 'delai') {
            return _getPreviouslyAcceptedDelaiRequest(projectId, models).map((previousRequest) => ({
              modificationRequest,
              previousRequest,
            }))
          }

          return okAsync({ modificationRequest, previousRequest: null })
        }
      )
      .andThen(
        ({
          modificationRequest,
          previousRequest,
        }): ResultAsync<
          { dreal: DREAL | ''; modificationRequest; previousRequest },
          InfraNotAvailableError
        > => {
          if (user.role === 'dreal') {
            const {
              project: { regionProjet },
            } = modificationRequest
            return wrapInfra(oldUserRepo.findDrealsForUser(user.id)).map((userDreals) => {
              // If there are multiple, use the first to coincide with the project
              const dreal = userDreals.find((dreal) => regionProjet.includes(dreal)) || ''

              return {
                dreal,
                modificationRequest,
                previousRequest,
              }
            })
          }

          return okAsync({ dreal: '', modificationRequest, previousRequest })
        }
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
        } = modificationRequest

        const { appelOffreId, periodeId, familleId, technologie } = project
        const appelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId })

        if (!appelOffre || !appelOffre?.periode) {
          logger.error(
            new Error(
              `getModificationRequestDataForResponseTemplate failed to find the appelOffre for this id ${appelOffreId}`
            )
          )
          return errAsync(new InfraNotAvailableError())
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
          isInvestissementParticipatif,
          engagementFournitureDePuissanceAlaPointe,
          notifiedOn,
          potentielIdentifier,
          nouvellesRèglesDInstructionChoisies,
        } = project

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
          texteDélaisDAchèvement,
          texteEngagementRéalisationEtModalitésAbandon,
          texteChangementDActionnariat,
          texteChangementDePuissance: texteChangementDePuissance,
          texteIdentitéDuProducteur,
          texteChangementDeProducteur,
          cahiersDesChargesModifiésDisponibles,
        } = appelOffre

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
          titreAppelOffre: `${periode.cahierDesCharges.référence} ${appelOffre.title}`,
          familles: appelOffre.familles.length ? 'yes' : '',
          titreFamille: familleId,
          nomProjet,
          puissance: puissance.toString(),
          codePostalProjet,
          communeProjet,
          unitePuissance,
          dateDemande: formatDate(requestedOn),
          justificationDemande: justification,
          dateNotification: formatDate(notifiedOn),
        }

        switch (type) {
          case 'delai':
            let contenuParagrapheAchevement = '!!!CONTENU NON DISPONIBLE!!!'
            let referenceParagrapheAchevement = '!!!REFERENCE NON DISPONIBLE!!!'

            if (
              nouvellesRèglesDInstructionChoisies &&
              cahiersDesChargesModifiésDisponibles[0].texteDélaisDAchèvement
            ) {
              contenuParagrapheAchevement =
                cahiersDesChargesModifiésDisponibles[0].texteDélaisDAchèvement.dispositions
              referenceParagrapheAchevement =
                cahiersDesChargesModifiésDisponibles[0].texteDélaisDAchèvement.référenceParagraphe
            } else if (periode.texteDélaisDAchèvement) {
              contenuParagrapheAchevement = periode.texteDélaisDAchèvement.dispositions
              referenceParagrapheAchevement = periode.texteDélaisDAchèvement.référenceParagraphe
            } else if (appelOffre.texteDélaisDAchèvement) {
              contenuParagrapheAchevement = appelOffre.texteDélaisDAchèvement.dispositions
              referenceParagrapheAchevement = appelOffre.texteDélaisDAchèvement.référenceParagraphe
            }
            return ok({
              ...commonData,
              referenceParagrapheAchevement,
              contenuParagrapheAchevement,
              dateLimiteAchevementInitiale: formatDate(
                Number(
                  moment(notifiedOn)
                    .add(getDelaiDeRealisation(appelOffre, technologie), 'months')
                    .subtract(1, 'day')
                ),
                'DD/MM/YYYY'
              ),
              dateAchèvementDemandée: dateAchèvementDemandée
                ? formatDate(dateAchèvementDemandée)
                : formatDate(Number(moment(completionDueOn).add(delayInMonths, 'months'))),
              dateLimiteAchevementActuelle: formatDate(completionDueOn),
              ..._makePreviousDelaiFromPreviousRequest(previousRequest),
            } as ModificationRequestDataForResponseTemplateDTO)
          case 'abandon':
            return ok({
              ...commonData,
              referenceParagrapheAbandon:
                texteEngagementRéalisationEtModalitésAbandon.référenceParagraphe ||
                'REFERENCE NON DISPONIBLE',
              contenuParagrapheAbandon:
                texteEngagementRéalisationEtModalitésAbandon.dispositions ||
                'CONTENU NON DISPONIBLE',
              dateDemandeConfirmation:
                confirmationRequestedOn && formatDate(confirmationRequestedOn),
              dateConfirmation: confirmedOn && formatDate(confirmedOn),
            } as ModificationRequestDataForResponseTemplateDTO)
          case 'actionnaire':
            return ok({
              ...commonData,
              nouvelActionnaire: actionnaire,
              referenceParagrapheActionnaire: texteChangementDActionnariat
                ? texteChangementDActionnariat.référenceParagraphe
                : '!!!REFERENCE NON DISPONIBLE!!!',
              contenuParagrapheActionnaire: texteChangementDActionnariat
                ? texteChangementDActionnariat.dispositions
                : '!!!CONTENU NON DISPONIBLE!!!',
            } as ModificationRequestDataForResponseTemplateDTO)
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
            } as ModificationRequestDataForResponseTemplateDTO)

          case 'puissance':
            const { puissance: puissanceActuelle } = modificationRequest.project
            const {
              project: { puissanceInitiale },
              puissance: nouvellePuissance,
            } = modificationRequest

            let contenuParagraphePuissance = '!!!CONTENU NON DISPONIBLE!!!'
            let referenceParagraphePuissance = '!!!REFERENCE NON DISPONIBLE!!!'

            if (
              nouvellesRèglesDInstructionChoisies &&
              cahiersDesChargesModifiésDisponibles[0].texteChangementDePuissance
            ) {
              contenuParagraphePuissance =
                cahiersDesChargesModifiésDisponibles[0].texteChangementDePuissance.dispositions
              referenceParagraphePuissance =
                cahiersDesChargesModifiésDisponibles[0].texteChangementDePuissance
                  .référenceParagraphe
            } else if (periode.texteChangementDePuissance) {
              contenuParagraphePuissance = periode.texteChangementDePuissance.dispositions
              referenceParagraphePuissance = periode.texteChangementDePuissance.référenceParagraphe
            } else if (appelOffre.texteChangementDePuissance) {
              contenuParagraphePuissance = appelOffre.texteChangementDePuissance.dispositions
              referenceParagraphePuissance =
                appelOffre.texteChangementDePuissance.référenceParagraphe
            }

            return ok({
              ...commonData,
              puissanceInitiale:
                puissanceInitiale !== puissanceActuelle ? puissanceInitiale : undefined,
              nouvellePuissance,
              puissanceActuelle,
              referenceParagraphePuissance,
              contenuParagraphePuissance,
            } as ModificationRequestDataForResponseTemplateDTO)

          case 'producteur':
            return ok({
              ...commonData,
              nouveauProducteur: producteur,
              referenceParagrapheIdentiteProducteur: texteIdentitéDuProducteur
                ? texteIdentitéDuProducteur.référenceParagraphe
                : '!!!REFERENCE NON DISPONIBLE!!!',
              contenuParagrapheIdentiteProducteur: texteIdentitéDuProducteur
                ? texteIdentitéDuProducteur.dispositions
                : '!!!CONTENU NON DISPONIBLE!!!',
              referenceParagrapheChangementProducteur: texteChangementDeProducteur
                ? texteChangementDeProducteur.référenceParReagraphe
                : '!!!REFERENCE NON DISPONIBLE!!!',
              contenuParagrapheChangementProducteur: texteChangementDeProducteur
                ? texteChangementDeProducteur.dispositions
                : '!!!CONTENU NON DISPONIBLE!!!',
            } as ModificationRequestDataForResponseTemplateDTO)
        }

        return errAsync(new EntityNotFoundError())
      })
  }

function _getModificationRequestById(modificationRequestId, models) {
  const { ModificationRequest, Project } = models

  return wrapInfra(
    ModificationRequest.findByPk(modificationRequestId, {
      include: [
        {
          model: Project,
          as: 'project',
        },
      ],
    })
  ).map((rawData: any) => rawData?.get())
}

function _getPreviouslyAcceptedDelaiRequest(projectId, models) {
  const { ModificationRequest } = models

  return wrapInfra(
    ModificationRequest.findOne({
      where: {
        projectId,
        status: 'acceptée',
        type: 'delai',
      },
    })
  ).map((rawData: any) => rawData?.get())
}

function _makePreviousDelaiFromPreviousRequest(previousRequest) {
  if (!previousRequest) return { demandePrecedente: '' }

  const {
    requestedOn,
    delayInMonths = null,
    acceptanceParams,
    respondedOn,
    isLegacy,
    dateAchèvementDemandée,
  } = previousRequest

  if (isLegacy) {
    const legacyDelay = monthDiff(
      new Date(acceptanceParams.ancienneDateLimiteAchevement),
      new Date(acceptanceParams.nouvelleDateLimiteAchevement)
    )
    return {
      demandePrecedente: 'yes',
      dateDepotDemandePrecedente: formatDate(requestedOn),
      dureeDelaiDemandePrecedenteEnMois: legacyDelay.toString(),
      dateReponseDemandePrecedente: formatDate(respondedOn),
      autreDelaiDemandePrecedenteAccorde: '',
      delaiDemandePrecedenteAccordeEnMois: legacyDelay.toString(),
    }
  }
  const common = {
    demandePrecedente: 'yes',
    dateDepotDemandePrecedente: formatDate(requestedOn),
    dateReponseDemandePrecedente: formatDate(respondedOn),
  }

  if (dateAchèvementDemandée) {
    return {
      ...common,
      dateDemandePrecedenteDemandée: formatDate(dateAchèvementDemandée),
      dateDemandePrecedenteAccordée: formatDate(acceptanceParams.dateAchèvementAccordée),
      demandeEnDate: 'yes',
      autreDelaiDemandePrecedenteAccorde:
        dateAchèvementDemandée !== acceptanceParams.dateAchèvementAccordée ? 'yes' : '',
    }
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
        dateDemandePrecedenteAccordée: formatDate(acceptanceParams.dateAchèvementAccordée),
        autreDelaiDemandePrecedenteAccorde:
          dateAchèvementDemandée !== acceptanceParams.dateAchèvementAccordée ? 'yes' : '',
      }),
    }
  }

  return { demandePrecedente: '' }
}

function monthDiff(dateFrom, dateTo) {
  return (
    dateTo.getMonth() - dateFrom.getMonth() + 12 * (dateTo.getFullYear() - dateFrom.getFullYear())
  )
}
