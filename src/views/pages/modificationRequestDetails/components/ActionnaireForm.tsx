import React from 'react'
import { dataId } from '../../../../helpers/testId'
import { ModificationRequestPageDTO } from '../../../../modules/modificationRequest'
import { DownloadResponseTemplate } from './DownloadResponseTemplate'

interface ActionnaireFormProps {
  modificationRequest: ModificationRequestPageDTO & { type: 'actionnaire' }
}
export const ActionnaireForm = ({ modificationRequest }: ActionnaireFormProps) => (
  <>
    <DownloadResponseTemplate modificationRequest={modificationRequest} />

    <div className="form__group">
      <label htmlFor="file">Réponse signée (fichier pdf)</label>
      <input type="file" name="file" id="file" />
    </div>

    <div className="form__group" style={{ marginBottom: 20 }}>
      <label>Nouvel actionnaire : {modificationRequest.actionnaire} </label>
      <input
        type="hidden"
        value={modificationRequest.actionnaire}
        name="actionnaire"
        {...dataId('modificationRequest-actionnaireField')}
      />
    </div>
  </>
)
