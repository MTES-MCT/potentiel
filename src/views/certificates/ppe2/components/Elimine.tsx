import { Text } from '@react-pdf/renderer'
import React from 'react'
import { logger } from '@core/utils'
import { ProjectDataForCertificate } from '@modules/project/dtos'
import { formatNumber } from '../helpers/formatNumber'
import { estSoumisAuxGFs } from '../helpers/estSoumisAuxGFs'

type ElimineProps = { project: ProjectDataForCertificate }
export const Elimine = ({ project }: ElimineProps) => {
  const {
    motifsElimination,
    appelOffre: { renvoiRetraitDesignationGarantieFinancieres },
  } = project

  const soumisAuxGarantiesFinancieres = estSoumisAuxGFs(project)

  let motif: React.ReactNode = <AutreMotif {...{ motifsElimination }} />

  if (motifsElimination === 'Au-dessus de Pcible') {
    motif = <AuDessusDePcible {...{ project }} />
  }

  if (motifsElimination === 'Déjà lauréat - Non instruit') {
    motif = <DejaLaureatNonInstruit />
  }

  if (motifsElimination.includes('20%') && motifsElimination.includes('compétitivité')) {
    motif = <Competitivite {...{ project }} />
  }

  return (
    <>
      <Text style={{ marginTop: 10 }}>{motif}</Text>
      {soumisAuxGarantiesFinancieres && (
        <Text style={{ marginTop: 10 }}>
          Conformément au paragraphe {renvoiRetraitDesignationGarantieFinancieres} la garantie
          financière est annulée automatiquement.
        </Text>
      )}
      <Text style={{ marginTop: 10 }}>
        Vous avez la possibilité de contester la présente décision auprès du tribunal administratif
        territorialement compétent dans un délai de deux mois à compter de sa date de notification.
      </Text>
    </>
  )
}

const AuDessusDePcible = ({ project }) => {
  const { appelOffre } = project

  return (
    <>
      A la suite de l’instruction par les services de la Commission de régulation de l’énergie, je
      suis au regret de vous informer que votre offre a été classée au-delà de la puissance offerte
      pour cette période de candidature
      {appelOffre.familles.length ? ' dans la famille concernée' : ''}. Votre offre a en effet
      obtenu une note de {formatNumber(project.note)} points alors qu’à la suite du classement des
      dossiers, il apparaît que le volume appelé
      {appelOffre.familles.length ? ' pour cette famille' : ''}
      {appelOffre.familles.length && appelOffre.afficherPhraseRegionImplantation ? ', et' : ''}
      {appelOffre.afficherPhraseRegionImplantation
        ? ' pour la région d’implantation du projet définis au 1.2.2 du cahier des charges'
        : ''}{' '}
      a été atteint avec les offres ayant des notes supérieures à{' '}
      {formatNumber(getNoteThreshold(project))} points. Par conséquent, cette offre n’a pas été
      retenue. `
    </>
  )
}

const Competitivite = ({ project }) => {
  const { appelOffre } = project

  return (
    <>
      À la suite de l'instruction par les services de la Commission de régulation de l’énergie, je
      suis au regret de vous informer que votre offre a été classée au-delà de la puissance maximale
      que la Ministre a décidé de retenir afin de préserver la compétitivité de l’appel d’offres en
      application des dispositions du paragraphe {appelOffre.paragrapheClauseCompetitivite} du
      cahier des charges. Votre offre a en effet obtenu une note de {formatNumber(project.note)}{' '}
      points alors que la sélection des offres s’est faite jusqu’à la note de{' '}
      {formatNumber(getNoteThreshold(project))} points. Par conséquent, cette offre n’a pas été
      retenue.
    </>
  )
}

const DejaLaureatNonInstruit = () => (
  <>
    À la suite de l'instruction par les services de la Commission de régulation de l’énergie, je
    suis au regret de vous informer que votre offre n’a pas été retenue car elle avait déjà été
    désignée lauréate au cours d’un précédent appel d’offres.
  </>
)

const AutreMotif = ({ motifsElimination }) => (
  <>
    À la suite de l'instruction par les services de la Commission de régulation de l’énergie, je
    suis au regret de vous informer que votre offre a été éliminée pour le motif suivant : «{' '}
    {motifsElimination} ». Par conséquent, cette offre n’a pas été retenue.
  </>
)

const getNoteThreshold = (project: ProjectDataForCertificate) => {
  const periode = project.appelOffre.periode

  if (!periode.noteThresholdByFamily) {
    logger.error(
      `candidateCertificate: looking for noteThresholdByFamily for a period that has none. Periode Id : ${periode.id}`
    )
    return 'N/A'
  }

  if (project.territoireProjet && project.territoireProjet.length) {
    const note = periode.noteThresholdByFamily.find(
      (item) => item.familleId === project.familleId && item.territoire === project.territoireProjet
    )?.noteThreshold

    if (!note) {
      logger.error(
        `candidateCertificate: looking for noteThreshold for periode: ${periode.id}, famille: ${project.familleId} and territoire: ${project.territoireProjet} but could not find it`
      )
      return 'N/A'
    }

    return note
  }

  const note = periode.noteThresholdByFamily.find(
    (item) => item.familleId === project.familleId
  )?.noteThreshold

  if (!note) {
    logger.error(
      `candidateCertificate: looking for noteThreshold for periode: ${periode.id} and famille: ${project.familleId} but could not find it`
    )
    return 'N/A'
  }

  return note
}
