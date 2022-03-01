import React from 'react'
import { dataId } from '../../../../helpers/testId'
import {
  ModificationRequestPageDTO,
  exceedsPuissanceMaxDuVolumeReserve,
  exceedsRatiosChangementPuissance,
  getRatiosChangementPuissance,
  getVolumeReserve,
} from '@modules/modificationRequest'

type PuissanceFormProps = {
  modificationRequest: ModificationRequestPageDTO & { type: 'puissance' }
}

export const PuissanceForm = ({ modificationRequest }: PuissanceFormProps) => {
  const { project, puissance: nouvellePuissance } = modificationRequest
  const exceedsRatios = exceedsRatiosChangementPuissance({ project, nouvellePuissance })
  const exceedsPuissanceMax = exceedsPuissanceMaxDuVolumeReserve({ project, nouvellePuissance })
  const ratios = getRatiosChangementPuissance(project)
  const reservedVolume = project.appelOffre && getVolumeReserve(project.appelOffre)

  return (
    <>
      <div className="form__group mt-4">
        <label>
          Nouvelle puissance demandée : {modificationRequest.puissance}{' '}
          {modificationRequest.project.unitePuissance}
        </label>
        <input
          type="hidden"
          value={modificationRequest.puissance}
          name="puissance"
          {...dataId('modificationRequest-puissanceField')}
        />
      </div>

      {exceedsRatios && (
        <div className="notification warning mt-3">
          La nouvelle puissance demandée est inférieure à {Math.round(ratios.min * 100)}% de la
          puissance initiale ou supérieure à {Math.round(ratios.max * 100)}%.{' '}
        </div>
      )}
      {exceedsPuissanceMax && reservedVolume && (
        <div className="notification warning mt-3">
          La nouvelle puissance demandée dépasse la puissance maximum de{' '}
          {reservedVolume.puissanceMax} {modificationRequest.project.unitePuissance} du volume
          reservé de l'appel d'offre.
        </div>
      )}

      <div className="form__group mb-4">
        <label htmlFor="statusUpdateOnly">
          <input
            type="checkbox"
            name="isDecisionJustice"
            {...dataId('modificationRequest-isDecisionJustice')}
          />
          La demande de changement de puissance fait suite à une décision de justice
        </label>
        <div style={{ fontSize: 11, lineHeight: '1.5em', marginTop: 3 }}>
          En cochant cette case, vous n'aurez pas à joindre de courrier de réponse en cas
          d'acceptation de la demande. <br />
          Un refus quant à lui devra être accompagné d'un courrier.
        </div>
      </div>
    </>
  )
}
