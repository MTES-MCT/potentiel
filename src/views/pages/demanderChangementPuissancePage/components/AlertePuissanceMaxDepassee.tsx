import React from 'react'
import { getVolumeReserve } from '@modules/modificationRequest'
import { ProjectAppelOffre } from '@entities'

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
    <div className="notification warning mt-4">
      Une autorisation est nécessaire si la modification de puissance dépasse la puissance maximum
      de {reservedVolume.puissanceMax} {appelOffre.unitePuissance} du volume reservé de l'appel
      d'offre. Dans ce cas{' '}
      <strong>il est nécessaire de joindre un justificatif à votre demande</strong>.
    </div>
  ) : null
}
