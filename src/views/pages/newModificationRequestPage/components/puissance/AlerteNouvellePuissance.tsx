import { ProjectAppelOffre, Technologie } from '@entities'
import React from 'react'
import { getRatiosChangementPuissance, getVolumeReserve } from '@modules/modificationRequest'

type AlertOnPuissanceExceedMaxProps = {
  project: {
    appelOffre?: ProjectAppelOffre
  }
}
export const AlertePuissanceMaxDepassee = ({ project }: AlertOnPuissanceExceedMaxProps) => {
  if (!project.appelOffre) {
    return null
  }

  const { appelOffre } = project
  const reservedVolume = getVolumeReserve(appelOffre)

  return reservedVolume ? (
    <>
      Une autorisation est nécessaire si la modification de puissance dépasse la puissance maximum
      de {reservedVolume.puissanceMax} {appelOffre.unitePuissance} du volume reservé de l'appel
      d'offre. Dans ce cas{' '}
      <strong>il est nécessaire de joindre un justificatif à votre demande</strong>.
    </>
  ) : null
}

type AlertOnPuissanceOutsideRatiosProps = {
  project: {
    appelOffre?: ProjectAppelOffre
    technologie: Technologie
  }
}
export const AlertePuissanceHorsRatios = ({ project }: AlertOnPuissanceOutsideRatiosProps) => {
  const { min, max } = getRatiosChangementPuissance(project)

  return (
    <>
      Une autorisation est nécessaire si la modification de puissance est inférieure à{' '}
      {Math.round(min * 100)}% de la puissance initiale ou supérieure à {Math.round(max * 100)}%.
      Dans ces cas <strong>il est nécessaire de joindre un justificatif à votre demande</strong>.
    </>
  )
}
