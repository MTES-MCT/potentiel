import React, { useState } from 'react'
import { dataId } from '../../../../helpers/testId'
import ROUTES from '../../../../routes'
import DateInput from '../../../components/dateInput'

interface DCRFormProps {
  projectId: string
  date?: string
}
export const DCRForm = ({ projectId, date }: DCRFormProps) => {
  const [errorMessage, setErrorMessage] = useState('')
  const [disableSubmit, setDisableSubmit]= useState(true)
  const maxDate = new Date()

  return (
  <form action={ROUTES.DEPOSER_ETAPE_ACTION} method="post" encType="multipart/form-data">
    <input type="hidden" name="type" id="type" value="dcr" />
    <div className="form__group">
      <label htmlFor="date">Date d‘attestation de DCR (format JJ/MM/AAAA)</label>
      <DateInput 
        setErrorMessage={setErrorMessage}
        setDisableSubmit={setDisableSubmit}
        maxDate={maxDate}
      />
      {errorMessage && (
      <p 
        className="notification error"
        {...dataId('error-message-wrong-format')}
      >
        {errorMessage}
      </p>)
      }

      <label htmlFor="numero-dossier">Identifiant gestionnaire de réseau (ex: GEFAR-P)</label>
      <input type="numero-dossier" name="numeroDossier" {...dataId('numero-dossier-field')} required />
      <label htmlFor="file">Attestation</label>
      <input type="file" name="file" {...dataId('file-field')} id="file" required/>
      <input type="hidden" name="projectId" value={projectId} />
      <button className="button" type="submit" {...dataId('submit-dcr-button')} disabled={disableSubmit}>
        Envoyer
      </button>
      <button className="button-outline primary" {...dataId('frise-hide-content')}>
        Annuler
      </button>
    </div>
  </form>
  )
}
