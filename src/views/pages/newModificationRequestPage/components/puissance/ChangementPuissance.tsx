import React, { useState } from 'react'
import { Project } from '@entities'
import { dataId } from '../../../../../helpers/testId'
import toNumber from '../../../../../helpers/toNumber'
import { isStrictlyPositiveNumber } from '../../../../../helpers/formValidators'
import { isModificationPuissanceAuto, IsModificationPuissanceAutoResult } from '@modules/modificationRequest'
import { AlerteNouvellePuissance } from './AlerteNouvellePuissance'

type ChangementPuissanceProps = {
  project: Project
  puissance: number
  justification: string
  onPuissanceChecked: (isValid: boolean) => void
}

type ReasonWhyChangeIsNotAutoAccepted =
  | 'none'
  | Extract<IsModificationPuissanceAutoResult, {isAuto: false}>

export const ChangementPuissance = ({
  project,
  puissance,
  justification,
  onPuissanceChecked,
}: ChangementPuissanceProps) => {
  const { appelOffre } = project

  const [displayAlertOnPuissanceType, setdisplayAlertOnPuissanceType] = useState(false)
  const [displayAlertOnPuissance, setDisplayAlertOnPuissance] = useState(false)
  const [reasonWhyChangeIsNotAutoAccepted, setReasonWhyChangeIsNotAutoAccepted] = useState(
    'none' as ReasonWhyChangeIsNotAutoAccepted
  )
  const [fileRequiredforPuissanceModification, setFileRequiredforPuissanceModification] =
    useState(false)

  const handlePuissanceOnChange = (e) => {
    const isNewValueCorrect = isStrictlyPositiveNumber(e.target.value)
    const nouvellePuissance = toNumber(e.target.value)
    const isChangeAutoResult = isModificationPuissanceAuto({
      nouvellePuissance,
      project,
    })

    setdisplayAlertOnPuissanceType(!isNewValueCorrect)
    setDisplayAlertOnPuissance(!isChangeAutoResult.isAuto)
    setFileRequiredforPuissanceModification(!isChangeAutoResult.isAuto)
    setReasonWhyChangeIsNotAutoAccepted(isChangeAutoResult.isAuto ? 'none' : isChangeAutoResult)
    onPuissanceChecked(isNewValueCorrect)
  }

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
      <label className="required" style={{ marginTop: 10 }} htmlFor="puissance">
        Nouvelle puissance (en {appelOffre?.unitePuissance})
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

      {displayAlertOnPuissance && reasonWhyChangeIsNotAutoAccepted !== 'none' && (
        <AlerteNouvellePuissance
          {...{
            ...reasonWhyChangeIsNotAutoAccepted,
            unitePuissance: appelOffre?.unitePuissance || 'MW',
          }}
        />
      )}

      {displayAlertOnPuissanceType && (
        <div
          className="notification error"
          {...dataId('modificationRequest-puissance-error-message-wrong-format')}
        >
          Le format saisi n’est pas conforme, veuillez renseigner un nombre décimal.
        </div>
      )}

      <div style={{ marginTop: 10 }}>
        <label style={{ marginTop: 10 }} className="required" htmlFor="justification">
          <strong>Veuillez nous indiquer les raisons qui motivent votre demande</strong>
          <br />
          Pour faciliter le traitement de votre demande, veillez à détailler les raisons ayant
          conduit à ce besoin de modification (contexte, facteurs extérieurs, etc)
        </label>
        <textarea
          name="justification"
          id="justification"
          defaultValue={justification || ''}
          {...dataId('modificationRequest-justificationField')}
        />
        <label htmlFor="candidats" style={{ marginTop: 10 }}>
          Courrier explicatif ou décision administrative.
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
