import React from 'react'
import { DownloadResponseTemplate } from '.'
import { dataId } from '../../../../helpers/testId'
import { ModificationRequestPageDTO } from '@modules/modificationRequest'

interface UploadResponseFileProps {
  modificationRequest: ModificationRequestPageDTO & { type: string }
}

export const UploadResponseFile = ({ modificationRequest }: UploadResponseFileProps) => {
  return (
    <>
      <DownloadResponseTemplate modificationRequest={modificationRequest} />
      <div className="form__group">
        <label htmlFor="file">Réponse signée (fichier pdf)</label>
        <input
          type="file"
          name="file"
          id="file"
          required={modificationRequest.type === 'recours'}
        />
      </div>
    </>
  )
}
