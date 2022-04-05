import type { Request } from 'express'
import React from 'react'
import { dataId } from '../../helpers/testId'
import ROUTES from '../../routes'
import { ErrorBox } from '../components'
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
  ({ request, results }: UploadLegacyModificationFilesProps) => {
    const {
      user: { role },
      query: { error },
    } = request

    const errors =
      results?.filter(
        (result): result is UploadLegacyModificationFileResult & { error: true } => result.error
      ) || []
    const successes = results?.filter((result) => !result.error) || []

    return (
      <AdminDashboard role={role} currentPage={'admin-upload-legacy-modification-files'}>
        <div className="panel">
          <div className="panel__header">
            <h3>Importer des courriers historiques</h3>
          </div>

          <ErrorBox error={error as string} />

          {Boolean(errors.length) && (
            <div className="notification error py-2">
              <div>Erreur(s):</div>
              <ul className="pl-3 mb-0 mt-1">
                {errors.map((result) => (
                  <li key={`result_for_${result.filename}`} className="mb-1">
                    <div>{result.filename}</div>
                    <div className="text-sm">{result.message}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {Boolean(successes.length) && (
            <div className="notification success">
              {successes.length} courrier(s) rattaché(s) avec succès
            </div>
          )}

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
            <input type="file" multiple name="files" />
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
