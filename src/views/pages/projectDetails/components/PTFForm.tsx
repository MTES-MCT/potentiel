import React from 'react'
import { dataId } from '../../../../helpers/testId'
import ROUTES from '../../../../routes'

interface PTFFormProps {
  projectId: string
  date?: string
}
export const PTFForm = ({ projectId, date }: PTFFormProps) => (
  <form action={ROUTES.DEPOSER_PTF_ACTION} method="post" encType="multipart/form-data">
    <div className="form__group">
      <label htmlFor="date">Date de signature du PTF (format JJ/MM/AAAA)</label>
      <input
        type="text"
        name="ptfDate"
        {...dataId('date-field')}
        defaultValue={date || ''}
        data-max-date={Date.now()}
      />
      <div
        className="notification error"
        style={{ display: 'none' }}
        {...dataId('error-message-out-of-bounds')}
      >
        Merci de saisir une date antérieure à la date d‘aujourd‘hui.
      </div>
      <div
        className="notification error"
        style={{ display: 'none' }}
        {...dataId('error-message-wrong-format')}
      >
        Le format de la date saisie n‘est pas conforme. Elle doit être de la forme JJ/MM/AAAA soit
        par exemple 25/05/2022 pour 25 Mai 2022.
      </div>
      <label htmlFor="file">Document</label>
      <input type="file" name="file" {...dataId('file-field')} id="file" />
      <input type="hidden" name="projectId" value={projectId} />
      <button className="button" type="submit" {...dataId('submit-ptf-button')}>
        Envoyer
      </button>
      <button className="button-outline primary" {...dataId('frise-hide-content')}>
        Annuler
      </button>
    </div>
  </form>
)
