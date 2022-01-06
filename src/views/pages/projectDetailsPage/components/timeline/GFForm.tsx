import React, { useState } from 'react'
import ROUTES from '../../../../../routes'
import { DateInput } from '../../../../components'

export const GFForm = (props: { projectId: string; toggleForm: boolean; setToggleForm: any }) => {
  const { projectId, toggleForm: isHiddenForm, setToggleForm: setIsHiddenForm } = props
  const [disableSubmit, setDisableSubmit] = useState(true)

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
        <DateInput onError={(isError: boolean) => setDisableSubmit(isError)} />
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
