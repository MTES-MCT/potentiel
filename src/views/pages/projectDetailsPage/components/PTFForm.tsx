import React, { useState } from 'react'
import { dataId } from '../../../../helpers/testId'
import ROUTES from '../../../../routes'
import DateInput from '../../../components/DateInput'

interface PTFFormProps {
  projectId: string
  date?: string
}
export const PTFForm = ({ projectId, date }: PTFFormProps) => {
  const [errorMessage, setErrorMessage] = useState('')
  const [disableSubmit, setDisableSubmit]= useState(true)
  const maxDate = new Date()
  return (
    <form action={ROUTES.DEPOSER_ETAPE_ACTION} method="post" encType="multipart/form-data">
      <input type="hidden" name="type" id="type" value="ptf" />
      <div className="form__group">
        <label htmlFor="date">Date de signature du PTF (format JJ/MM/AAAA)</label>
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
        <label htmlFor="file">Document</label>
        <input type="file" name="file" {...dataId('file-field')} id="file" required/>
        <input type="hidden" name="projectId" value={projectId} />
        <button className="button" type="submit" {...dataId('submit-ptf-button')} disabled={disableSubmit}>
          Envoyer
        </button>
        <button className="button-outline primary" {...dataId('frise-hide-content')}>
          Annuler
        </button>
      </div>
    </form>
  )
}
