import React from 'react';

import { ProjectListItem } from '@modules/project';
import { UserRole } from '@modules/users';
import routes from '@routes';
import { PaginatedList } from '../../../../types';
import {
  Badge,
  DownloadLink,
  Link,
  Tile,
  PaginationPanel,
  LinkButton,
} from '@components';
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

export const GarantiesFinancieresList = ({ projects, GFPastDue }: Props) => {
  return (
    <>
      <ul className="p-0 m-0">
        {projects.items.map(({ id, potentielIdentifier, nomProjet, garantiesFinancières }) => (
          <li className="list-none p-0 m-0" key={id}>
            <Tile
              className="mb-4 flex md:relative flex-row justify-between gap-8 items-center"
              key={'project_' + id}
            >
              <div className="flex-grow">
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
                          télécharger l'attestation déposée le{' '}
                          {afficherDate(new Date(garantiesFinancières.dateEnvoi))}
                        </DownloadLink>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div>
                {GFPastDue && (
                  <DownloadLink
                    className="text-sm"
                    fileUrl={routes.TELECHARGER_MODELE_MISE_EN_DEMEURE({
                      id,
                      nomProjet,
                    })}
                    aria-label={`Télécharger un modèle de mise en demeure pour le projet ${nomProjet}`}
                  >
                    Télécharger le modèle de mise de demeure
                  </DownloadLink>
                )}
                {garantiesFinancières?.statut === 'à traiter' && (
                  <div className="flex flex-row gap-4">
                    <LinkButton
                      href={routes.VALIDER_GF({
                        projetId: id,
                      })}
                    >
                      Valider
                    </LinkButton>
                    <LinkButton
                      href={routes.INVALIDER_GF({
                        projetId: id,
                      })}
                    >
                      Rejeter
                    </LinkButton>
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
