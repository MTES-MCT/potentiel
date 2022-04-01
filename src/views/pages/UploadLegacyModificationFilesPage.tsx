import type { Request } from 'express'
import React from 'react'
import { dataId } from '../../helpers/testId'
import ROUTES from '../../routes'
import AdminDashboard from '../components/AdminDashboard'
import { PageLayout } from '../components/PageLayout'

export type UploadLegacyModificationFileResult =
  | {
      filename: string
    } & ({ error: false } | { error: true; message: string })

type UploadLegacyModificationFilesProps = {
  request: Request
  results?: UploadLegacyModificationFileResult[]
}

export const UploadLegacyModificationFiles = PageLayout(
  ({ request }: UploadLegacyModificationFilesProps) => {
    const {
      user: { role },
    } = request
    return (
      <AdminDashboard role={role} currentPage={'admin-upload-legacy-modification-files'}>
        <div className="panel">
          <div className="panel__header">
            <h3>Importer des courriers historiques</h3>
          </div>

          <form
            action={ROUTES.UPLOAD_LEGACY_MODIFICATION_FILES}
            method="post"
            encType="multipart/form-data"
          >
            <div>Sélectionner les fichiers à attacher aux demandes historiques.</div>
            <div className="text-sm mt-1 mb-2">
              <b>Attention</b>: seuls les fichiers mentionnés dans un colonne 'Nom courrier [N]'
              pourront être associés.
            </div>
            <input type="file" multiple id="files" />
            <div className="text-sm mt-2">
              Vous pouvez attacher jusqu'à 50Mo de fichiers à la fois
            </div>
            <button
              className="button"
              type="submit"
              name="submit"
              id="submit"
              {...dataId('submit-button')}
            >
              Envoyer
            </button>
          </form>
        </div>
      </AdminDashboard>
    )
  }
)
