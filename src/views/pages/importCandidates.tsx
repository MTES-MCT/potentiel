import React from 'react'
import { Project, AppelOffre } from '../../entities'
import { dataId } from '../../helpers/testId'
import ROUTES from '../../routes'
import { HttpRequest } from '../../types'
import AdminDashboard from '../components/adminDashboard'
import appelOffre from '../../entities/appelOffre'

interface AdminListProjectsProps {
  request: HttpRequest
}

/* Pure component */
export default function AdminListProjects({ request }: AdminListProjectsProps) {
  const { error, success } = request.query || {}
  return (
    <AdminDashboard currentPage="import-projects">
      <div className="panel">
        <div className="panel__header">
          <h3>Importer des candidats</h3>
        </div>
        <form
          action={ROUTES.IMPORT_PROJECTS_ACTION}
          method="post"
          encType="multipart/form-data"
        >
          {error ? (
            <div className="notification error" {...dataId('error-message')}>
              {error.split('\n').map((piece) => (
                <>
                  {piece}
                  <br />
                </>
              ))}
            </div>
          ) : (
            ''
          )}

          <div className="form__group">
            <label htmlFor="candidats">Fichier csv des candidats</label>
            <input
              type="file"
              name="candidats"
              {...dataId('candidats-field')}
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
