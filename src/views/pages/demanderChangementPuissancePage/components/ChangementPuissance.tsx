import React, { useState } from 'react'
import { dataId } from '../../../../helpers/testId'
import toNumber from '../../../../helpers/toNumber'
import { isStrictlyPositiveNumber } from '../../../../helpers/formValidators'
import {
  exceedsRatiosChangementPuissance,
  exceedsPuissanceMaxDuVolumeReserve,
} from '@modules/demandeModification'
import { Astérisque, ErrorBox, Label } from '@components'
import { AlertePuissanceMaxDepassee } from './AlertePuissanceMaxDepassee'
import { AlertePuissanceHorsRatios } from './AlertePuissanceHorsRatios'
import { ProjectAppelOffre, Technologie } from '@entities'

type ChangementPuissanceProps = {
  unitePuissance: string
  puissance: number
  puissanceInitiale: number
  justification: string
  cahierDesChargesActuel: string
  appelOffre: ProjectAppelOffre
  technologie: Technologie
  puissanceSaisie?: number
}

export const ChangementPuissance = ({
  puissance,
  justification,
  puissanceInitiale,
  cahierDesChargesActuel,
  appelOffre,
  technologie,
  puissanceSaisie,
}: ChangementPuissanceProps) => {
  const [displayAlertOnPuissanceType, setDisplayAlertOnPuissanceType] = useState(false)
  const [displayAlertHorsRatios, setDisplayAlertHorsRatios] = useState(false)
  const [displayAlertPuissanceMaxVolumeReserve, setDisplayAlertPuissanceMaxVolumeReserve] =
    useState(false)
  const [fichierEtJustificationRequis, setFichierEtJustificationRequis] = useState(false)

  const handlePuissanceOnChange = (e) => {
    const isNewValueCorrect = isStrictlyPositiveNumber(e.target.value)
    const nouvellePuissance = toNumber(e.target.value)
    const exceedsRatios = exceedsRatiosChangementPuissance({
      project: { puissanceInitiale, appelOffre, technologie },
      nouvellePuissance,
    })
    const exceedsPuissanceMax = exceedsPuissanceMaxDuVolumeReserve({
      project: { puissanceInitiale, appelOffre },
      nouvellePuissance,
    })

    setDisplayAlertOnPuissanceType(!isNewValueCorrect)
    setDisplayAlertHorsRatios(exceedsRatios)
    setDisplayAlertPuissanceMaxVolumeReserve(exceedsPuissanceMax)
    setFichierEtJustificationRequis(exceedsRatios || exceedsPuissanceMax)
  }

  const CDC2022choisi = ['30/08/2022', '30/08/2022-alternatif'].includes(cahierDesChargesActuel)

  return (
    <>
      <label>Puissance à la notification (en {appelOffre.unitePuissance})</label>
      <input
        type="text"
        disabled
        value={puissanceInitiale}
        {...dataId('modificationRequest-presentPuissanceField')}
      />
      {puissance !== puissanceInitiale && (
        <>
          <label>Puissance actuelle ({appelOffre?.unitePuissance})</label>
          <input type="text" disabled value={puissance} />
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
        defaultValue={puissanceSaisie || ''}
        {...dataId('modificationRequest-puissanceField')}
        onChange={handlePuissanceOnChange}
        required={true}
      />

      {!CDC2022choisi && displayAlertHorsRatios && (
        <AlertePuissanceHorsRatios {...{ project: { appelOffre, technologie } }} />
      )}

      {displayAlertPuissanceMaxVolumeReserve && (
        <AlertePuissanceMaxDepassee {...{ project: { appelOffre } }} />
      )}

      {displayAlertOnPuissanceType && (
        <ErrorBox title="Le format saisi n'est pas conforme, veuillez renseigner un nombre décimal." />
      )}

      <div className="mt-4">
        <Label htmlFor="justification" className="mt-4">
          <strong>Veuillez nous indiquer les raisons qui motivent votre demande</strong>
          <br />
          Pour faciliter le traitement de votre demande, veillez à détailler les raisons ayant
          conduit à ce besoin de modification (contexte, facteurs extérieurs, etc){' '}
          {!CDC2022choisi && fichierEtJustificationRequis && <Astérisque />}
        </Label>
        <textarea
          name="justification"
          id="justification"
          defaultValue={justification || ''}
          {...dataId('modificationRequest-justificationField')}
          required={!CDC2022choisi && fichierEtJustificationRequis}
        />
        <label htmlFor="candidats" className="mt-4">
          Courrier explicatif ou décision administrative.{' '}
          {!CDC2022choisi && fichierEtJustificationRequis && <Astérisque />}
        </label>
        <input
          type="file"
          name="file"
          {...dataId('modificationRequest-fileField')}
          id="file"
          required={!CDC2022choisi && fichierEtJustificationRequis}
        />
      </div>
    </>
  )
}
