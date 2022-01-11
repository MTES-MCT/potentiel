import { Request } from 'express'
import React, { useState } from 'react'
import { logger } from '../../../core/utils'
import { dataId } from '../../../helpers/testId'
import { ProjectDataForProjectPage } from '../../../modules/project/dtos'
import ROUTES from '../../../routes'
import { RoleBasedDashboard, SuccessErrorBox } from '../../components'
import { NoteElement, Section, Timeline } from './components'
import { EditProjectData, ProjectFrise, ProjectHeader } from './sections'
import { PageLayout } from '../../components/PageLayout'
import { hydrateOnClient } from '../../helpers'
import { CDCChoiceForm } from '../../components'
import { ProjectEventListDTO } from '../../../modules/frise'

interface ProjectDetailsProps {
  request: Request
  project: ProjectDataForProjectPage
  cahiersChargesURLs?: { oldCahierChargesURL?: string; newCahierChargesURL?: string }
  projectEventList?: ProjectEventListDTO
  now: number
}

/* Pure component */
export const ProjectDetails = PageLayout(
  ({ request, project, cahiersChargesURLs, projectEventList, now }: ProjectDetailsProps) => {
    const { user } = request
    const { error, success } = (request.query as any) || {}

    const [displaySubmitButton, setDisplaySubmitButton] = useState(true)

    if (!user) {
      // Should never happen
      logger.error('Try to render ProjectDetails without a user')
      return <div />
    }

    return (
      <RoleBasedDashboard role={user.role} currentPage="list-projects">
        <div className="panel" style={{ padding: 0 }}>
          <ProjectHeader project={project} user={user} cahiersChargesURLs={cahiersChargesURLs} />
          <div style={{ padding: '1.5em', paddingTop: 0 }}>
            <SuccessErrorBox success={success} error={error} />
            <div style={{ position: 'relative' }}>
              {projectEventList && (
                <Timeline {...{ projectEventList, projectId: project.id, now }} />
              )}
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
              {project.notifiedOn &&
              ['admin', 'dgec', 'porteur-projet', 'dreal'].includes(user.role) ? (
                <div>
                  <h5 style={{ marginBottom: 5, marginTop: 15 }}>
                    Comptes ayant accès à ce projet
                  </h5>
                  <ul style={{ marginTop: 5, marginBottom: 5 }}>
                    {project.users.map(({ id, fullName, email }) => (
                      <li key={'project_user_' + id}>
                        {fullName && `${fullName} - `}
                        {email}
                        {id !== user.id ? (
                          <a
                            href={ROUTES.REVOKE_USER_RIGHTS_TO_PROJECT_ACTION({
                              projectId: project.id,
                              userId: id,
                            })}
                            style={{ marginLeft: 5 }}
                            data-confirm={`Etes-vous sur de vouloir retirer les droits à ce projet à ${fullName} ?`}
                          >
                            retirer
                          </a>
                        ) : (
                          ''
                        )}
                      </li>
                    ))}
                    {!project.users.length ? (
                      <>
                        <li>Aucun utilisateur n‘a accès à ce projet pour le moment.</li>
                      </>
                    ) : (
                      ''
                    )}
                  </ul>
                </div>
              ) : (
                ''
              )}
              {['admin', 'dgec', 'porteur-projet'].includes(user.role) ? (
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
              <Section title="Modifier le projet" icon="building">
                <EditProjectData project={project} request={request} />
              </Section>
            ) : (
              ''
            )}
            {user.role == 'porteur-projet' && project.isClasse ? (
              <Section title="Cahier des charges" icon="clipboard-check">
                <form action={ROUTES.CHANGER_CDC} method="post" className={'m-0 max-w-full'}>
                  <CDCChoiceForm
                    newRulesOptIn={project.newRulesOptIn}
                    cahiersChargesURLs={cahiersChargesURLs}
                    onChoiceChange={(isNewRule) => setDisplaySubmitButton(isNewRule)}
                  />
                  <input type="hidden" name="projectId" value={project.id} />
                  {!project.newRulesOptIn && (
                    <button
                      className="button"
                      type="submit"
                      style={{ margin: 'auto', width: 260, display: 'block' }}
                      disabled={displaySubmitButton}
                    >
                      Enregistrer mon changement
                    </button>
                  )}
                </form>
              </Section>
            ) : (
              ''
            )}
          </div>
        </div>
      </RoleBasedDashboard>
    )
  }
)

hydrateOnClient(ProjectDetails)
