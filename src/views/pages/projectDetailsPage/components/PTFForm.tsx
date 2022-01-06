import React, { useState } from 'react'
import { dataId } from '../../../../helpers/testId'
import ROUTES from '../../../../routes'
import { DateInput } from '../../../components'

interface PTFFormProps {
  projectId: string
}
export const PTFForm = ({ projectId }: PTFFormProps) => {
  const [disableSubmit, setDisableSubmit] = useState(true)
  return (
    <form action={ROUTES.DEPOSER_ETAPE_ACTION} method="post" encType="multipart/form-data">
      <input type="hidden" name="type" id="type" value="ptf" />
      <div className="form__group">
        <label htmlFor="date">Date de signature du PTF (format JJ/MM/AAAA)</label>
        <DateInput onError={(isError: boolean) => setDisableSubmit(isError)} />
        <label htmlFor="file">Document</label>
        <input type="file" name="file" {...dataId('file-field')} id="file" required />
        <input type="hidden" name="projectId" value={projectId} />
        <button
          className="button"
          type="submit"
          {...dataId('submit-ptf-button')}
          disabled={disableSubmit}
        >
          Envoyer
        </button>
        <button className="button-outline primary" {...dataId('frise-hide-content')}>
          Annuler
        </button>
      </div>
    </form>
  )
}
