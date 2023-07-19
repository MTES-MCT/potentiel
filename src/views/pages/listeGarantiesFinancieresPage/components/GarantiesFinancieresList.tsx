import React from 'react';

import { ProjectListItem } from '@modules/project';
import { UserRole } from '@modules/users';
import routes from '@routes';
import { PaginatedList } from '../../../../types';
import { Badge, DownloadLink, Link, Tile, PaginationPanel } from '@components';
import { afficherDate } from '@views/helpers';

const getStatutBadge = (statut?: 'en attente' | 'à traiter' | 'validé') => {
  if (!statut) {
    return null;
  }

  switch (statut) {
    case 'en attente':
      return <Badge type="warning">En attente</Badge>;
    case 'à traiter':
      return <Badge type="error">À traiter</Badge>;
    case 'validé':
      return <Badge type="success">Validé</Badge>;
    default:
      return null;
  }
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
        {projects.items.map(({ id, potentielIdentifier, nomProjet, garantiesFinancières }) => (
          <li className="list-none p-0 m-0" key={id}>
            <Tile className="mb-4 flex md:relative flex-col" key={'project_' + id}>
              <div className="flex flex-row justify-between">
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex flex-col md:flex-row gap-2">
                    <Link href={routes.PROJECT_DETAILS(id)}>{nomProjet}</Link>
                  </div>
                  <div className="italic text-xs text-grey-425-base">{potentielIdentifier}</div>
                </div>
                {garantiesFinancières?.statut && (
                  <div>{getStatutBadge(garantiesFinancières?.statut)}</div>
                )}
              </div>
              <div className="flex flex-row justify-between">
                {(garantiesFinancières?.type || garantiesFinancières?.dateEchéance) && (
                  <div className="flex flex-col">
                    {garantiesFinancières?.type && <div>type : {garantiesFinancières?.type}</div>}
                    {garantiesFinancières?.dateEchéance && (
                      <div>
                        date d'écheance :{' '}
                        {afficherDate(new Date(garantiesFinancières?.dateEchéance))}
                      </div>
                    )}
                  </div>
                )}
                {(garantiesFinancières?.dateConstitution ||
                  (garantiesFinancières?.fichier && garantiesFinancières.dateEnvoi)) && (
                  <div className="flex flex-col">
                    {garantiesFinancières?.dateConstitution && (
                      <div>
                        date de constitution :{' '}
                        {afficherDate(new Date(garantiesFinancières?.dateConstitution))}
                      </div>
                    )}
                    {garantiesFinancières?.fichier && garantiesFinancières.dateEnvoi && (
                      <DownloadLink
                        className="flex text-sm items-center"
                        fileUrl={routes.DOWNLOAD_PROJECT_FILE(
                          garantiesFinancières.fichier.id,
                          garantiesFinancières.fichier.filename,
                        )}
                        aria-label={`Télécharger les garanties financières du projet ${nomProjet} déposées le ${afficherDate(
                          new Date(garantiesFinancières.dateEnvoi),
                        )}`}
                      >
                        Déposées le <br />
                        {afficherDate(new Date(garantiesFinancières.dateEnvoi))}
                      </DownloadLink>
                    )}
                  </div>
                )}
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
