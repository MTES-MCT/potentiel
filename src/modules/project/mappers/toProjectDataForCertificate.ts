import { err, ok, Result } from '../../../core/utils'
import { makeProjectIdentifier } from '../../../entities'
import { IncompleteDataError } from '../../shared'
import { ProjectDataForCertificate } from '../dtos'
import { ProjectProps } from '../Project'

export const toProjectDataForCertificate = (
  props: ProjectProps
): Result<ProjectDataForCertificate, IncompleteDataError> => {
  const { data, appelOffre } = props

  if (!data) {
    console.error(
      'toProjectDataForCertificate failed to create DTO because project has no data prop'
    )
    return err(new IncompleteDataError())
  }

  const {
    familleId,
    prixReference,
    evaluationCarbone,
    isFinancementParticipatif,
    isInvestissementParticipatif,
    engagementFournitureDePuissanceAlaPointe,
    motifsElimination,
    note,
    nomRepresentantLegal,
    nomCandidat,
    email,
    nomProjet,
    adresseProjet,
    codePostalProjet,
    communeProjet,
    puissance,
    territoireProjet,
    numeroCRE,
  } = data

  return ok({
    appelOffre,
    isClasse: props.isClasse,
    notifiedOn: props.notifiedOn,
    familleId,
    potentielId: makeProjectIdentifier({
      appelOffreId: appelOffre.id,
      periodeId: appelOffre.periode.id,
      familleId,
      id: props.projectId.toString(),
      numeroCRE,
    }),
    prixReference,
    evaluationCarbone,
    isFinancementParticipatif,
    isInvestissementParticipatif,
    engagementFournitureDePuissanceAlaPointe,
    motifsElimination,
    note,
    nomRepresentantLegal,
    nomCandidat,
    email,
    nomProjet,
    adresseProjet,
    codePostalProjet,
    communeProjet,
    puissance,
    territoireProjet,
  })
}
