import React, { useState } from 'react'
import ROUTES from '../../../../../routes'
import DateInput from '../../../../components/DateInput'

export const GFForm = (props: { projectId: string; isHiddenForm: boolean; setIsHiddenForm }) => {
  const { projectId, isHiddenForm, setIsHiddenForm } = props
  const [errorMessage, setErrorMessage] = useState('')
  const [disableSubmit, setDisableSubmit] = useState(true)
  const maxDate = new Date()
  return (
    <form
      action={ROUTES.DEPOSER_ETAPE_ACTION}
      method="post"
      encType="multipart/form-data"
      className="mt-2 border border-solid border-gray-300 rounded-md p-5"
    >
      <input type="hidden" name="type" id="type" value="garantie-financiere" />
      <input type="hidden" name="projectId" value={projectId} />
      <div>
        <label htmlFor="date">Date de constitution (format JJ/MM/AAAA)</label>
        <DateInput
          setErrorMessage={setErrorMessage}
          setDisableSubmit={setDisableSubmit}
          maxDate={maxDate}
        />
        {errorMessage && <p className="notification error">{errorMessage}</p>}
      </div>
      <div className="mt-2">
        <label htmlFor="file">Attestation</label>
        <input type="file" name="file" id="file" required />
      </div>
      <button className="button" type="submit" name="submit" disabled={disableSubmit}>
        Envoyer
      </button>
      <a onClick={() => setIsHiddenForm(!isHiddenForm)}>Annuler</a>
    </form>
  )
}
