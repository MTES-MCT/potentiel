import React from 'react'
import { logger } from '../../../core/utils'
import { Project, ProjectAdmissionKey, User } from '../../../entities'
import { dataId } from '../../../helpers/testId'
import ROUTES from '../../../routes'
import { Request } from 'express'
import { SuccessErrorBox } from '../../components'
import AdminDashboard from '../../components/adminDashboard'
import UserDashboard from '../../components/userDashboard'
import { NoteElement, Section } from './components'
import { ProjectFrise, ProjectHeader, EditProjectData } from './sections'

interface ProjectDetailsProps {
  request: Request
  project: Project
  projectUsers: Array<User>
  projectInvitations: Array<ProjectAdmissionKey>
}

/* Pure component */
export default function ProjectDetails({
  request,
  project,
  projectUsers,
  projectInvitations,
}: ProjectDetailsProps) {
  const { user } = request
  const { error, success } = request.query || {}

  if (!user) {
    // Should never happen
    logger.error('Try to render ProjectDetails without a user')
    return <div />
  }

  const Dashboard = user.role === 'porteur-projet' ? UserDashboard : AdminDashboard
  return (
    <Dashboard role={user.role} currentPage="list-projects">
      <div className="panel" style={{ padding: 0 }}>
        <ProjectHeader project={project} user={user} />
        <div style={{ padding: '1.5em', paddingTop: 0 }}>
          <SuccessErrorBox success={success} error={error} />
          <div style={{ position: 'relative' }}>
            <ProjectFrise {...{ project, request, user }} />
          </div>
          <Section title="Projet" icon="building">
            <div>
              <h5 style={{ marginBottom: 5 }}>Performances</h5>
              <div>
                Puissance installée: {project.puissance} {project.appelOffre?.unitePuissance}
              </div>
            </div>
            <div>
              <h5 style={{ marginBottom: 5, marginTop: 10 }}>Site de production</h5>
              <div>{project.adresseProjet}</div>
              <div>
                {project.codePostalProjet} {project.communeProjet}
              </div>
              <div>
                {project.departementProjet}, {project.regionProjet}
              </div>
            </div>
          </Section>
          <Section title="Contact" icon="user-circle">
            <div style={{ marginBottom: 10 }}>{project.nomCandidat}</div>
            <div>
              <h5 style={{ marginBottom: 5 }}>Représentant légal</h5>
              <div>{project.nomRepresentantLegal}</div>
              <div>{project.email}</div>
            </div>
            <div>
              <h5 style={{ marginBottom: 5, marginTop: 15 }}>Comptes ayant accès à ce projet</h5>
              <ul style={{ marginTop: 5, marginBottom: 5 }}>
                {projectUsers.map((user) => (
                  <li key={'project_user_' + user.id}>
                    {user.fullName} - {user.email}
                  </li>
                ))}
                {projectInvitations.map(({ id, email }) => (
                  <li key={'project_invitation_' + email}>
                    {email} (
                    {user.role === 'admin' ? (
                      <a
                        href={ROUTES.PROJECT_INVITATION({
                          projectAdmissionKey: id,
                        })}
                      >
                        invitation envoyée
                      </a>
                    ) : (
                      <i>invitation envoyée</i>
                    )}
                    )
                  </li>
                ))}
                {!projectUsers.length && !projectInvitations.length ? (
                  <>
                    <li>Aucun utilisateur n'a accès à ce projet pour le moment.</li>
                  </>
                ) : (
                  ''
                )}
              </ul>
            </div>
            {user.role !== 'dreal' ? (
              <div {...dataId('invitation-form')}>
                <a
                  href="#"
                  {...dataId('invitation-form-show-button')}
                  className="invitationFormToggle"
                >
                  Donner accès à un autre utilisateur
                </a>
                <form
                  action={ROUTES.INVITE_USER_TO_PROJECT_ACTION}
                  method="post"
                  name="form"
                  className="invitationForm"
                >
                  <h5 style={{ marginBottom: 5 }}>Gestion des accès à ce projet</h5>
                  <input type="hidden" name="projectId" id="projectId" value={project.id} />
                  <label htmlFor="email">
                    Courrier électronique de la personne habilitée à suivre ce projet
                  </label>
                  <input type="email" name="email" id="email" {...dataId('email-field')} />
                  <button
                    className="button"
                    type="submit"
                    name="submit"
                    id="submit"
                    {...dataId('submit-button')}
                  >
                    Accorder les droits sur ce projet
                  </button>
                  <a href="#" {...dataId('invitation-form-hide-button')}>
                    Annuler
                  </a>
                </form>
              </div>
            ) : (
              ''
            )}
          </Section>
          <Section title="Matériels et technologies" icon="cog">
            <div>Fournisseur: {project.fournisseur}</div>
            <div>Evaluation carbone simplifiée: {project.evaluationCarbone} kg eq CO2/kWc</div>
          </Section>
          {project.appelOffre?.id === 'CRE4 - Innovation' && user.role !== 'dreal' ? (
            <Section title="Résultats de l'appel d'offres" icon="clipboard-check">
              <div style={{ marginBottom: 10, fontSize: 18 }} {...dataId('project-note')}>
                <b>Note totale</b>: {project.note || 'N/A'}
              </div>
              <ul>
                <NoteElement project={project} column={'Note prix'} />
                <NoteElement project={project} column={'Note innovation\n(AO innovation)'} />
                <ul>
                  <NoteElement
                    project={project}
                    column={'Note degré d’innovation (/20pt)\n(AO innovation)'}
                  />
                  <NoteElement
                    project={project}
                    column={'Note positionnement sur le marché (/10pt)\n(AO innovation)'}
                  />
                  <NoteElement
                    project={project}
                    column={'Note qualité technique (/5pt)\n(AO innovation)'}
                  />
                  <NoteElement
                    project={project}
                    column={
                      'Note adéquation du projet avec les ambitions industrielles (/5pt)\n(AO innovation)'
                    }
                  />
                  <NoteElement
                    project={project}
                    column={'Note aspects environnementaux et sociaux (/5pt)\n(AO innovation)'}
                  />
                </ul>
              </ul>
            </Section>
          ) : (
            ''
          )}
          {['admin', 'dgec'].includes(user.role) && project.notifiedOn ? (
            <Section title="Remplacer l'attestation" icon="building">
              <EditProjectData project={project} request={request} />
            </Section>
          ) : (
            ''
          )}
        </div>
      </div>
    </Dashboard>
  )
}
