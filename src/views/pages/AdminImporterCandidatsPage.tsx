import React from 'react'
import { dataId } from '../../helpers/testId'
import ROUTES from '@routes'
import { Request } from 'express'
import { Button, ErrorBox, PageTemplate, SuccessBox } from '@components'
import { hydrateOnClient } from '../helpers'

type AdminImporterCandidatsProps = {
  request: Request
  importErrors?: Record<number, string>
  otherError?: string
  isSuccess?: boolean
}

export const AdminImporterCandidats = ({
  request,
  importErrors,
  isSuccess,
  otherError,
}: AdminImporterCandidatsProps) => {
  return (
    <PageTemplate user={request.user} currentPage="import-projects">
      <div className="panel">
        <div className="panel__header">
          <h3>Importer des candidats</h3>
        </div>
        <form action={ROUTES.IMPORT_PROJECTS_ACTION} method="post" encType="multipart/form-data">
          {isSuccess && <SuccessBox title="Les projets ont bien été importés." />}
          {!!importErrors && (
            <ErrorBox title="Le fichier n'a pas pu être importé à cause des erreurs suivantes :">
              <ul>
                {Object.entries(importErrors).map(([lineNumber, message]) => (
                  <li key={`error_line_${lineNumber}`}>
                    Ligne <b>{lineNumber}</b>: {message}
                  </li>
                ))}
              </ul>
            </ErrorBox>
          )}

          {!!otherError && <ErrorBox title={otherError} className="mb-3" />}

          <div className="form__group">
            <label htmlFor="candidats">Fichier csv des candidats</label>
            <input type="file" name="candidats" {...dataId('candidats-field')} id="candidats" />
            <Button
              type="submit"
              name="submit"
              id="submit"
              {...dataId('submit-button')}
              className="mt-2"
            >
              Envoyer
            </Button>
          </div>
        </form>
      </div>
    </PageTemplate>
  )
}

hydrateOnClient(AdminImporterCandidats)
