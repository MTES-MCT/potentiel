import { Request } from 'express';
import React from 'react';

import {
  Badge,
  CalendarIcon,
  Heading1,
  Link,
  ListeVide,
  PageListeTemplate,
  Pagination,
  Tile,
} from '../../components';
import { afficherDate, hydrateOnClient } from '../../helpers';
import { UtilisateurReadModel } from '../../../modules/utilisateur/récupérer/UtilisateurReadModel';
import { ListResult } from '@potentiel/core-domain-views';
import routes from '../../../routes';
import { CandidatureLegacyReadModel } from '@potentiel/domain-views';

type ListeAbandonsProps = {
  abandons: ListResult<any & { projet?: CandidatureLegacyReadModel }>;
  currentUrl: string;
  request: Request;
};

export const ListeAbandons = ({ request, abandons, currentUrl }: ListeAbandonsProps) => {
  const utilisateur = request.user as UtilisateurReadModel;

  return (
    <PageListeTemplate
      user={utilisateur}
      currentPage={'liste-abandons'}
      contentHeader={
        <Heading1>
          Abandons avec recandidature {abandons.totalItems > 0 && `(${abandons.totalItems})`}
        </Heading1>
      }
    >
      <PageListeTemplate.List sideBarOpen={false}>
        {abandons.totalItems === 0 ? (
          <ListeVide titre="Aucun abandon avec recandidature à lister" />
        ) : (
          <>
            <ul className="flex flex-col p-0 m-0 gap-4">
              {abandons.items.map(({ identifiantProjet, statut, demandeDemandéLe, projet }) => (
                <li className="list-none p-0 m-0" key={`${identifiantProjet}`}>
                  <Tile className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col md:flex-row gap-2">
                        <div>
                          <span>Abandon du projet </span>
                          <span className="font-bold">{projet?.nom}</span>
                        </div>
                        <StatusBadge statut={statut} />
                      </div>
                      <div className="flex flex-row gap-1 text-sm italic items-center">
                        <CalendarIcon title="Date de la demande pour l'abandon du projet" />
                        {afficherDate(new Date(demandeDemandéLe))}
                      </div>
                    </div>
                    <div className="flex ml-auto">
                      <Link
                        href={routes.DEMANDE_PAGE_DETAILS(identifiantProjet)}
                        aria-label={`Voir le détail de la demande d'abandon pour le projet`}
                      >
                        Voir
                      </Link>
                    </div>
                  </Tile>
                </li>
              ))}
            </ul>
            <Pagination
              currentPage={abandons.currentPage}
              pageCount={Math.ceil(abandons.totalItems / abandons.itemsPerPage)}
              currentUrl={currentUrl}
            />
          </>
        )}
      </PageListeTemplate.List>
    </PageListeTemplate>
  );
};

const StatusBadge = ({ statut }: { statut: string }) => {
  switch (statut) {
    case 'rejeté':
      return <Badge type="error">{statut}</Badge>;

    case 'annulé':
      return <Badge type="warning">{statut}</Badge>;

    case 'accordé':
      return <Badge type="success">{statut}</Badge>;

    default:
      return <Badge type="info">{statut}</Badge>;
  }
};

hydrateOnClient(ListeAbandons);
