import React from 'react'
import { dataId } from '../../../../helpers/testId'

type AlertOnPuissanceValueProps =
  | {
      reason: 'puissance-max-volume-reseve-depassée'
      puissanceMax: number
    }
  | {
      reason: 'hors-ratios-autorisés'
      ratios: {
        min: number
        max: number
      }
    }

export const AlertOnPuissanceValue = (props: AlertOnPuissanceValueProps) => {
  switch (props.reason) {
    case 'hors-ratios-autorisés':
      return <AlertOnPuissanceOutsideRatios {...props} />

    case 'puissance-max-volume-reseve-depassée':
      return <AlertOnPuissanceExceedMax {...props} />
  }
}

type AlertOnPuissanceExceedMaxProps = {
  puissanceMax: number
}
const AlertOnPuissanceExceedMax = ({ puissanceMax }: AlertOnPuissanceExceedMaxProps) => (
  <div className="notification warning" style={{ marginTop: 15 }}>
    Une autorisation est nécessaire si la modification de puissance dépasse la puissance maximum de
    ${puissanceMax} du volume reservé de l'appel d'offre. Dans ces cas{' '}
    <strong>il est nécessaire de joindre un justificatif à votre demande</strong>.
  </div>
)

type AlertOnPuissanceOutsideRatiosProps = {
  ratios: {
    min: number
    max: number
  }
}
export const AlertOnPuissanceOutsideRatios = ({
  ratios: { min, max },
}: AlertOnPuissanceOutsideRatiosProps) => (
  <div
    className="notification warning"
    style={{ marginTop: 15 }}
    {...dataId('modificationRequest-puissance-error-message-out-of-bounds')}
  >
    Une autorisation est nécessaire si la modification de puissance est inférieure à{' '}
    {Math.round(min * 100)}% de la puissance initiale ou supérieure à {Math.round(max * 100)}%. Dans
    ces cas <strong>il est nécessaire de joindre un justificatif à votre demande</strong>.
  </div>
)
