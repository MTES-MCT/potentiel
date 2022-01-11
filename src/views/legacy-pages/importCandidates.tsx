import React from 'react'
import { dataId } from '../../helpers/testId'
import ROUTES from '../../routes'
import { Request } from 'express'
import AdminDashboard from '../components/AdminDashboard'

type ImportProjectsProps = {
  request: Request
  importErrors?: Record<number, string>
  otherError?: string
  isSuccess?: boolean
}

/* Pure component */
export default function ImportProjects({
  request,
  importErrors,
  isSuccess,
  otherError,
}: ImportProjectsProps) {
  return (
    <AdminDashboard role={request.user?.role} currentPage="import-projects">
      <div className="panel">
        <div className="panel__header">
          <h3>Importer des candidats</h3>
        </div>
        <form action={ROUTES.IMPORT_PROJECTS_ACTION} method="post" encType="multipart/form-data">
          {isSuccess && (
            <div className="notification success" {...dataId('success-message')}>
              Les projets ont bien été importés.
            </div>
          )}
          {!!importErrors && (
            <div className="notification error" {...dataId('error-message')}>
              Le fichier n'a pas pu être importé à cause des erreurs suivantes:
              <ul>
                {Object.entries(importErrors).map(([lineNumber, message]) => (
                  <li key={`error_line_${lineNumber}`}>
                    Ligne <b>{lineNumber}</b>: {message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!!otherError && (
            <div className="notification error" {...dataId('error-message')}>
              {otherError}
            </div>
          )}

          <div className="form__group">
            <label htmlFor="candidats">Fichier csv des candidats</label>
            <input type="file" name="candidats" {...dataId('candidats-field')} id="candidats" />
            <button
              className="button"
              type="submit"
              name="submit"
              id="submit"
              {...dataId('submit-button')}
            >
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </AdminDashboard>
  )
}
