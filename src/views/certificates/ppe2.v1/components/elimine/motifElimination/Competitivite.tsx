import React from 'react'
import { ProjectDataForCertificate } from '@modules/project'
import { formatNumber } from '../../../../helpers/formatNumber'
import { getNoteThreshold } from '../../../../helpers/getNoteThreshold'

type CompetitiviteProps = {
  project: ProjectDataForCertificate
}

export const Competitivite = ({ project }: CompetitiviteProps) => {
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
