import React from 'react'
import { dataId } from '../../helpers/testId'
import ROUTES from '../../routes'

const UploadProjects = ({
  error,
  success
}: {
  error?: string
  success?: string
}) => {
  return (
    <form
      action={ROUTES.IMPORT_PROJECTS_ACTION}
      method="post"
      encType="multipart/form-data"
    >
      <div className="form__group">
        <h4>Importer les candidats d'une période</h4>
        {error ? <div className="notification error">{error}</div> : ''}
        {success ? (
          <div
            className="notification success"
            {...dataId('importProjects-successMessage')}
          >
            {success}
          </div>
        ) : (
          ''
        )}
        <label htmlFor="periode">Période</label>
        <input
          type="text"
          name="periode"
          id="periode"
          {...dataId('importProjects-periodeField')}
          placeholder="3T 2020"
        />
        <label htmlFor="candidats">
          Fichier (doit suivre{' '}
          <a href="/static/template-candidats.csv" download>
            ce format
          </a>
          )
        </label>
        <input
          type="file"
          name="candidats"
          {...dataId('importProjects-candidatsField')}
          id="candidats"
        />
        <button
          className="button"
          type="submit"
          name="submit"
          id="submit"
          {...dataId('importProjects-submitButton')}
        >
          Envoyer
        </button>
      </div>
    </form>
  )
}

export default UploadProjects
