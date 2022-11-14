import { PaginationPanel, ProjectActions } from '@components'
import { Project } from '@entities'
import { UserRole } from '@modules/users'
import routes from '@routes'
import React, { ReactNode } from 'react'
import { formatDate } from '../../helpers/formatDate'
import { dataId } from '../../helpers/testId'
import { PaginatedList } from '../../types'
import { Badge, Link, SecondaryLinkButton, Tile } from './UI'
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

type Props = {
  projects: PaginatedList<Project> | Array<Project>
  displayGF?: true
  role: UserRole
  GFPastDue?: boolean
}

const Unit = ({ children }: { children: ReactNode }) => (
  <span className="italic text-sm">{children}</span>
)

const StatutBadge = ({ project }: { project: Project }) => {
  if (project.abandonedOn) {
    return <Badge type="warning">Abandonné</Badge>
  }

  if (project.classe === 'Eliminé') {
    return <Badge type="error">Eliminé</Badge>
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

  return <Badge type="success">Classé {type ? `(${type})` : ''}</Badge>
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
            <div className="flex flex-col gap-2 mb-4">
              <Link href={routes.PROJECT_DETAILS(project.id)}>{project.nomProjet}</Link>
              <StatutBadge project={project} />
              <div className="italic text-xs text-grey">{project.potentielIdentifier}</div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <div className="flex md:flex-1 flex-col gap-1 text-sm">
                <div className="flex items-center">
                  <MapPinIcon className="mr-2 shrink-0" />
                  <span className="italic">
                    {project.communeProjet}, {project.departementProjet}, {project.regionProjet}
                  </span>
                </div>

                <div className="flex  items-center">
                  <BuildingHouseIcon className="mr-2 shrink-0" />
                  {project.nomCandidat}
                </div>
                <div className="flex items-center">
                  <UserIcon className="mr-2 shrink-0" />
                  <div className="flex flex-col">
                    <div>{project.nomRepresentantLegal}</div>
                    <div>{project.email}</div>
                  </div>
                </div>
              </div>

              <div className="flex md:flex-1 lg:flex flex-col lg:flex-row lg:gap-4">
                <div className="flex lg:flex-1 lg:flex-col items-center gap-2">
                  <PowerIcon className="text-yellow-moutarde-850-base" />
                  <div className="lg:flex lg:flex-col items-center">
                    {project.puissance} <Unit>{project.appelOffre?.unitePuissance}</Unit>
                  </div>
                </div>

                <div className="flex lg:flex-1 lg:flex-col items-center gap-2">
                  <EuroIcon className="text-orange-terre-battue-main-645-base" />
                  <div className="lg:flex lg:flex-col items-center">
                    {project.prixReference} <Unit>€/MWh</Unit>
                  </div>
                </div>

                <div className="flex lg:flex-1 lg:flex-col items-center gap-2 lg:grow">
                  <CloudIcon className="text-grey-425-active" />
                  <div>
                    {project.evaluationCarbone > 0 ? (
                      <div className="lg:flex lg:flex-col items-center text-center">
                        {project.evaluationCarbone}
                        <Unit> kg eq CO2/kWc</Unit>
                      </div>
                    ) : (
                      '- - -'
                    )}
                  </div>
                </div>

                {displayGF && <GF project={project} GFPastDue={GFPastDue} />}
              </div>

              <div className="flex justify-end ml-6">
                <SecondaryLinkButton href={routes.PROJECT_DETAILS(project.id)}>
                  Voir
                </SecondaryLinkButton>
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
