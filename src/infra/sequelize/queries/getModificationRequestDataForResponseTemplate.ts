import moment from 'moment'
import { okAsync } from 'neverthrow'
import { ResultAsync, errAsync, logger, ok, wrapInfra } from '../../../core/utils'
import { getAppelOffre } from '../../../dataAccess/inMemory/appelOffre'
import { makeProjectIdentifier } from '../../../entities'
import { formatDate } from '../../../helpers/formatDate'
import {
  GetModificationRequestDateForResponseTemplate,
  ModificationRequestDateForResponseTemplateDTO,
} from '../../../modules/modificationRequest'
import { EntityNotFoundError, InfraNotAvailableError } from '../../../modules/shared'

export const makeGetModificationRequestDataForResponseTemplate = (
  models
): GetModificationRequestDateForResponseTemplate => (modificationRequestId, user) => {
  const { ModificationRequest, Project, File, User } = models
  if (!ModificationRequest || !Project || !File || !User)
    return errAsync(new InfraNotAvailableError())

  return wrapInfra(
    ModificationRequest.findByPk(modificationRequestId, {
      include: [
        {
          model: Project,
          as: 'project',
        },
      ],
    })
  )
    .map((rawData: any) => rawData?.get())
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
          // check for a previous request for this project that was accepted
          return wrapInfra(
            ModificationRequest.findOne({
              where: {
                projectId,
                status: 'acceptée',
                type: 'delai',
              },
            })
          )
            .map((rawData: any) => rawData?.get())
            .map((previousRequest) => ({ modificationRequest, previousRequest }))
        }

        return okAsync({ modificationRequest, previousRequest: null })
      }
    )
    .andThen(({ modificationRequest, previousRequest }) => {
      const { type, project, requestedOn, delayInMonths, justification } = modificationRequest

      const { appelOffreId, periodeId, familleId } = project
      const appelOffre = getAppelOffre({ appelOffreId, periodeId })
      const periode = appelOffre && appelOffre.periodes.find((periode) => periode.id === periodeId)
      const famille = appelOffre && appelOffre.familles.find((famille) => famille.id === familleId)

      if (!appelOffre || !periode) {
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
      } = project

      const {
        tarifOuPrimeRetenue,
        tarifOuPrimeRetenueAlt,
        paragraphePrixReference,
        affichageParagrapheECS,
        unitePuissance,
        renvoiDemandeCompleteRaccordement,
        renvoiRetraitDesignationGarantieFinancieres,
        paragrapheDelaiDerogatoire,
        paragrapheAttestationConformite,
        paragrapheEngagementIPFP,
        renvoiModification,
        delaiRealisationTexte,
        renvoiSoumisAuxGarantiesFinancieres,
      } = appelOffre

      const commonData = {
        type,
        suiviPar: user.fullName,
        refPotentiel: makeProjectIdentifier(project),
        nomRepresentantLegal,
        nomCandidat,
        adresseCandidat: details['Adresse postale du contact'],
        email,
        titrePeriode: periode.title,
        titreAppelOffre: appelOffre.title,
        familles: appelOffre.familles.length ? 'yes' : '',
        titreFamille: familleId,
        nomProjet,
        puissance: puissance.toString(),
        codePostalProjet,
        communeProjet,
        unitePuissance,
        dateDemande: formatDate(requestedOn),
        justificationDemande: justification,
      }

      const soumisAuxGarantiesFinancieres =
        project.appelOffreId === 'Eolien' ||
        famille?.garantieFinanciereEnMois ||
        famille?.soumisAuxGarantiesFinancieres

      switch (type) {
        case 'delai':
          return ok({
            ...commonData,
            referenceParagrapheAchevement: periode.paragrapheAchevement,
            contenuParagrapheAchevement: appelOffre.contenuParagrapheAchevement,
            dateLimiteAchevementInitiale: formatDate(
              +moment(notifiedOn).add(appelOffre.delaiRealisationEnMois, 'months')
            ),
            dateLimiteAchevementActuelle: formatDate(completionDueOn),
            dateNotification: formatDate(notifiedOn),
            dureeDelaiDemandeEnMois: delayInMonths.toString(),
            ...makePreviousDelaiFromPreviousRequest(previousRequest),
          } as ModificationRequestDateForResponseTemplateDTO)
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
            eolien: appelOffreId === 'Eolien' ? 'yes' : '',
            AOInnovation: appelOffreId === 'CRE4 - Innovation' ? 'yes' : '',
            soumisGF: soumisAuxGarantiesFinancieres ? 'yes' : '',
            renvoiSoumisAuxGarantiesFinancieres,
            renvoiDemandeCompleteRaccordement,
            renvoiRetraitDesignationGarantieFinancieres,
            paragrapheDelaiDerogatoire,
            paragrapheAttestationConformite,
            paragrapheEngagementIPFP,
            renvoiModification,
            delaiRealisationTexte,
          } as ModificationRequestDateForResponseTemplateDTO)
      }

      return errAsync(new EntityNotFoundError())
    })
}

function makePreviousDelaiFromPreviousRequest(previousRequest) {
  if (!previousRequest) return { demandePrecedente: '' }

  const { requestedOn, delayInMonths, acceptanceParams, respondedOn } = previousRequest

  return {
    demandePrecedente: 'yes',
    dateDepotDemandePrecedente: formatDate(requestedOn),
    dureeDelaiDemandePrecedenteEnMois: delayInMonths.toString(),
    dateReponseDemandePrecedente: formatDate(respondedOn),
    autreDelaiDemandePrecedenteAccorde:
      delayInMonths !== acceptanceParams.delayInMonths ? 'yes' : '',
    delaiDemandePrecedenteAccordeEnMois: acceptanceParams.delayInMonths.toString(),
  }
}
