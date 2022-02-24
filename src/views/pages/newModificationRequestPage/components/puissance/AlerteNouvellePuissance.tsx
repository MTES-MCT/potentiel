import React from 'react'
import { dataId } from '../../../../../helpers/testId'

type AlertOnPuissanceValueProps = { unitePuissance: string } & (
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
)

export const AlerteNouvellePuissance = (props: AlertOnPuissanceValueProps) => (
  <div
    className="notification warning mt-3"
    {...dataId('modificationRequest-puissance-error-message-out-of-bounds')}
  >
    {props.reason === 'hors-ratios-autorisés' ? (
      <AlertePuissanceHorsRatios {...props} />
    ) : (
      <AlertePuissanceMaxDepassee {...props} />
    )}
  </div>
)

type AlertOnPuissanceExceedMaxProps = {
  puissanceMax: number
  unitePuissance: string
}
const AlertePuissanceMaxDepassee = ({
  puissanceMax,
  unitePuissance,
}: AlertOnPuissanceExceedMaxProps) => (
  <>
    Une autorisation est nécessaire si la modification de puissance dépasse la puissance maximum de{' '}
    {puissanceMax} {unitePuissance} du volume reservé de l'appel d'offre. Dans ce cas{' '}
    <strong>il est nécessaire de joindre un justificatif à votre demande</strong>.
  </>
)

type AlertOnPuissanceOutsideRatiosProps = {
  ratios: {
    min: number
    max: number
  }
}
export const AlertePuissanceHorsRatios = ({
  ratios: { min, max },
}: AlertOnPuissanceOutsideRatiosProps) => (
  <>
    Une autorisation est nécessaire si la modification de puissance est inférieure à{' '}
    {Math.round(min * 100)}% de la puissance initiale ou supérieure à {Math.round(max * 100)}%. Dans
    ces cas <strong>il est nécessaire de joindre un justificatif à votre demande</strong>.
  </>
)
