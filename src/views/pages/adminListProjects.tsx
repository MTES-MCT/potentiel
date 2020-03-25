import AdminDashboard from '../components/adminDashboard'

import React from 'react'

import { Project, CandidateNotification } from '../../entities'
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
  projects
}: AdminListProjectsProps) {
  const { error, success } = request.query || {}
  return (
    <AdminDashboard currentPage="list-projects">
      <div className="panel">
        <div className="panel__header">
          <h3>Projets</h3>
          <input
            type="text"
            className="table__filter"
            placeholder="Filtrer les projets"
          />
          <a
            className="button-outline primary"
            style={{
              float: 'right',
              marginBottom: 'var(--space-s)',
              marginTop: '2px',
              marginRight: '15px'
            }}
            {...dataId('send-candidate-notifications-button')}
            href={ROUTES.SEND_NOTIFICATIONS_ACTION}
          >
            Envoyer les notifications aux candidats
          </a>
        </div>
        {success ? (
          <div className="notification success" {...dataId('success-message')}>
            {success}
          </div>
        ) : (
          ''
        )}
        <ProjectList
          projects={projects}
          projectActions={(project: Project) => {
            if (!project.candidateNotifications) return null

            return project.candidateNotifications.map(
              (notif: CandidateNotification) => ({
                title: 'Voir mail ' + notif.template,
                link: ROUTES.CANDIDATE_NOTIFICATION + '?id=' + notif.id
              })
            )
          }}
        />
      </div>
    </AdminDashboard>
  )
}
