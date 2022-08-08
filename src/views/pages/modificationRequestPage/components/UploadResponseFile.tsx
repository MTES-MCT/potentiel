import React from 'react'
import { DownloadResponseTemplate } from '.'
import { ModificationRequestPageDTO } from '@modules/modificationRequest'
import { Astérisque } from '@components'

interface UploadResponseFileProps {
  modificationRequest: ModificationRequestPageDTO & { type: string }
}

export const UploadResponseFile = ({ modificationRequest }: UploadResponseFileProps) => {
  return (
    <>
      <DownloadResponseTemplate modificationRequest={modificationRequest} />
      <div className="form__group">
        <label htmlFor="file">
          Réponse signée (fichier pdf) {modificationRequest.type !== 'puissance' && <Astérisque />}
        </label>
        <input
          type="file"
          name="file"
          id="file"
          required={modificationRequest.type !== 'puissance'}
        />
      </div>
    </>
  )
}
