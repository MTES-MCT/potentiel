import { Request } from 'express';
import React from 'react';

import {
  Heading1,
  Link,
  LinkButton,
  SecondaryLinkButton,
  ListeVide,
  MapPinIcon,
  PageListeTemplate,
  Pagination,
  Tile,
} from '../components';
import { afficherDateAvecHeure, hydrateOnClient } from '../helpers';
import { UtilisateurReadModel } from '../../modules/utilisateur/récupérer/UtilisateurReadModel';
import { ProjetReadModel } from '@potentiel/domain-views';
import { ListResult } from '@potentiel/core-domain-views';
import routes from '../../routes';

type ListeProjetsAbandonnésAvecRecandidatureProps = {
  request: Request;
  projetsLegacyIds?: string[];
  modificationsRequestIds?: string[];
  projets: ListResult<ProjetReadModel> & { currentUrl: string };
};

export const ListeProjetsAbandonnésAvecRecandidature = ({
  request,
  projets,
  modificationsRequestIds,
  projetsLegacyIds,
}: ListeProjetsAbandonnésAvecRecandidatureProps) => {
  const utilisateur = request.user as UtilisateurReadModel;

  return (
    <PageListeTemplate
      user={utilisateur}
      currentPage={'liste-projets-avec-recandidature'}
      contentHeader={
        <Heading1 className="!text-white whitespace-nowrap">
          Projets abandonnés avec recandidature
        </Heading1>
      }
    >
      <PageListeTemplate.List sideBarOpen={false}>
        {projets.totalItems === 0 ? (
          <ListeVide titre="Aucun projet à lister" />
        ) : (
          <>
            <ul className="p-0 m-0">
              {projets.items.map((projet, index) => (
                <li
                  className="list-none p-0 m-0"
                  key={`${projet.appelOffre}#${projet.période}#${projet.famille}#${projet.numéroCRE}`}
                >
                  <Tile className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex flex-col gap-2 mb-4">
                        {projetsLegacyIds?.length && (
                          <div className="flex flex-col md:flex-row gap-2">
                            <Link href={routes.PROJECT_DETAILS(projetsLegacyIds[index])}>
                              {projet.nom}
                            </Link>
                          </div>
                        )}
                        <div className="italic text-xs text-grey-425-base">
                          {projet.appelOffre}-P{projet.période}-F{projet.famille}-{projet.numéroCRE}
                        </div>
                        <div className="italic text-xs text-grey-425-base">
                          Abandonné le {afficherDateAvecHeure(new Date(projet.dateAbandon || ''))}
                        </div>
                      </div>

                      <div className="flex items-center text-sm mb-4 md:mb-0">
                        <MapPinIcon className="mr-2 shrink-0" title="Localisation du projet" />
                        <span className="italic">
                          {projet.localité.commune}, {projet.localité.département},{' '}
                          {projet.localité.région}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {projetsLegacyIds?.length && (
                        <SecondaryLinkButton
                          href={routes.PROJECT_DETAILS(projetsLegacyIds[index])}
                          aria-label={`voir le projet ${projet.nom}`}
                        >
                          Voir le projet
                        </SecondaryLinkButton>
                      )}
                      {modificationsRequestIds?.length && (
                        <LinkButton
                          href={routes.DEMANDE_PAGE_DETAILS(modificationsRequestIds[index])}
                          aria-label={`Voir le détail de la demande d'abandon pour le projet ${projet.nom}`}
                        >
                          Voir la demande d'abandon
                        </LinkButton>
                      )}
                    </div>
                  </Tile>
                </li>
              ))}
            </ul>
            <Pagination
              currentPage={projets.currentPage}
              pageCount={Math.ceil(projets.totalItems / projets.itemsPerPage)}
              currentUrl={projets.currentUrl}
            />
          </>
        )}
      </PageListeTemplate.List>
    </PageListeTemplate>
  );
};

hydrateOnClient(ListeProjetsAbandonnésAvecRecandidature);
