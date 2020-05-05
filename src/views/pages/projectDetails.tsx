import React from 'react'

import { Project } from '../../entities'
import UserDashboard from '../components/userDashboard'
import AdminDashboard from '../components/adminDashboard'
import ProjectActions from '../components/projectActions'
import { porteurProjetActions, adminActions } from '../components/actions'
import { HttpRequest } from '../../types'
import { dataId } from '../../helpers/testId'

const Section = ({ title, children }) => {
  return (
    <div {...dataId('projectDetails-section')}>
      <h3
        className="section--title"
        {...dataId('projectDetails-section-toggle')}
      >
        {title}
        <svg className="icon section--expand">
          <use xlinkHref="#expand"></use>
        </svg>
      </h3>
      <div
        className="section--content"
        {...dataId('projectDetails-section-content')}
      >
        {children}
      </div>
    </div>
  )
}

interface ProjectDetailsProps {
  request: HttpRequest
  project: Project
}

/* Pure component */
export default function ProjectDetails({
  request,
  project,
}: ProjectDetailsProps) {
  const { user } = request
  const { error, success } = request.query || {}

  if (!user) {
    // Should never happen
    console.log('Try to render ProjectDetails without a user')
    return <div />
  }

  const Dashboard =
    user.role === 'porteur-projet' ? UserDashboard : AdminDashboard
  return (
    <Dashboard currentPage="list-projects">
      <div className="panel">
        <div className="panel__header" style={{ position: 'relative' }}>
          <h3>{project.nomProjet}</h3>
          <div style={{ position: 'absolute', right: 0, bottom: 25 }}>
            <ProjectActions
              project={project}
              projectActions={
                user.role === 'porteur-projet'
                  ? porteurProjetActions
                  : adminActions
              }
            />
          </div>
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
        <Section title="Section 1">Ceci est du contenu</Section>
        <Section title="Section 2">Ceci est du contenu</Section>
        <Section title="Section 3">Ceci est du contenu</Section>
      </div>
    </Dashboard>
  )
}
