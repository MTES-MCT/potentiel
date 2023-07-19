import React, { ReactNode } from 'react';

import { ProjectListItem } from '@modules/project';
import { UserRole } from '@modules/users';
import routes from '@routes';
import { PaginatedList } from '../../../../types';
import { Badge, DownloadLink, Link, Tile, PaginationPanel } from '@components';
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
  role: UserRole;
  GFPastDue?: boolean;
  displaySelection?: boolean;
};

export const GarantiesFinancieresList = ({ projects, role, GFPastDue }: Props) => {
  return (
    <>
      <ul className="p-0 m-0">
        {projects.items.map((project) => (
          <li className="list-none p-0 m-0" key={project.id}>
            <Tile className="mb-4 flex md:relative flex-col" key={'project_' + project.id}>
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex flex-col md:flex-row gap-2">
                  <Link href={routes.PROJECT_DETAILS(project.id)}>{project.nomProjet}</Link>
                  <StatutBadge project={project} role={role} />
                </div>
                <div className="italic text-xs text-grey-425-base">
                  {project.potentielIdentifier}
                </div>
              </div>
            </Tile>
          </li>
        ))}
      </ul>
      {!Array.isArray(projects) && (
        <PaginationPanel
          nombreDePage={projects.pageCount}
          pagination={{
            limiteParPage: projects.pagination.pageSize,
            page: projects.pagination.page,
          }}
          titreItems="Projets"
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
