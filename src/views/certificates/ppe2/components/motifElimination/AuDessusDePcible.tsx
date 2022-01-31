import React from 'react'
import { ProjectDataForCertificate } from 'src/modules/project'
import { formatNumber } from '../../helpers/formatNumber'
import { getNoteThreshold } from '../../helpers/getNoteThreshold'

type AuDessusDePcibleProps = {
  project: ProjectDataForCertificate
}

export const AuDessusDePcible = ({ project }: AuDessusDePcibleProps) => {
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
