import React, { ReactNode } from 'react';
import { ProjectListItem } from '@modules/project';
import { UserRole } from '@modules/users';
import routes from '@routes';
import { PaginatedList } from '@modules/pagination';
import {
  ProjectActions,
  PowerIcon,
  EuroIcon,
  CloudIcon,
  MapPinIcon,
  BuildingHouseIcon,
  UserIcon,
  Badge,
  DownloadLink,
  Link,
  LinkButton,
  Tile,
  Pagination,
  Checkbox,
} from '@components';
import { afficherDate } from '@views/helpers';

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
      Classé {getFinancementType(project) && `(${getFinancementType(project)})`}
    </Badge>
  );
};

type Props = {
  projects: PaginatedList<ProjectListItem>;
  displayGF?: true;
  role: UserRole;
  GFPastDue?: boolean;
  displaySelection?: boolean;
  selectedIds?: string[];
  onSelectedIdsChanged?: (projectIds: string[]) => void;
  currentUrl: string;
};

export const ProjectList = ({
  projects,
  displayGF,
  role,
  GFPastDue,
  selectedIds = [],
  displaySelection = false,
  onSelectedIdsChanged,
  currentUrl,
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
    <>
      <div className="flex flex-col md:flex-row gap-2 text-sm italic mt-4 mb-2" aria-hidden>
        Légende :
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
        {displayGF && (
          <div className="flex items-center">
            <div
              className="flex text-grey-200-base font-bold text-sm mr-1"
              aria-label="Garanties Financières"
            >
              GF
            </div>
            Garanties Financières
          </div>
        )}
        {évaluationCarboneDisponible && !displayGF && (
          <div className="flex items-center">
            <CloudIcon
              className="text-grey-425-active mr-1 shrink-0"
              aria-label="Évaluation carbone"
            />
            Évaluation carbone
          </div>
        )}
      </div>

      {displaySelection && (
        <div className="p-5 flex items-center">
          <Checkbox
            id="allProjects"
            onChange={(e) => toggleSelectAllPage(e.target.checked)}
            checked={selectedIds.length === projects.items.length}
          />
          <span className="text-sm">
            Séléctioner tous les projets de la page ({projects.items.length})
          </span>
        </div>
      )}

      <ul className="p-0 m-0">
        {projects.items.map((project) => (
          <li className="list-none p-0 m-0" key={project.id}>
            <Tile className="mb-4 flex md:relative flex-col" key={'project_' + project.id}>
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
                    <BuildingHouseIcon className="mr-2 shrink-0" title="Nom du candidat" />
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
                      {project.puissance} <Unit>{project.appelOffre?.unitePuissance}</Unit>
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

                  {displayGF ? (
                    <GF project={project} GFPastDue={GFPastDue} />
                  ) : (
                    project.evaluationCarbone !== undefined && (
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
                    )
                  )}
                </div>

                <div className="flex md:absolute md:top-4 md:right-5 gap-2">
                  {project && role && (
                    <ProjectActions
                      role={role}
                      project={{
                        ...project,
                        isClasse: project.classe === 'Classé',
                        isAbandoned: project.abandonedOn !== 0,
                        isLegacy: project.appelOffre?.periode.type === 'legacy',
                        notifiedOn: project.notifiedOn ? new Date(project.notifiedOn) : undefined,
                      }}
                    />
                  )}
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
        ))}
      </ul>
      {!Array.isArray(projects) && (
        <Pagination
          pageCount={projects.pageCount}
          currentPage={projects.pagination.page}
          currentUrl={currentUrl}
        />
      )}
    </>
  );
};

const GF = ({ project, GFPastDue }: { project: ProjectListItem; GFPastDue?: boolean }) => {
  const gf = project.garantiesFinancières;
  return (
    <div className="flex lg:flex-1 lg:flex-col gap-1 mt-1 md:items-center">
      <div
        className="flex text-grey-200-base font-bold text-sm pt-0.5"
        title="Garanties financières"
      >
        GF
      </div>
      {!gf?.dateEnvoi && !GFPastDue && <div className="flex">Non Déposées</div>}

      {gf?.dateEnvoi && (
        <div className="flex flex-col md:flex-row lg:flex-col items-center gap-1">
          {gf.statut === 'validé' ? (
            <Badge className="lg:self-center" type="success">
              validé
            </Badge>
          ) : (
            <Badge className="lg:self-center" type="warning">
              à traiter
            </Badge>
          )}
          {gf.fichier && (
            <DownloadLink
              className="flex text-sm items-center"
              fileUrl={routes.DOWNLOAD_PROJECT_FILE(gf.fichier.id, gf.fichier.filename)}
              aria-label={`Télécharger les garanties financières du projet ${
                project.nomProjet
              } déposées le ${afficherDate(new Date(gf.dateEnvoi))}`}
            >
              Déposées le <br />
              {afficherDate(new Date(gf.dateEnvoi))}
            </DownloadLink>
          )}
        </div>
      )}

      {GFPastDue && (
        <DownloadLink
          className="text-sm"
          fileUrl={routes.TELECHARGER_MODELE_MISE_EN_DEMEURE({
            id: project.id,
            nomProjet: project.nomProjet,
          })}
          aria-label={`Télécharger un modèle de mise en demeure pour le projet ${project.nomProjet}`}
        >
          Télécharger le modèle de mise de demeure
        </DownloadLink>
      )}
    </div>
  );
};
