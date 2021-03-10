import React from 'react'
import { logger } from '../../core/utils'
import { makeProjectIdentifier, Project, User } from '../../entities'
import { formatDate } from '../../helpers/formatDate'
import { dataId } from '../../helpers/testId'
import { PaginatedList } from '../../types'
import { ACTION_BY_ROLE } from './actions'
import Pagination from './pagination'
import ProjectActions from './projectActions'
import ROUTES from '../../routes'
import { DownloadIcon } from './downloadIcon'

type Columns =
  | 'Projet'
  | 'Candidat'
  | 'Puissance'
  | 'Prix'
  | 'Evaluation Carbone'
  | 'Garanties Financières'
  | 'Classé'

type ColumnRenderer = (props: { project: Project }) => React.ReactNode

const ColumnComponent: Record<Columns, ColumnRenderer> = {
  Projet: function ProjetColumn({ project }) {
    return (
      <td valign="top" className="projectList-projet-column">
        <div {...dataId('projectList-item-nomProjet')}>{project.nomProjet}</div>
        <div
          style={{
            fontStyle: 'italic',
            lineHeight: 'normal',
            fontSize: 12,
          }}
        >
          <span {...dataId('projectList-item-communeProjet')}>{project.communeProjet}</span>,{' '}
          <span {...dataId('projectList-item-departementProjet')}>{project.departementProjet}</span>
          , <span {...dataId('projectList-item-regionProjet')}>{project.regionProjet}</span>
          <div style={{ marginTop: 5, fontStyle: 'normal' }}>{makeProjectIdentifier(project)}</div>
        </div>
      </td>
    )
  } as ColumnRenderer,
  Candidat: function CandidatColumn({ project }) {
    return (
      <td valign="top" className="projectList-candidat-column">
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
      </td>
    )
  } as ColumnRenderer,
  Puissance: function PuissanceColumn({ project }) {
    return (
      <td valign="top" className="projectList-puissance-column">
        <span {...dataId('projectList-item-puissance')}>{project.puissance}</span>{' '}
        <span
          style={{
            fontStyle: 'italic',
            lineHeight: 'normal',
            fontSize: 12,
          }}
        >
          {project.appelOffre?.unitePuissance}
        </span>
      </td>
    )
  } as ColumnRenderer,
  Prix: function PrixColumn({ project }) {
    return (
      <td valign="top" className="projectList-prix-column">
        <span {...dataId('projectList-item-prixReference')}>{project.prixReference}</span>{' '}
        <span
          style={{
            fontStyle: 'italic',
            lineHeight: 'normal',
            fontSize: 12,
          }}
        >
          €/MWh
        </span>
      </td>
    )
  } as ColumnRenderer,
  'Evaluation Carbone': function EvaluationCarboneColumn({ project }) {
    return (
      <td valign="top" className="projectList-evaluation-column">
        {project.evaluationCarbone > 0 ? (
          <>
            <span {...dataId('projectList-item-evaluationCarbone')}>
              {project.evaluationCarbone}
            </span>{' '}
            <span
              style={{
                fontStyle: 'italic',
                lineHeight: 'normal',
                fontSize: 12,
              }}
            >
              kg eq CO2/kWc
            </span>
          </>
        ) : (
          ''
        )}
      </td>
    )
  } as ColumnRenderer,
  'Garanties Financières': function GarantieFinanciereColumn({ project }) {
    return (
      <td valign="top">
        {project.garantiesFinancieresFileRef ? (
          <div>
            <div {...dataId('gfList-item-garanties-financieres')}>
              <a
                href={ROUTES.DOWNLOAD_PROJECT_FILE(
                  project.garantiesFinancieresFileRef.id,
                  project.garantiesFinancieresFileRef.filename
                )}
                download={true}
                {...dataId('gfList-item-download-link')}
              >
                <DownloadIcon />
                Déposées le {formatDate(project.garantiesFinancieresSubmittedOn)}
              </a>
            </div>
          </div>
        ) : (
          ''
        )}
      </td>
    )
  } as ColumnRenderer,
  Classé: function ClasséColumn({ project }) {
    return (
      <td
        valign="top"
        className={
          'projectList-classe-column notification ' +
          (project.classe === 'Classé' ? 'success' : 'error')
        }
        style={{ position: 'relative' }}
      >
        <div {...dataId('projectList-item-classe')}>
          {project.classe === 'Classé' || !project.motifsElimination ? (
            project.classe
          ) : (
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
          )}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 5,
            fontSize: 12,
            color: 'var(--green)',
          }}
        >
          {project.classe === 'Classé'
            ? project.isFinancementParticipatif
              ? 'FP'
              : project.isInvestissementParticipatif
              ? 'IP'
              : ''
            : ''}
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
  } as ColumnRenderer,
}

interface Props {
  projects: PaginatedList<Project> | Array<Project>
  displayColumns: Array<string>
  role: User['role']
}

const ProjectList = ({ projects, displayColumns, role }: Props) => {
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
      <table className="table projectList" {...dataId('projectList-list')}>
        <thead>
          <tr>
            <th {...dataId('projectList-checkbox')} style={{ display: 'none' }}>
              <input type="checkbox" {...dataId('projectList-selectAll-checkbox')} />
            </th>
            {displayColumns?.map((column) => (
              <th key={column}>{column}</th>
            ))}
            {ACTION_BY_ROLE[role] ? <th></th> : ''}
          </tr>
        </thead>
        <tbody>
          {items.map((project) => {
            return (
              <tr
                key={'project_' + project.id}
                {...dataId('projectList-item')}
                style={{ cursor: 'pointer' }}
                data-goto-projectid={project.id}
              >
                <td {...dataId('projectList-checkbox')} style={{ display: 'none' }}>
                  <input
                    type="checkbox"
                    {...dataId('projectList-item-checkbox')}
                    data-projectid={project.id}
                  />
                </td>
                {displayColumns?.map((column) => {
                  const Column = ColumnComponent[column]
                  if (!Column) {
                    logger.error(`Column ${column} could not be found`)
                    return <td></td>
                  }
                  return <Column key={'project_' + project.id + '_' + column} project={project} />
                })}
                {ACTION_BY_ROLE[role] ? (
                  <td {...dataId('item-actions-container')}>
                    <ProjectActions
                      role={role}
                      project={{
                        ...project,
                        isClasse: project.classe === 'Classé',
                        notifiedOn: project.notifiedOn ? new Date(project.notifiedOn) : undefined,
                      }}
                    />
                  </td>
                ) : (
                  ''
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
      {!Array.isArray(projects) ? (
        <Pagination
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

export default ProjectList
