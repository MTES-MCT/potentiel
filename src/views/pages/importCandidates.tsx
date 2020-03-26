import React from 'react'
import { Project } from '../../entities'
import { dataId } from '../../helpers/testId'
import ROUTES from '../../routes'
import { HttpRequest } from '../../types'
import AdminDashboard from '../components/adminDashboard'

interface AdminListProjectsProps {
  request: HttpRequest
  projects?: Array<Project>
}

/* Pure component */
export default function AdminListProjects({
  request,
  projects
}: AdminListProjectsProps) {
  const { error, success } = request.query || {}
  return (
    <AdminDashboard currentPage="import-projects">
      <div className="panel">
        <div className="panel__header">
          <h3>Importer un fichier de candidats</h3>
        </div>
        <form
          action={ROUTES.IMPORT_PROJECTS_ACTION}
          method="post"
          encType="multipart/form-data"
        >
          <div className="form__group">
            {error ? (
              <div className="notification error" {...dataId('error-message')}>
                {error}
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
