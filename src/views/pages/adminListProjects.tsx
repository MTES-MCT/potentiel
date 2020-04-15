import AdminDashboard from '../components/adminDashboard'

import React from 'react'

import { Project, AppelOffre } from '../../entities'
import ROUTES from '../../routes'
import { dataId } from '../../helpers/testId'

import ProjectList from '../components/projectList'
import { HttpRequest } from '../../types'

interface AdminListProjectsProps {
  request: HttpRequest
  projects?: Array<Project>
}

/* Pure component */
export default function AdminListProjects({
  request,
  projects,
}: AdminListProjectsProps) {
  const { error, success } = request.query || {}
  return (
    <AdminDashboard currentPage="list-projects">
      <div className="panel">
        <div className="panel__header">
          <h3>Projets</h3>
          {/* <input
            type="text"
            className="table__filter"
            placeholder="Filtrer les projets"
          /> */}
        </div>
        {success ? (
          <div className="notification success" {...dataId('success-message')}>
            {success}
          </div>
        ) : (
          ''
        )}
        {error ? (
          <div className="notification error" {...dataId('error-message')}>
            {error}
          </div>
        ) : (
          ''
        )}
        <ProjectList
          projects={projects}
          projectActions={(project: Project, appelOffre?: AppelOffre) => [
            {
              title: 'Voir attestation',
              link: ROUTES.CANDIDATE_CERTIFICATE_FOR_ADMINS(project),
              isDownload: true,
            },
          ]}
        />
      </div>
    </AdminDashboard>
  )
}
