import React from 'react'
import moment from 'moment'

import { Project } from '../../entities'
import UserDashboard from '../components/userDashboard'
import AdminDashboard from '../components/adminDashboard'
import ProjectActions from '../components/projectActions'
import { porteurProjetActions, adminActions } from '../components/actions'
import { HttpRequest } from '../../types'
import { dataId } from '../../helpers/testId'
import ROUTES from '../../routes'

interface FriseItemProps {
  color?: string
  children: React.ReactNode
}
const FriseItem = ({ color, children }: FriseItemProps) => {
  return (
    <li
      className="frise--item"
      style={{
        listStyleImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 100 100'><circle fill='" +
          (color || '#8393a7') +
          "' cx='50%' cy='50%' r='50' /></svg>\")",
      }}
    >
      {children}
    </li>
  )
}

interface SectionProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}

const Section = ({ title, defaultOpen, children }: SectionProps) => {
  return (
    <div {...dataId('projectDetails-section')}>
      <h3
        className={'section--title' + (defaultOpen ? ' open' : '')}
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
          <span style={{ marginLeft: 10 }}>
            {project.communeProjet}, {project.departementProjet},{' '}
            {project.regionProjet}
          </span>
          <div style={{ fontSize: 13 }}>
            {project.classe === 'Classé' ? (
              <span
                style={{
                  color: 'rgb(56, 118, 29)',
                  fontWeight: 'bold',
                }}
              >
                Lauréat
              </span>
            ) : (
              <span
                style={{
                  color: 'rgb(204, 0, 0)',
                  fontWeight: 'bold',
                }}
              >
                Eliminé
              </span>
            )}{' '}
            de {project.appelOffre?.id} {project.appelOffre?.periode?.title}{' '}
            période
          </div>
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
        <div style={{ position: 'relative' }}>
          <ul className="frise">
            {project.notifiedOn ? (
              <>
                <FriseItem
                  color={
                    project.classe === 'Classé'
                      ? 'rgb(56, 118, 29)'
                      : 'rgb(204, 0, 0)'
                  }
                >
                  {moment(project.notifiedOn).format('D MMM YYYY')} -
                  Désignation AO {project.appelOffre?.id}{' '}
                  {project.appelOffre?.periode?.canGenerateCertificate ? (
                    <a
                      href={
                        user.role === 'porteur-projet'
                          ? ROUTES.CANDIDATE_CERTIFICATE_FOR_CANDIDATES(project)
                          : ROUTES.CANDIDATE_CERTIFICATE_FOR_ADMINS(project)
                      }
                    >
                      Télécharger l'attestation
                    </a>
                  ) : (
                    ''
                  )}
                </FriseItem>
                {project.classe === 'Classé' ? (
                  <FriseItem>
                    {moment(project.notifiedOn)
                      .add(2, 'months')
                      .format('D MMM YYYY')}{' '}
                    - Limite de dépot de garantie financière{' '}
                    <a href="#">Déposer</a>
                  </FriseItem>
                ) : (
                  ''
                )}
              </>
            ) : (
              ''
            )}
          </ul>
        </div>
        <Section title="Projet" defaultOpen={true}>
          <div>
            <h5 style={{ marginBottom: 5 }}>Site de production</h5>
            <div>{project.adresseProjet}</div>
            <div>
              {project.codePostalProjet} {project.communeProjet}
            </div>
            <div>
              {project.departementProjet}, {project.regionProjet}
            </div>
          </div>
          <div>
            <h5 style={{ marginBottom: 5, marginTop: 10 }}>Performances</h5>
            <div>
              Puissance installée: {project.puissance}{' '}
              {project.appelOffre?.unitePuissance}
            </div>
            <div>
              Evaluation carbone simplifiée: {project.evaluationCarbone} kg eq
              CO2/kWc
            </div>
          </div>
        </Section>
        <Section title="Candidat" defaultOpen={true}>
          <div style={{ marginBottom: 10 }}>{project.nomCandidat}</div>
          <div>
            <h5 style={{ marginBottom: 5 }}>Représentant légal</h5>
            <div>{project.nomRepresentantLegal}</div>
            <div>{project.email}</div>
          </div>
        </Section>
      </div>
    </Dashboard>
  )
}
