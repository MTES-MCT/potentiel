import React from 'react';
import { formatDateToString } from '../../../../helpers/formatDateToString';
import { dataId } from '../../../../helpers/testId';

export const RecoursForm = () => (
  <>
    <div className="form__group mt-4 mb-4">
      <label htmlFor="newNotificationDate">Nouvelle date de désignation (format JJ/MM/AAAA)</label>
      <input
        type="text"
        name="newNotificationDate"
        id="newNotificationDate"
        defaultValue={formatDateToString(Date.now())}
        {...dataId('modificationRequest-newNotificationDateField')}
        style={{ width: 'auto' }}
      />
    </div>
  </>
);
