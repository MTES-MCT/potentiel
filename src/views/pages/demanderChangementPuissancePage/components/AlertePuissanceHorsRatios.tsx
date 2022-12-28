import React from 'react'
import { ProjectAppelOffre, Technologie } from '@entities'
import { getRatiosChangementPuissance } from '@modules/modificationRequest'

type AlertOnPuissanceOutsideRatiosProps = {
  project: {
    appelOffre?: ProjectAppelOffre
    technologie: Technologie
  }
}
export const AlertePuissanceHorsRatios = ({ project }: AlertOnPuissanceOutsideRatiosProps) => {
  const { min, max } = getRatiosChangementPuissance(project)

  return (
    <div className="notification warning mt-4">
      Une autorisation est nécessaire si la modification de puissance est inférieure à{' '}
      {Math.round(min * 100)}% de la puissance initiale ou supérieure à {Math.round(max * 100)}%.
      Dans ces cas <strong>il est nécessaire de joindre un justificatif à votre demande</strong>.
    </div>
  )
}
