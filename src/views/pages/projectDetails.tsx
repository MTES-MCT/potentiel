import React from 'react'
import moment from 'moment'
import { formatDate } from '../../helpers/formatDate'

import {
  Project,
  User,
  ProjectAdmissionKey,
  makeProjectIdentifier,
} from '../../entities'
import UserDashboard from '../components/userDashboard'
import AdminDashboard from '../components/adminDashboard'
import ProjectActions from '../components/projectActions'
import { porteurProjetActions, adminActions } from '../components/actions'
import { HttpRequest } from '../../types'
import { dataId, testId } from '../../helpers/testId'
import ROUTES from '../../routes'

interface GarantiesFinancieresFormProps {
  projectId: string
  date?: string
}
const GarantiesFinancieresForm = ({
  projectId,
  date,
}: GarantiesFinancieresFormProps) => (
  <form
    action={ROUTES.DEPOSER_GARANTIES_FINANCIERES_ACTION}
    method="post"
    encType="multipart/form-data"
  >
    <div className="form__group">
      <label htmlFor="date">Date de constitution (format JJ/MM/AAAA)</label>
      <input
        type="text"
        name="gfDate"
        {...dataId('date-field')}
        defaultValue={date || ''}
        data-max-date={Date.now()}
      />
      <div
        className="notification error"
        style={{ display: 'none' }}
        {...dataId('error-message-out-of-bounds')}
      >
        Merci de saisir une date antérieure à la date d'aujourd'hui.
      </div>
      <div
        className="notification error"
        style={{ display: 'none' }}
        {...dataId('error-message-wrong-format')}
      >
        Le format de la date saisie n'est pas conforme. Elle doit être de la
        forme JJ/MM/AAAA soit par exemple 25/05/2022 pour 25 Mai 2022.
      </div>
      <label htmlFor="file">Attestation</label>
      <input type="hidden" name="projectId" value={projectId} />
      <input type="file" name="file" {...dataId('file-field')} id="file" />
      <button
        className="button"
        type="submit"
        name="submit"
        id="submit"
        {...dataId('submit-gf-button')}
      >
        Envoyer
      </button>
      <button
        className="button-outline primary"
        {...dataId('frise-hide-content')}
      >
        Annuler
      </button>
    </div>
  </form>
)

interface DCRFormProps {
  projectId: string
  date?: string
}
const DCRForm = ({ projectId, date }: DCRFormProps) => (
  <form
    action={ROUTES.DEPOSER_DCR_ACTION}
    method="post"
    encType="multipart/form-data"
  >
    <div className="form__group">
      <label htmlFor="date">
        Date d'attestation de DCR (format JJ/MM/AAAA)
      </label>
      <input
        type="text"
        name="dcrDate"
        {...dataId('date-field')}
        defaultValue={date || ''}
        data-max-date={Date.now()}
      />
      <div
        className="notification error"
        style={{ display: 'none' }}
        {...dataId('error-message-out-of-bounds')}
      >
        Merci de saisir une date antérieure à la date d'aujourd'hui.
      </div>
      <div
        className="notification error"
        style={{ display: 'none' }}
        {...dataId('error-message-wrong-format')}
      >
        Le format de la date saisie n'est pas conforme. Elle doit être de la
        forme JJ/MM/AAAA soit par exemple 25/05/2022 pour 25 Mai 2022.
      </div>
      <label htmlFor="numero-dossier">
        Identifiant gestionnaire de réseau (ex: GEFAR-P)
      </label>
      <input
        type="numero-dossier"
        name="numeroDossier"
        {...dataId('numero-dossier-field')}
      />
      <label htmlFor="file">Attestation</label>
      <input type="file" name="file" {...dataId('file-field')} id="file" />
      <input type="hidden" name="projectId" value={projectId} />
      <button className="button" type="submit" {...dataId('submit-dcr-button')}>
        Envoyer
      </button>
      <button
        className="button-outline primary"
        {...dataId('frise-hide-content')}
      >
        Annuler
      </button>
    </div>
  </form>
)

interface FriseContainerProps {
  children: React.ReactNode
  displayToggle: boolean
}

const Frise = ({ children, displayToggle }: FriseContainerProps) => (
  <table
    className="frise"
    style={{ borderCollapse: 'collapse', marginBottom: 20 }}
  >
    <thead>
      <tr>
        <td style={{ width: 16 }} />
        <td style={{ width: 16 }} />
        <td />
        <td />
        <td />
      </tr>
    </thead>
    <tbody>
      <tr>
        <td
          style={{
            position: 'relative',
            borderRight: '2px solid var(--lighter-grey)',
            height: 10,
          }}
        ></td>
        <td></td>
      </tr>
      {children}
      {displayToggle ? (
        <tr>
          <td
            style={{
              position: 'relative',
              borderRight: '2px solid var(--lighter-grey)',
            }}
          ></td>
          <td></td>
          <td colSpan={3} style={{ paddingLeft: 5 }}>
            <a
              className="frise--toggle-show"
              href="#"
              {...dataId('frise-show-timeline')}
            >
              Afficher les étapes suivantes
            </a>
            <a
              className="frise--toggle-hide"
              href="#"
              {...dataId('frise-hide-timeline')}
            >
              Masquer les étapes à venir
            </a>
          </td>
        </tr>
      ) : (
        ''
      )}
    </tbody>
  </table>
)

interface Action {
  title: string
  link?: string
  download?: true
  openHiddenContent?: true
  confirm?: string
}

interface FriseItemProps {
  date?: string
  title: string
  action?: Action | Action[]
  hiddenContent?: React.ReactNode
  defaultHidden?: boolean
  status?: 'nextup' | 'past' | 'future'
}
const FriseItem = ({
  defaultHidden,
  date,
  title,
  action,
  hiddenContent,
  status = 'future',
}: FriseItemProps) => {
  const actions =
    typeof action === 'undefined'
      ? undefined
      : Array.isArray(action)
      ? action
      : [action]
  return (
    <>
      <tr
        {...dataId('frise-item')}
        className={'frise--item' + (defaultHidden ? ' frise--collapsed' : '')}
      >
        <td
          style={{
            position: 'relative',
            borderRight: '2px solid var(--lighter-grey)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 6,
              left: 3,
              width: 26,
              height: 26,
              textAlign: 'center',
            }}
          >
            {status === 'past' ? (
              <svg
                fill="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                width="20"
                height="20"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            ) : status === 'nextup' ? (
              <svg
                fill="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                width="20"
                height="20"
                stroke="var(--blue)"
                viewBox="0 0 24 24"
                {...(actions &&
                actions.some((action) => action.openHiddenContent)
                  ? {
                      ...dataId('frise-action'),
                      className: 'frise-content-toggle',
                    }
                  : {})}
              >
                <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            ) : (
              <svg
                fill="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                width="20"
                height="20"
                stroke="var(--light-grey)"
                viewBox="0 0 24 24"
              >
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            )}
          </div>
        </td>
        <td></td>
        <td style={{ padding: '0 5px', fontStyle: 'italic' }}>{date || ''}</td>
        <td
          style={{ padding: '0 5px' }}
          {...dataId('frise-title')}
          data-status={status}
        >
          {title}
        </td>
        <td>
          {actions ? (
            <>
              {actions.map((action, index) =>
                action.link ? (
                  <a
                    key={'action_' + index}
                    href={action.link}
                    {...dataId('frise-action')}
                    download={action.download}
                    style={{ marginRight: 10 }}
                    data-confirm={action.confirm}
                  >
                    {action.title}
                  </a>
                ) : action.openHiddenContent ? (
                  <a
                    key={'action_' + index}
                    {...dataId('frise-action')}
                    className="frise-content-toggle"
                    style={{ marginRight: 10 }}
                  >
                    {action.title}
                  </a>
                ) : (
                  <span
                    key={'action_' + index}
                    className="disabled-action"
                    style={{ marginRight: 10 }}
                  >
                    {action.title}
                  </span>
                )
              )}
            </>
          ) : (
            ''
          )}
        </td>
      </tr>
      {hiddenContent ? (
        <tr {...dataId('frise-hidden-content')} className="hidden">
          <td
            style={{
              position: 'relative',
              borderRight: '2px solid var(--lighter-grey)',
            }}
          ></td>
          <td></td>
          <td></td>
          <td colSpan={2} style={{ padding: '20px 5px 60px' }}>
            {hiddenContent}
          </td>
        </tr>
      ) : null}
    </>
  )
}

interface SectionProps {
  title: string
  defaultOpen?: boolean
  icon?: string
  children: React.ReactNode
}

const Section = ({ title, defaultOpen, children, icon }: SectionProps) => {
  return (
    <div {...dataId('projectDetails-section')}>
      <h3
        className={'section--title' + (defaultOpen ? ' open' : '')}
        {...dataId('visibility-toggle')}
      >
        {icon ? (
          <svg className="icon section-icon">
            <use xlinkHref={'#' + icon}></use>
          </svg>
        ) : (
          ''
        )}
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

interface NoteElementProps {
  project: Project
  column: string
}
const NoteElement = ({ project, column }: NoteElementProps) => {
  let noteStr: string = project.details && project.details[column]

  if (noteStr) {
    const note = parseFloat(noteStr.replace(',', '.'))

    if (!Number.isNaN(note)) {
      noteStr = (Math.round(note * 100) / 100).toString()
    } else noteStr = 'N/A'
  }

  return (
    <li>
      <b>{column.replace('\n(AO innovation)', '')}</b>: {noteStr || 'N/A'}
    </li>
  )
}

interface ProjectDetailsProps {
  request: HttpRequest
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
    console.log('Try to render ProjectDetails without a user')
    return <div />
  }

  const Dashboard =
    user.role === 'porteur-projet' ? UserDashboard : AdminDashboard
  return (
    <Dashboard role={user.role} currentPage="list-projects">
      <div className="panel" style={{ padding: 0 }}>
        <div
          className="panel__header"
          style={{
            position: 'relative',
            padding: '1.5em',
            paddingBottom: 0,
            backgroundColor:
              project.classe === 'Classé'
                ? '#daf5e7'
                : 'hsla(5,70%,79%,.45882)',
          }}
        >
          <h3>{project.nomProjet}</h3>
          <span style={{ marginLeft: 10 }}>
            {project.communeProjet}, {project.departementProjet},{' '}
            {project.regionProjet}
          </span>
          <div style={{ fontSize: 13 }}>{makeProjectIdentifier(project)}</div>
          <div
            style={{
              fontWeight: 'bold',
              color:
                project.classe === 'Classé'
                  ? 'rgb(56, 118, 29)'
                  : 'rgb(204, 0, 0)',
            }}
          >
            {project.classe === 'Classé' ? 'Actif' : 'Eliminé'}
          </div>
          <div style={{ position: 'absolute', right: '1.5em', bottom: 25 }}>
            <ProjectActions
              project={project}
              projectActions={
                user.role === 'porteur-projet'
                  ? porteurProjetActions
                  : user.role === 'admin'
                  ? adminActions
                  : undefined
              }
            />
          </div>
        </div>
        <div style={{ padding: '1.5em', paddingTop: 0 }}>
          {success ? (
            <>
              <div
                className="notification success"
                {...dataId('success-message')}
              >
                {success}
              </div>
            </>
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
            <Frise displayToggle={project.classe === 'Classé'}>
              {project.notifiedOn ? (
                <>
                  <FriseItem
                    date={formatDate(project.notifiedOn, 'D MMM YYYY')}
                    title="Notification des résultats"
                    status="past"
                    action={
                      !!project.certificateFile && user.role !== 'dreal'
                        ? {
                            title: "Télécharger l'attestation",
                            link:
                              user.role === 'porteur-projet'
                                ? ROUTES.CANDIDATE_CERTIFICATE_FOR_CANDIDATES(
                                    project
                                  )
                                : ROUTES.CANDIDATE_CERTIFICATE_FOR_ADMINS(
                                    project
                                  ),
                            download: true,
                          }
                        : undefined
                    }
                  />
                  {project.classe === 'Classé' ? (
                    <>
                      {project.garantiesFinancieresDueOn ? (
                        project.garantiesFinancieresSubmittedOn ? (
                          // garanties financières déjà déposées
                          <FriseItem
                            date={formatDate(
                              project.garantiesFinancieresDate,
                              'D MMM YYYY'
                            )}
                            title="Constitution des garanties financières"
                            action={[
                              {
                                title: "Télécharger l'attestation",
                                link: project.garantiesFinancieresFileRef
                                  ? ROUTES.DOWNLOAD_PROJECT_FILE(
                                      project.garantiesFinancieresFileRef.id,
                                      project.garantiesFinancieresFileRef
                                        .filename
                                    )
                                  : undefined,
                                download: true,
                              },
                              ...(user.role === 'porteur-projet'
                                ? [
                                    {
                                      title: 'Annuler le dépôt',
                                      confirm:
                                        "Etes-vous sur de vouloir annuler le dépôt et supprimer l'attestion jointe ?",
                                      link: ROUTES.SUPPRIMER_GARANTIES_FINANCIERES_ACTION(
                                        project.id
                                      ),
                                    },
                                  ]
                                : []),
                            ]}
                            status="past"
                          />
                        ) : (
                          // garanties financières non-déposées
                          <FriseItem
                            date={formatDate(
                              project.garantiesFinancieresDueOn,
                              'D MMM YYYY'
                            )}
                            title="Constitution des garanties financières"
                            action={
                              user.role === 'dreal'
                                ? project.garantiesFinancieresDueOn < Date.now()
                                  ? {
                                      title: 'Télécharger mise en demeure',
                                      link: ROUTES.TELECHARGER_MODELE_MISE_EN_DEMEURE(
                                        project
                                      ),
                                      download: true,
                                    }
                                  : undefined
                                : {
                                    title: "Transmettre l'attestation",
                                    openHiddenContent:
                                      user.role === 'porteur-projet'
                                        ? true
                                        : undefined,
                                  }
                            }
                            status="nextup"
                            hiddenContent={
                              <GarantiesFinancieresForm
                                projectId={project.id}
                                date={request.query.gfDate}
                              />
                            }
                          />
                        )
                      ) : null}
                      {project.dcrDueOn ? (
                        project.dcrSubmittedOn ? (
                          // DCR déjà déposée
                          <FriseItem
                            date={formatDate(project.dcrDate, 'D MMM YYYY')}
                            title={`Demande complète de raccordement ${
                              project.dcrNumeroDossier
                                ? '(Dossier ' + project.dcrNumeroDossier + ')'
                                : ''
                            }`}
                            action={[
                              {
                                title: "Télécharger l'attestation",
                                link: project.dcrFileRef
                                  ? ROUTES.DOWNLOAD_PROJECT_FILE(
                                      project.dcrFileRef.id,
                                      project.dcrFileRef.filename
                                    )
                                  : undefined,
                                download: true,
                              },
                              ...(user.role === 'porteur-projet'
                                ? [
                                    {
                                      title: 'Annuler le dépôt',
                                      confirm:
                                        "Etes-vous sur de vouloir annuler le dépôt et supprimer l'attestion jointe ?",
                                      link: ROUTES.SUPPRIMER_DCR_ACTION(
                                        project.id
                                      ),
                                    },
                                  ]
                                : []),
                            ]}
                            status="past"
                          />
                        ) : (
                          // DCR non-déposée
                          <FriseItem
                            date={formatDate(project.dcrDueOn, 'D MMM YYYY')}
                            title="Demande complète de raccordement"
                            action={
                              user.role === 'dreal'
                                ? undefined
                                : {
                                    title: 'Indiquer la date de demande',
                                    openHiddenContent:
                                      user.role === 'porteur-projet'
                                        ? true
                                        : undefined,
                                  }
                            }
                            status="nextup"
                            hiddenContent={
                              <DCRForm
                                projectId={project.id}
                                date={request.query.dcrDate}
                              />
                            }
                          />
                        )
                      ) : null}
                      <FriseItem
                        title="Proposition technique et financière"
                        action={{ title: 'Indiquer la date de signature' }}
                      />
                      <FriseItem
                        title="Convention de raccordement"
                        action={{ title: 'Indiquer la date de signature' }}
                        defaultHidden={true}
                      />
                      <FriseItem
                        date={formatDate(
                          +moment(project.notifiedOn).add(
                            project.appelOffre?.delaiRealisationEnMois,
                            'months'
                          ),
                          'D MMM YYYY'
                        )}
                        title="Attestation de conformité"
                        action={{ title: "Transmettre l'attestation" }}
                        defaultHidden={true}
                      />
                      <FriseItem
                        title="Mise en service"
                        action={{ title: 'Indiquer la date' }}
                        defaultHidden={true}
                      />
                      <FriseItem
                        title="Contrat d'achat"
                        action={{ title: 'Indiquer la date de signature' }}
                        defaultHidden={true}
                      />
                    </>
                  ) : null}
                </>
              ) : (
                <FriseItem
                  title="Ce projet n'a pas encore été notifié."
                  status="nextup"
                />
              )}
            </Frise>
          </div>
          <Section title="Projet" icon="building">
            <div>
              <h5 style={{ marginBottom: 5 }}>Performances</h5>
              <div>
                Puissance installée: {project.puissance}{' '}
                {project.appelOffre?.unitePuissance}
              </div>
            </div>
            <div>
              <h5 style={{ marginBottom: 5, marginTop: 10 }}>
                Site de production
              </h5>
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
              <h5 style={{ marginBottom: 5, marginTop: 15 }}>
                Comptes ayant accès à ce projet
              </h5>
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
                    <li>
                      Aucun utilisateur n'a accès à ce projet pour le moment.
                    </li>
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
                  <h5 style={{ marginBottom: 5 }}>
                    Gestion des accès à ce projet
                  </h5>
                  <input
                    type="hidden"
                    name="projectId"
                    id="projectId"
                    value={project.id}
                  />
                  <label htmlFor="email">
                    Courrier électronique de la personne habilitée à suivre ce
                    projet
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    {...dataId('email-field')}
                  />
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
            <div>
              Evaluation carbone simplifiée: {project.evaluationCarbone} kg eq
              CO2/kWc
            </div>
          </Section>
          {project.appelOffre?.id === 'CRE4 - Innovation' &&
          user.role !== 'dreal' ? (
            <Section
              title="Résultats de l'appel d'offres"
              icon="clipboard-check"
            >
              <div
                style={{ marginBottom: 10, fontSize: 18 }}
                {...dataId('project-note')}
              >
                <b>Note totale</b>: {project.note || 'N/A'}
              </div>
              <ul>
                <NoteElement project={project} column={'Note prix'} />
                <NoteElement
                  project={project}
                  column={'Note innovation\n(AO innovation)'}
                />
                <ul>
                  <NoteElement
                    project={project}
                    column={'Note degré d’innovation (/20pt)\n(AO innovation)'}
                  />
                  <NoteElement
                    project={project}
                    column={
                      'Note positionnement sur le marché (/10pt)\n(AO innovation)'
                    }
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
                    column={
                      'Note aspects environnementaux et sociaux (/5pt)\n(AO innovation)'
                    }
                  />
                </ul>
              </ul>
            </Section>
          ) : (
            ''
          )}
        </div>
      </div>
    </Dashboard>
  )
}
