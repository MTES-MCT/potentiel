import React from 'react'

import { Project, CandidateNotification } from '../../entities'
import ROUTES from '../../routes'

import UploadProjects from '../components/uploadProjects'
import ProjectList from '../components/projectList'

interface AdminDashboardProps {
  error?: string
  success?: string
  projects?: Array<Project>
}

/* Pure component */
export default function AdminDashboard({
  error,
  success,
  projects
}: AdminDashboardProps) {
  return (
    <>
      <div className="hero" role="banner">
        <div className="hero__container" style={{ minHeight: '10em' }}>
          <h1>Administrateur DGEC</h1>
        </div>
      </div>
      <main role="main">
        <section className="section section-grey">
          <div className="container">
            <UploadProjects error={error} success={success} />
          </div>
        </section>
        <section className="section section-white">
          <div className="container">
            <div>
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
                  marginTop: '5px',
                  marginRight: '15px'
                }}
                href={ROUTES.SEND_NOTIFICATIONS_ACTION}
              >
                Envoyer les notifications aux candidats
              </a>
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
          </div>
        </section>
      </main>
    </>
  )
}
