import React, { useState } from 'react'
import { Project } from '@entities'
import { dataId } from '../../../../../helpers/testId'
import toNumber from '../../../../../helpers/toNumber'
import { isStrictlyPositiveNumber } from '../../../../../helpers/formValidators'
import { AlertePuissanceHorsRatios, AlertePuissanceMaxDepassee } from './AlerteNouvellePuissance'
import {
  exceedsRatiosChangementPuissance,
  exceedsPuissanceMaxDuVolumeReserve,
} from '@modules/modificationRequest'
import { Astérisque, Label } from '@components'

type ChangementPuissanceProps = {
  project: Project
  puissance: number
  justification: string
}

export const ChangementPuissance = ({
  project,
  puissance,
  justification,
}: ChangementPuissanceProps) => {
  const { appelOffre } = project

  const [displayAlertOnPuissanceType, setDisplayAlertOnPuissanceType] = useState(false)
  const [displayAlertHorsRatios, setDisplayAlertHorsRatios] = useState(false)
  const [displayAlertPuissanceMaxVolumeReserve, setDisplayAlertPuissanceMaxVolumeReserve] =
    useState(false)
  const [fileRequiredforPuissanceModification, setFileRequiredforPuissanceModification] =
    useState(false)

  const handlePuissanceOnChange = (e) => {
    const isNewValueCorrect = isStrictlyPositiveNumber(e.target.value)
    const nouvellePuissance = toNumber(e.target.value)
    const exceedsRatios = exceedsRatiosChangementPuissance({ project, nouvellePuissance })
    const exceedsPuissanceMax = exceedsPuissanceMaxDuVolumeReserve({ project, nouvellePuissance })

    setDisplayAlertOnPuissanceType(!isNewValueCorrect)
    setDisplayAlertHorsRatios(exceedsRatios)
    setDisplayAlertPuissanceMaxVolumeReserve(exceedsPuissanceMax)
    setFileRequiredforPuissanceModification(exceedsRatios || exceedsPuissanceMax)
  }

  const CDC2022choisi = ['30/08/2022', '30/08/2022-alternatif'].includes(
    project.cahierDesChargesActuel
  )

  return (
    <>
      <label>Puissance à la notification (en {appelOffre?.unitePuissance})</label>
      <input
        type="text"
        disabled
        value={project.puissanceInitiale}
        {...dataId('modificationRequest-presentPuissanceField')}
      />
      {project.puissance !== project.puissanceInitiale && (
        <>
          <label>Puissance actuelle ({appelOffre?.unitePuissance})</label>
          <input type="text" disabled value={project.puissance} />
        </>
      )}
      <label className="mt-4" htmlFor="puissance">
        Nouvelle puissance (en {appelOffre?.unitePuissance}) <Astérisque />
      </label>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]+([\.,][0-9]+)?"
        name="puissance"
        id="puissance"
        defaultValue={puissance || ''}
        {...dataId('modificationRequest-puissanceField')}
        onChange={handlePuissanceOnChange}
        required={true}
      />

      {!CDC2022choisi && displayAlertHorsRatios && <AlertePuissanceHorsRatios {...{ project }} />}

      {displayAlertPuissanceMaxVolumeReserve && <AlertePuissanceMaxDepassee {...{ project }} />}

      {displayAlertOnPuissanceType && (
        <div
          className="notification error"
          {...dataId('modificationRequest-puissance-error-message-wrong-format')}
        >
          Le format saisi n’est pas conforme, veuillez renseigner un nombre décimal.
        </div>
      )}

      <div className="mt-4">
        <Label htmlFor="justification" className="mt-4">
          <strong>Veuillez nous indiquer les raisons qui motivent votre demande</strong>
          <br />
          Pour faciliter le traitement de votre demande, veillez à détailler les raisons ayant
          conduit à ce besoin de modification (contexte, facteurs extérieurs, etc)
        </Label>
        <textarea
          name="justification"
          id="justification"
          defaultValue={justification || ''}
          {...dataId('modificationRequest-justificationField')}
        />
        <label htmlFor="candidats" className="mt-4">
          Courrier explicatif ou décision administrative.{' '}
          {fileRequiredforPuissanceModification && <Astérisque />}
        </label>
        <input
          type="file"
          name="file"
          {...dataId('modificationRequest-fileField')}
          id="file"
          required={fileRequiredforPuissanceModification}
        />
      </div>
    </>
  )
}
