import React from 'react'
import { DownloadResponseTemplate } from '.'
import { dataId } from '../../../../helpers/testId'
import { ModificationRequestPageDTO } from '../../../../modules/modificationRequest'

interface UploadResponseFileProps {
  modificationRequest: ModificationRequestPageDTO & { type: string }
}

export const UploadResponseFile = ({ modificationRequest }: UploadResponseFileProps) => {
  return (
    <>
      <div className="form__group" style={{ marginBottom: 20 }}>
        <label htmlFor="replyWithoutAttachment">
          <input
            type="checkbox"
            name="replyWithoutAttachment"
            {...dataId('modificationRequest-replyWithoutAttachmentField')}
          />
          Répondre sans pièce jointe (uniquement pour accepter)
        </label>
      </div>
      <DownloadResponseTemplate modificationRequest={modificationRequest} />
      <div className="form__group">
        <label htmlFor="file">Réponse signée (fichier pdf)</label>
        <input type="file" name="file" id="file" />
      </div>
    </>
  )
}
