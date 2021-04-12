import React from 'react'
import { formatDate } from '../../../../helpers/formatDate'
import { dataId } from '../../../../helpers/testId'
import { ModificationRequestPageDTO } from '../../../../modules/modificationRequest'
import { DownloadResponseTemplate } from './DownloadResponseTemplate'

interface RecoursFormProps {
  modificationRequest: ModificationRequestPageDTO & { type: 'recours' }
}
export const RecoursForm = ({ modificationRequest }: RecoursFormProps) => (
  <>
    <DownloadResponseTemplate modificationRequest={modificationRequest} />

    <div className="form__group">
      <label htmlFor="file">Réponse signée (fichier pdf)</label>
      <input type="file" name="file" id="file" />
    </div>

    <div className="form__group" style={{ marginTop: 5 }}>
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
