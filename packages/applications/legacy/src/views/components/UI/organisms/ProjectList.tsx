import React, { ReactNode } from 'react';
import { ProjectListItem } from '../../../../modules/project';
import { UserRole } from '../../../../modules/users';
import routes from '../../../../routes';
import { PaginatedList } from '../../../../modules/pagination';
import {
  PowerIcon,
  EuroIcon,
  CloudIcon,
  MapPinIcon,
  BuildingHouseIcon,
  UserIcon,
  Badge,
  Link,
  LinkButton,
  Tile,
  Pagination,
  Checkbox,
  SecondaryLinkButton,
  ExcelFileIcon,
} from '../..';

const Unit = ({ children }: { children: ReactNode }) => (
  <span className="italic text-sm">{children}</span>
);

const StatutBadge = ({ project }: { project: ProjectListItem; role: UserRole }) => {
  if (project.abandonedOn) {
    return <Badge type="warning">Abandonné</Badge>;
  }

  if (project.classe === 'Eliminé') {
    return <Badge type="error">Eliminé</Badge>;
  }

  const getFinancementType = (project: ProjectListItem) => {
    if (project.isFinancementParticipatif) return 'FP';
    if (project.isInvestissementParticipatif) return 'IP';
    if (project.actionnariat === 'financement-collectif') return 'FC';
    if (project.actionnariat === 'gouvernance-partagee') return 'GP';

    return null;
  };

  return (
    <Badge type="success">
      Actif {getFinancementType(project) && `(${getFinancementType(project)})`}
    </Badge>
  );
};

type Props = {
  className?: string;
  projects: PaginatedList<ProjectListItem>;
  role: UserRole;
  displaySelection?: boolean;
  selectedIds?: string[];
  onSelectedIdsChanged?: (projectIds: string[]) => void;
  currentUrl: string;
  exportListe?: {
    title: string;
    url: string;
  };
};

export const ProjectList = ({
  className = '',
  projects,
  role,
  selectedIds = [],
  displaySelection = false,
  onSelectedIdsChanged,
  currentUrl,
  exportListe,
}: Props) => {
  const prixDisponible = projects.items.some((project) => project.prixReference);

  const évaluationCarboneDisponible = projects.items.some((project) => project.evaluationCarbone);

  const toggleSelected = (projectId: string, value: boolean) => {
    const newSelectedIds = selectedIds.slice();
    if (value) {
      newSelectedIds.push(projectId);
    } else {
      const index = newSelectedIds.indexOf(projectId);
      newSelectedIds.splice(index, 1);
    }
    onSelectedIdsChanged?.(newSelectedIds);
  };

  const toggleSelectAllPage = (value: boolean) => {
    if (value) {
      onSelectedIdsChanged?.(projects.items.map((projet) => projet.id));
    } else {
      onSelectedIdsChanged?.([]);
    }
  };

  return (
    <div className={className}>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-2">
        <div className="order-2 md:order-1 mt-4 mb-2 gap-2 text-sm italic md:my-0">
          <span className="underline">Légende</span>
          <div className="flex gap-2">
            <div className="flex items-center">
              <PowerIcon
                className="text-yellow-moutarde-850-base mr-1 shrink-0"
                aria-label="Puissance"
              />{' '}
              Puissance
            </div>
            {prixDisponible && (
              <div className="flex items-center">
                <EuroIcon
                  className="text-orange-terre-battue-main-645-base mr-1 shrink-0"
                  aria-label="Prix de référence"
                />{' '}
                Prix de référence
              </div>
            )}
            {évaluationCarboneDisponible && (
              <div className="flex items-center">
                <CloudIcon
                  className="text-grey-425-active mr-1 shrink-0"
                  aria-label="Évaluation carbone"
                />
                Évaluation carbone
              </div>
            )}
          </div>
        </div>
        {exportListe && (
          <SecondaryLinkButton
            className="inline-flex order-1 md:order-2 items-center w-fit mt-0"
            href={exportListe.url}
            download
          >
            <ExcelFileIcon className="mr-2" />
            {exportListe.title}
          </SecondaryLinkButton>
        )}
      </div>

      {displaySelection && (
        <div className="px-5 pt-5 pb-2 flex items-center">
          <>
            <Checkbox
              id="allProjects"
              onChange={(e) => toggleSelectAllPage(e.target.checked)}
              checked={selectedIds.length === projects.items.length}
            >
              <span className="text-sm">
                Sélectionner tous les projets de la page ({projects.items.length})
              </span>
            </Checkbox>
          </>
        </div>
      )}

      <ul className="p-0 m-0">
        {projects.items.map((project) => {
          return (
            <li className="list-none p-0 m-0" key={project.id}>
              <Tile className="mb-4 flex md:relative flex-col" key={`project_${project.id}`}>
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex flex-col md:flex-row gap-2">
                    {displaySelection && (
                      <Checkbox
                        id={project.id}
                        onChange={(e) => toggleSelected(project.id, e.target.checked)}
                        value={project.id}
                        checked={selectedIds.indexOf(project.id) > -1}
                      />
                    )}
                    <Link href={routes.PROJECT_DETAILS(project.id)}>{project.nomProjet}</Link>
                    <StatutBadge project={project} role={role} />
                  </div>
                  <div className="italic text-xs text-grey-425-base">
                    {project.potentielIdentifier}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                  <div className="flex md:flex-1 flex-col gap-1 text-sm">
                    <div className="flex items-center">
                      <MapPinIcon className="mr-2 shrink-0" title="Localisation du projet" />
                      <span className="italic">
                        {project.communeProjet}, {project.departementProjet}, {project.regionProjet}
                      </span>
                    </div>

                    <div className="flex  items-center">
                      <BuildingHouseIcon className="mr-2 shrink-0" title="Nom du producteur" />
                      {project.nomCandidat}
                    </div>
                    <div className="flex items-center">
                      <UserIcon className="mr-2 shrink-0" title="Représentant légal" />
                      <div className="flex flex-col overflow-hidden">
                        <div>{project.nomRepresentantLegal}</div>
                        <div className="truncate" title={project.email}>
                          {project.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-1 lg:flex flex-col lg:flex-row lg:gap-4">
                    <div className="flex lg:flex-1 lg:flex-col items-center gap-2">
                      <PowerIcon className="text-yellow-moutarde-850-base" title="Puissance" />
                      <div className="lg:flex lg:flex-col items-center">
                        {project.puissance} <Unit>{project.unitéPuissance}</Unit>
                      </div>
                    </div>
                    {project.prixReference && (
                      <div className="flex lg:flex-1 lg:flex-col items-center gap-2">
                        <EuroIcon
                          className="text-orange-terre-battue-main-645-base"
                          title="Prix de référence"
                        />
                        <div className="lg:flex lg:flex-col items-center">
                          {project.prixReference} <Unit>€/MWh</Unit>
                        </div>
                      </div>
                    )}

                    {project.evaluationCarbone !== undefined && (
                      <div className="flex lg:flex-1 lg:flex-col items-center gap-2 lg:grow">
                        <CloudIcon className="text-grey-425-active" title="Évaluation carbone" />
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
                    )}
                  </div>

                  <div className="flex md:absolute md:top-4 md:right-5 gap-2">
                    <LinkButton
                      href={routes.PROJECT_DETAILS(project.id)}
                      aria-label={`voir le projet ${project.nomProjet}`}
                    >
                      Voir
                    </LinkButton>
                  </div>
                </div>
              </Tile>
            </li>
          );
        })}
      </ul>
      {!Array.isArray(projects) && (
        <Pagination
          pageCount={projects.pageCount}
          currentPage={projects.pagination.page}
          currentUrl={currentUrl}
        />
      )}
    </div>
  );
};
