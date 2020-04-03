import React from 'react'
import { Project, AppelOffre } from '../../entities'
import { dataId } from '../../helpers/testId'
import ROUTES from '../../routes'
import { HttpRequest } from '../../types'
import AdminDashboard from '../components/adminDashboard'
import appelOffre from '../../entities/appelOffre'

interface AdminListProjectsProps {
  request: HttpRequest
  appelsOffre: Array<AppelOffre>
}

/* Pure component */
export default function AdminListProjects({
  request,
  appelsOffre
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
          {error ? (
            <div className="notification error" {...dataId('error-message')}>
              {error}
            </div>
          ) : (
            ''
          )}
          <div className="form__group">
            <legend>AO et Période</legend>
            <select name="ao" id="ao" {...dataId('importProjects-aoField')}>
              {appelsOffre.map(appelOffre => (
                <option key={'appel_' + appelOffre.id} value={appelOffre.id}>
                  {appelOffre.shortTitle}
                </option>
              ))}
            </select>
            <select
              name="periode"
              id="periode"
              {...dataId('importProjects-periodeField')}
            >
              {appelsOffre[0].periodes.map(periode => (
                <option key={'appel_' + periode.id} value={periode.id}>
                  {periode.title}
                </option>
              ))}
            </select>
          </div>
          <div className="form__group">
            <label htmlFor="candidats">
              Fichier csv (doit suivre{' '}
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
