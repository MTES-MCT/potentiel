import React from 'react'
import { logger } from '../../core/utils'
import { Project, User } from '../../entities'
import { dataId } from '../../helpers/testId'
import routes from '../../routes'
import { PaginatedList } from '../../types'
import { ACTION_BY_ROLE } from './actions'
import Pagination from './pagination'

type Columns =
  | 'Projet'
  | 'Candidat'
  | 'Puissance'
  | 'Region'
  | 'N° CRE'
  | 'Projet pre-affecte'
  | 'Prix'
  | 'Attestation de designation'

type ColumnRenderer = (props: { project: Project; email: User['email'] }) => React.ReactNode

const ColumnComponent: Record<Columns, ColumnRenderer> = {
  Projet: function ProjetColumn({ project }) {
    return (
      <td valign="top" className="missingOwnerProjectList-projet-column">
        <div {...dataId('missingOwnerProjectList-item-nomProjet')}>{project.nomProjet}</div>
        <div
          style={{
            fontStyle: 'italic',
            lineHeight: 'normal',
            fontSize: 12,
          }}
        >
          <div>{project.departementProjet}</div>
          <div>{project.nomCandidat}</div>
          <div>
            {project.appelOffreId} - {project.periodeId}
          </div>
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
  Region: function RegionColumn({ project }) {
    return (
      <td valign="top" className="projectList-puissance-column">
        <span {...dataId('projectList-item-region')}>{project.regionProjet}</span>{' '}
      </td>
    )
  } as ColumnRenderer,
  'Projet pre-affecte': function ProjectPreAffecteColumn({ project, email }) {
    return (
      <td valign="top" className="projectList-projet-pre-affecte-column">
        <span {...dataId('projectList-item-pre-affecte')}>
          {project.email === email ? 'Oui' : 'Non'}
        </span>
      </td>
    )
  } as ColumnRenderer,
  'N° CRE': function NumeroCREColumn({ project, email }) {
    return email === project.email ? (
      ''
    ) : (
      <td valign="top" className="projectList-numero-cre-column">
        <input
          type="text"
          name={`numeroCRE|${project.id}`}
          placeholder="N° CRE"
          style={{ minWidth: 110 }}
        />
      </td>
    )
  } as ColumnRenderer,
  Prix: function PrixColumn({ project, email }) {
    return email === project.email ? (
      ''
    ) : (
      <td valign="top" className="projectList-prix-column">
        <input
          type="number"
          step="any"
          name={`prix|${project.id}`}
          placeholder="0.00"
          style={{ minWidth: 110 }}
        />{' '}
        €/MWh
      </td>
    )
  } as ColumnRenderer,
  'Attestation de designation': function AttestationDesignationColumn({ project, email }) {
    return email === project.email ? (
      ''
    ) : (
      <td valign="top" className="projectList-attestation-designation-column">
        <span>
          <input
            type="file"
            name={`attestation-designation|${project.id}`}
            style={{ minWidth: 110 }}
          />
        </span>
      </td>
    )
  } as ColumnRenderer,
}

interface Props {
  projects: PaginatedList<Project> | Array<Project>
  displayColumns: Array<string>
  user: User
}

const MissingOwnerProjectList = ({ projects, displayColumns, user }: Props) => {
  const { role, email } = user

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
      <form
        action={routes.USER_CLAIM_PROJECTS}
        encType="multipart/form-data"
        style={{ maxWidth: '100%' }}
        method="post"
      >
        <table className="table missingOwnerProjectList">
          <thead>
            <tr>
              <th {...dataId('missingOwnerProjectList-checkbox')}>
                <input type="checkbox" {...dataId('missingOwnerProjectList-selectAll-checkbox')} />
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
                <tr key={'project_' + project.id} {...dataId('missingOwnerProjectList-item')}>
                  <td {...dataId('missingOwnerProjectList-checkbox')}>
                    <input
                      type="checkbox"
                      {...dataId('missingOwnerProjectList-item-checkbox')}
                      data-projectid={project.id}
                    />
                  </td>
                  {displayColumns?.map((column) => {
                    const Column = ColumnComponent[column]
                    if (!Column) {
                      logger.error(`Column ${column} could not be found`)
                      return <td></td>
                    }
                    return (
                      <Column
                        key={`project_${project.id}_${column}`}
                        project={project}
                        email={email}
                      />
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>

        <select
          name="projectIds"
          multiple
          {...dataId('claimed-project-list')}
          style={{ display: 'none' }}
        ></select>

        <div
          style={{
            marginTop: 30,
            marginBottom: 20,
          }}
        >
          <input
            type="checkbox"
            name="swornStatement"
            id="swornStatement"
            {...dataId('sworn-statement')}
          />
          <label
            style={{ verticalAlign: 'middle', display: 'inline-block' }}
            htmlFor="swornStatement"
            className="notification error"
          >
            J'atteste sur l'honneur que je suis bien la personne désignée pour suivre le/les
            projet(s) sélectionné(s). En cas de fausse déclaration, je m'expose à un risque de
            poursuites judiciaires.
          </label>
        </div>

        <button
          className="button"
          type="submit"
          name="submit"
          id="submit"
          disabled
          {...dataId('claim-projects-submit-button')}
        >
          Réclamer la propriété des projets sélectionnés
        </button>
      </form>

      {!Array.isArray(projects) && (
        <Pagination
          pagination={projects.pagination}
          pageCount={projects.pageCount}
          itemTitle="Projets"
        />
      )}
    </>
  )
}

export default MissingOwnerProjectList
