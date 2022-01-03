import React, { useState } from 'react'
import { dataId } from '../../../../helpers/testId'
import ROUTES from '../../../../routes'
import DateInput from '../../../components/DateInput'

interface GarantiesFinancieresFormProps {
  projectId: string
  date?: string
}
export const GarantiesFinancieresForm = ({ projectId, date }: GarantiesFinancieresFormProps) => {
  const [errorMessage, setErrorMessage] = useState('')
  const [disableSubmit, setDisableSubmit]= useState(true)
  const maxDate = new Date()
  return (
    <form action={ROUTES.DEPOSER_ETAPE_ACTION} method="post" encType="multipart/form-data">
      <input type="hidden" name="type" id="type" value="garantie-financiere" />
      <div className="form__group">
        <label className="required" htmlFor="date">
          Date de constitution (format JJ/MM/AAAA)
        </label>
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

        <label htmlFor="file" className="required">
          Attestation
        </label>
        <input type="hidden" name="projectId" value={projectId} />
        <input type="file" name="file" {...dataId('file-field')} id="file" required/>
        <button
          className="button"
          type="submit"
          name="submit"
          id="submit"
          {...dataId('submit-gf-button')}
        >
          Envoyer
        </button>
        <button className="button-outline primary" {...dataId('frise-hide-content')} disabled={disableSubmit}>
          Annuler
        </button>
      </div>
    </form>
  )
}
