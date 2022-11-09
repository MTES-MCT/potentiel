import { ACTION_BY_ROLE, PaginationPanel, ProjectActions } from '@components'
import { Project } from '@entities'
import { UserRole } from '@modules/users'
import routes from '@routes'
import React, { ComponentProps, ReactNode } from 'react'
import { formatDate } from '../../helpers/formatDate'
import { dataId } from '../../helpers/testId'
import { PaginatedList } from '../../types'
import { SecondaryButton, Tile } from './UI'
import { PowerIcon, EuroIcon, CloudIcon, FileDownloadIcon } from './UI/atoms/icons'

type ColumnRenderer = (props: { project: Project; GFPastDue?: boolean }) => React.ReactNode

const GF = ({ project, GFPastDue }: { project: Project; GFPastDue?: boolean }) => {
  return (
    <div>
      <div className="text-grey mb-1">Garanties Financières</div>
      {!project.garantiesFinancieresSubmittedOn && !GFPastDue && <div>Non Déposées</div>}
      {project.garantiesFinancieresSubmittedOn !== 0 && (
        <div>
          {project.garantiesFinancieresFileRef && (
            <a
              className="block"
              href={routes.DOWNLOAD_PROJECT_FILE(
                project.garantiesFinancieresFileRef.id,
                project.garantiesFinancieresFileRef.filename
              )}
              download={true}
              {...dataId('gfList-item-download-link')}
            >
              <FileDownloadIcon className="align-middle mr-1" />
              Déposées le {formatDate(project.garantiesFinancieresSubmittedOn)}
            </a>
          )}
          {project.gf?.status === 'validé' && (
            <Badge className="bg-green-700 inline-block mt-1">validé</Badge>
          )}
          {project.gf?.status !== 'validé' && (
            <Badge className="bg-yellow-500 inline-block mt-1">à traiter</Badge>
          )}
        </div>
      )}
      {GFPastDue && (
        <a
          href={routes.TELECHARGER_MODELE_MISE_EN_DEMEURE({
            id: project.id,
            nomProjet: project.nomProjet,
          })}
          download
        >
          Télécharger le modèle de mise de demeure
        </a>
      )}
    </div>
  )
}

const ColumnComponent: Record<string, ColumnRenderer> = {
  Classé: function ClasséColumn({ project }) {
    if (project.abandonedOn) {
      return (
        <td
          valign="top"
          className={'projectList-classe-column notification warning'}
          style={{ position: 'relative' }}
        >
          <div {...dataId('projectList-item-classe')}>Abandonné</div>
        </td>
      )
    }

    if (project.classe === 'Eliminé') {
      return (
        <td
          valign="top"
          className={'projectList-classe-column notification error'}
          style={{ position: 'relative' }}
        >
          <div {...dataId('projectList-item-classe')}>
            {project.motifsElimination ? (
              <a
                href="#"
                {...dataId('projectList-item-toggleMotifsElimination')}
                style={{
                  textDecoration: 'none',
                  color: 'var(--theme-dark-text)',
                  whiteSpace: 'nowrap',
                }}
              >
                Eliminé
                <svg
                  className="icon icon-mail"
                  style={{
                    width: 10,
                    verticalAlign: 'bottom',
                    marginLeft: 5,
                  }}
                >
                  <use xlinkHref="#expand"></use>
                </svg>
              </a>
            ) : (
              'Eliminé'
            )}
          </div>

          <div
            style={{
              fontStyle: 'italic',
              lineHeight: 'normal',
              fontSize: 12,
              display: 'none',
            }}
            className="motif-popover"
            {...dataId('projectList-item-motifsElimination')}
          >
            {project.motifsElimination || ''}
          </div>
        </td>
      )
    }

    return (
      <td
        valign="top"
        className={'projectList-classe-column notification success'}
        style={{ position: 'relative' }}
      >
        <div {...dataId('projectList-item-classe')}>Classé</div>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 5,
            fontSize: 12,
            color: 'var(--green)',
          }}
        >
          {project.isFinancementParticipatif
            ? 'FP'
            : project.isInvestissementParticipatif
            ? 'IP'
            : project.actionnariat === 'financement-collectif'
            ? 'FC'
            : project.actionnariat === 'gouvernance-partagee'
            ? 'GP'
            : ''}
        </div>
      </td>
    )
  } as ColumnRenderer,
}

interface Props {
  projects: PaginatedList<Project> | Array<Project>
  displayGF?: true
  role: UserRole
  GFPastDue?: boolean
}

const Currency = ({ children }: { children: ReactNode }) => (
  <span
    style={{
      fontStyle: 'italic',
      lineHeight: 'normal',
      fontSize: 12,
    }}
  >
    {children}
  </span>
)

const Badge = ({
  children,
  className,
  ...props
}: { children: ReactNode } & ComponentProps<'span'>) => {
  return (
    <span
      className={`px-2 bg-blue-france-sun-base text-white rounded-md ${className ?? ''}`}
      {...props}
    >
      {children}
    </span>
  )
}

const StatutBadge = ({ project, className }: { project: Project; className: string }) => {
  if (project.abandonedOn) {
    return <Badge className={`bg-warning ${className}`}>Abandonné</Badge>
  }

  if (project.classe === 'Eliminé') {
    return (
      <Badge className={`bg-error ${className}`}>
        Eliminé
        <div
          style={{
            fontStyle: 'italic',
            lineHeight: 'normal',
            fontSize: 12,
            display: 'none',
          }}
          className="motif-popover"
          {...dataId('projectList-item-motifsElimination')}
        >
          {project.motifsElimination || ''}
        </div>
      </Badge>
    )
  }

  return (
    <Badge className={`bg-success ${className}`}>
      Classé{' '}
      {project.isFinancementParticipatif
        ? 'FP'
        : project.isInvestissementParticipatif
        ? 'IP'
        : project.actionnariat === 'financement-collectif'
        ? 'FC'
        : project.actionnariat === 'gouvernance-partagee'
        ? 'GP'
        : ''}
    </Badge>
  )
}

export const ProjectList = ({ projects, displayGF, role, GFPastDue }: Props) => {
  let items: Array<Project>
  if (Array.isArray(projects)) {
    items = projects
  } else {
    items = projects.items
  }

  if (!items.length) {
    return (
      <table className="table">
        <tbody>
          <tr>
            <td>Aucun projet à lister</td>
          </tr>
        </tbody>
      </table>
    )
  }

  return (
    <>
      {items.map((project) => {
        return (
          <Tile
            className="mb-4 flex flex-col"
            key={'project_' + project.id}
            {...dataId('projectList-item')}
          >
            <div className="mb-4" {...dataId('projectList-item-nomProjet')}>
              <a href={routes.PROJECT_DETAILS(project.id)}>{project.nomProjet}</a>{' '}
              <StatutBadge project={project} className="ml-2" />
            </div>
            <div className="flex flex-row justify-between gap-4 items-center">
              <div className="flex-1">
                <div
                  style={{
                    fontStyle: 'italic',
                    lineHeight: 'normal',
                    fontSize: 12,
                  }}
                >
                  <span {...dataId('projectList-item-communeProjet')}>{project.communeProjet}</span>
                  ,{' '}
                  <span {...dataId('projectList-item-departementProjet')}>
                    {project.departementProjet}
                  </span>
                  , <span {...dataId('projectList-item-regionProjet')}>{project.regionProjet}</span>
                  <div style={{ marginTop: 5, fontStyle: 'normal' }}>
                    {project.potentielIdentifier}
                  </div>
                </div>

                <div className="mt-2">
                  <div {...dataId('projectList-item-nomCandidat')}>{project.nomCandidat}</div>
                  <div
                    style={{
                      fontStyle: 'italic',
                      lineHeight: 'normal',
                      fontSize: 12,
                    }}
                  >
                    <span {...dataId('projectList-item-nomRepresentantLegal')}>
                      {project.nomRepresentantLegal}
                    </span>{' '}
                    <span {...dataId('projectList-item-email')}>{project.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-center flex-1 justify-between mr-4">
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="text-grey-425-base flex flex-row items-center">
                    <PowerIcon />
                  </div>
                  <div>
                    <span {...dataId('projectList-item-puissance')}>{project.puissance}</span>{' '}
                    <Currency>{project.appelOffre?.unitePuissance}</Currency>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="text-grey-425-base flex flex-row items-center">
                    <EuroIcon />
                  </div>
                  <div>
                    <span {...dataId('projectList-item-prixReference')}>
                      {project.prixReference}
                    </span>{' '}
                    <Currency>€/MWh</Currency>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="text-grey-425-base flex flex-row items-center">
                    <CloudIcon />
                  </div>
                  <div>
                    {project.evaluationCarbone > 0 ? (
                      <>
                        <span {...dataId('projectList-item-evaluationCarbone')}>
                          {project.evaluationCarbone}
                        </span>{' '}
                        <Currency>kg eq CO2/kWc</Currency>
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
              {displayGF && (
                <div className="flex-1 text-right">
                  <GF project={project} GFPastDue={GFPastDue} />
                </div>
              )}
            </div>
            <div className="flex flex-row gap-4 items-center mt-2">
              <SecondaryButton className="ml-auto">Voir</SecondaryButton>
              {ACTION_BY_ROLE[role] ? (
                <div {...dataId('item-actions-container')}>
                  <ProjectActions
                    role={role}
                    project={{
                      ...project,
                      isClasse: project.classe === 'Classé',
                      isAbandoned: project.abandonedOn !== 0,
                      notifiedOn: project.notifiedOn ? new Date(project.notifiedOn) : undefined,
                    }}
                  />
                </div>
              ) : (
                ''
              )}
            </div>
          </Tile>
        )
      })}
      {!Array.isArray(projects) ? (
        <PaginationPanel
          pagination={projects.pagination}
          pageCount={projects.pageCount}
          itemTitle="Projets"
        />
      ) : (
        ''
      )}
    </>
  )
}
