import React from 'react'
import { formatDate } from '../../../../helpers/formatDate'
import { dataId } from '../../../../helpers/testId'

export const RecoursForm = () => (
  <>
    <div className="form__group mt-4 mb-4">
      <label htmlFor="newNotificationDate">Nouvelle date de désignation (format JJ/MM/AAAA)</label>
      <input
        type="text"
        name="newNotificationDate"
        id="newNotificationDate"
        defaultValue={formatDate(Date.now(), 'DD/MM/YYYY')}
        {...dataId('modificationRequest-newNotificationDateField')}
        style={{ width: 'auto' }}
      />
    </div>
  </>
)
