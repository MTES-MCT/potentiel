import { PaginationPanel, ProjectActions } from '@components'
import { Project } from '@entities'
import { UserRole } from '@modules/users'
import routes from '@routes'
import React, { ReactNode } from 'react'
import { formatDate } from '../../helpers/formatDate'
import { dataId } from '../../helpers/testId'
import { PaginatedList } from '../../types'
import { Badge, SecondaryButton, Tile } from './UI'
import {
  PowerIcon,
  EuroIcon,
  CloudIcon,
  FileDownloadIcon,
  MapPinIcon,
  BuildingHouseIcon,
  UserIcon,
} from './UI/atoms/icons'

const GF = ({ project, GFPastDue }: { project: Project; GFPastDue?: boolean }) => {
  return (
    <div>
      <div className="text-gray-500 mb-1">Garanties Financières</div>
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
            <Badge type="success" className="inline-block mt-1">
              validé
            </Badge>
          )}
          {project.gf?.status !== 'validé' && (
            <Badge type="warning" className="inline-block mt-1">
              à traiter
            </Badge>
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

interface Props {
  projects: PaginatedList<Project> | Array<Project>
  displayGF?: true
  role: UserRole
  GFPastDue?: boolean
}

const Unit = ({ children }: { children: ReactNode }) => (
  <span className="italic text-sm">{children}</span>
)

const StatutBadge = ({ project, className }: { project: Project; className: string }) => {
  if (project.abandonedOn) {
    return (
      <Badge type="warning" className={className}>
        Abandonné
      </Badge>
    )
  }

  if (project.classe === 'Eliminé') {
    return (
      <Badge type="error" className={className}>
        Eliminé
      </Badge>
    )
  }

  const type = project.isFinancementParticipatif
    ? 'FP'
    : project.isInvestissementParticipatif
    ? 'IP'
    : project.actionnariat === 'financement-collectif'
    ? 'FC'
    : project.actionnariat === 'gouvernance-partagee'
    ? 'GP'
    : ''

  return (
    <Badge type="success" className={className}>
      Classé {type ? `(${type})` : ''}
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
          <Tile className="mb-4 flex flex-col" key={'project_' + project.id}>
            <div>
              <a href={routes.PROJECT_DETAILS(project.id)}>{project.nomProjet}</a>{' '}
              <StatutBadge project={project} className="ml-2" />
            </div>
            <div className="mb-4 mt-1 italic text-xs text-grey">{project.potentielIdentifier}</div>
            <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
              <div className="flex-1 text-sm">
                <div className="mt-1 flex italic small items-center">
                  <MapPinIcon className="mr-2" />
                  {project.communeProjet}, {project.departementProjet}, {project.regionProjet}
                </div>

                <div className="mt-1 flex items-center">
                  <BuildingHouseIcon className="mr-2" />
                  {project.nomCandidat}
                </div>
                <div className="mt-1 flex items-center">
                  <UserIcon className="mr-2" />
                  {project.nomRepresentantLegal} {project.email}
                </div>
              </div>

              <div className="flex flex-row items-center flex-1 justify-between mr-4">
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="text-yellow-moutarde-850-base flex flex-row items-center">
                    <PowerIcon />
                  </div>
                  <div>
                    {project.puissance} <Unit>{project.appelOffre?.unitePuissance}</Unit>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="text-orange-terre-battue-main-645-base flex flex-row items-center">
                    <EuroIcon />
                  </div>
                  <div>
                    {project.prixReference} <Unit>€/MWh</Unit>
                  </div>
                </div>
                {project.evaluationCarbone > 0 && (
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="text-grey-425-active flex flex-row items-center">
                      <CloudIcon />
                    </div>
                    <div>
                      {project.evaluationCarbone}
                      <Unit>kg eq CO2/kWc</Unit>
                    </div>
                  </div>
                )}
              </div>
              {displayGF && (
                <div className="flex-1 text-right">
                  <GF project={project} GFPastDue={GFPastDue} />
                </div>
              )}
            </div>
            <div className="flex flex-row items-center mt-2">
              <a className="ml-auto block no-underline" href={routes.PROJECT_DETAILS(project.id)}>
                <SecondaryButton>Voir</SecondaryButton>
              </a>
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
          </Tile>
        )
      })}
      {!Array.isArray(projects) && (
        <PaginationPanel
          pagination={projects.pagination}
          pageCount={projects.pageCount}
          itemTitle="Projets"
        />
      )}
    </>
  )
}
