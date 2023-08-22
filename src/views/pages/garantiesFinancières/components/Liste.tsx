import React from 'react';
import { GarantiesFinancièresListItem } from '../../../../modules/project';
import routes from '../../../../routes';
import { PaginatedList } from '../../../../modules/pagination';
import { afficherDate } from '../../../helpers';
import {
  Badge,
  SecondaryLinkButton,
  ExcelFileIcon,
  Tile,
  MapPinIcon,
  BuildingHouseIcon,
  UserIcon,
  Pagination,
  DownloadLink,
  Link,
} from '../../../components';

type Props = {
  className?: string;
  projects: PaginatedList<GarantiesFinancièresListItem>;
  GFPastDue?: boolean;
  currentUrl: string;
  exportListe?: {
    title: string;
    url: string;
  };
};

export const Liste = ({ className = '', projects, GFPastDue, currentUrl, exportListe }: Props) => {
  return (
    <div className={className}>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-2">
        {exportListe && (
          <SecondaryLinkButton
            className="inline-flex order-1 md:order-2 items-center w-fit mt-0 umami--click--telecharger-un-export-projets"
            href={exportListe.url}
            download
          >
            <ExcelFileIcon className="mr-2" />
            {exportListe.title}
          </SecondaryLinkButton>
        )}
      </div>

      <ul className="p-0 m-0">
        {projects.items.map((project) => (
          <li className="list-none p-0 m-0" key={project.id}>
            <Tile className="mb-4 flex md:relative flex-col" key={`project_${project.id}`}>
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex flex-col md:flex-row gap-2">
                  <Link href={routes.PROJECT_DETAILS(project.id)}>{project.nomProjet}</Link>
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
                  <GF project={project} GFPastDue={GFPastDue} />
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
    </div>
  );
};

const GF = ({
  project,
  GFPastDue,
}: {
  project: GarantiesFinancièresListItem;
  GFPastDue?: boolean;
}) => {
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
