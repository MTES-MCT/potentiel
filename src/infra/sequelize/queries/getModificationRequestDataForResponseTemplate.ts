import { err, errAsync, logger, ok, wrapInfra } from '../../../core/utils'
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
  ).andThen((modificationRequestRaw: any) => {
    if (!modificationRequestRaw) return err(new EntityNotFoundError())

    const {
      type,
      project,
      requestedOn,
      delayInMonths,
      justification,
    } = modificationRequestRaw.get()

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
          dateLimiteAchevement: formatDate(completionDueOn),
          dateNotification: formatDate(notifiedOn),
          dureeDelaiDemandeEnMois: delayInMonths.toString(),
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
