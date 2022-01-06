import React, { useState } from 'react'
import { dataId } from '../../../../helpers/testId'
import ROUTES from '../../../../routes'
import { DateInput } from '../../../components'

interface GarantiesFinancieresFormProps {
  projectId: string
}
export const GarantiesFinancieresForm = ({ projectId }: GarantiesFinancieresFormProps) => {
  const [disableSubmit, setDisableSubmit] = useState(true)
  return (
    <form action={ROUTES.DEPOSER_ETAPE_ACTION} method="post" encType="multipart/form-data">
      <input type="hidden" name="type" id="type" value="garantie-financiere" />
      <div className="form__group">
        <label className="required" htmlFor="date">
          Date de constitution (format JJ/MM/AAAA)
        </label>
        <DateInput onError={(isError: boolean) => setDisableSubmit(isError)} />
        <label htmlFor="file" className="required">
          Attestation
        </label>
        <input type="hidden" name="projectId" value={projectId} />
        <input type="file" name="file" {...dataId('file-field')} id="file" required />
        <button
          className="button"
          type="submit"
          name="submit"
          id="submit"
          {...dataId('submit-gf-button')}
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
