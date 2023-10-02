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
} from '../../components';
import { afficherDateAvecHeure, hydrateOnClient } from '../../helpers';
import { UtilisateurReadModel } from '../../../modules/utilisateur/récupérer/UtilisateurReadModel';
import { AbandonReadModel } from '@potentiel/domain-views';
import { ListResult } from '@potentiel/core-domain-views';
import routes from '../../../routes';

type ListeAbandonsProps = {
  abandons: ListResult<AbandonReadModel> & { currentUrl: string };
  request: Request;
  projetsLegacyIds?: string[];
  modificationsRequestIds?: string[];
};

export const ListeAbandons = ({
  request,
  abandons,
  modificationsRequestIds,
  projetsLegacyIds,
}: ListeAbandonsProps) => {
  const utilisateur = request.user as UtilisateurReadModel;

  return (
    <PageListeTemplate
      user={utilisateur}
      currentPage={'liste-abandons'}
      contentHeader={
        <Heading1 className="!text-white whitespace-nowrap">
          Abandons avec recandidature {abandons.totalItems > 0 && `(${abandons.totalItems})`}
        </Heading1>
      }
    >
      <PageListeTemplate.List sideBarOpen={false}>
        {abandons.totalItems === 0 ? (
          <ListeVide titre="Aucun projet à lister" />
        ) : (
          <>
            <ul className="p-0 m-0">
              {abandons.items.map((abandon, index) => (
                <li
                  className="list-none p-0 m-0"
                  key={`${abandon.appelOffre}#${abandon.période}#${abandon.famille}#${abandon.numéroCRE}`}
                >
                  <Tile className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex flex-col gap-2 mb-4">
                        {projetsLegacyIds?.length && (
                          <div className="flex flex-col md:flex-row gap-2">
                            <Link href={routes.PROJECT_DETAILS(projetsLegacyIds[index])}>
                              {/* {projet.nom} */}
                            </Link>
                          </div>
                        )}
                        <div className="italic text-xs text-grey-425-base">
                          {abandon.appelOffre}-P{abandon.période}-F{abandon.famille}-
                          {abandon.numéroCRE}
                        </div>
                        {getStatutAbandon(abandon)}
                      </div>

                      <div className="flex items-center text-sm mb-4 md:mb-0">
                        <MapPinIcon className="mr-2 shrink-0" title="Localisation du projet" />
                        <span className="italic">
                          {/* {projet.localité.commune}, {projet.localité.département},{' '}
                          {projet.localité.région} */}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {projetsLegacyIds?.length && (
                        <SecondaryLinkButton
                          href={routes.PROJECT_DETAILS(projetsLegacyIds[index])}
                          aria-label={`voir le projet`}
                        >
                          Voir le projet
                        </SecondaryLinkButton>
                      )}
                      {modificationsRequestIds?.length && (
                        <LinkButton
                          href={routes.DEMANDE_PAGE_DETAILS(modificationsRequestIds[index])}
                          aria-label={`Voir le détail de la demande d'abandon pour le projet`}
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
              currentPage={abandons.currentPage}
              pageCount={Math.ceil(abandons.totalItems / abandons.itemsPerPage)}
              currentUrl={abandons.currentUrl}
            />
          </>
        )}
      </PageListeTemplate.List>
    </PageListeTemplate>
  );
};

const getStatutAbandon = (abandon: AbandonReadModel) => {
  switch (abandon.statut) {
    case 'accordé':
      return (
        <>
          <div className="italic text-xs text-grey-425-base">Statut : Accordé</div>
          <div className="italic text-xs text-grey-425-base">
            Accordé le {afficherDateAvecHeure(new Date(abandon.accordAccordéLe || ''))}
          </div>
        </>
      );
    case 'rejeté':
      return (
        <>
          <div className="italic text-xs text-grey-425-base">Statut : Rejeté</div>
          <div className="italic text-xs text-grey-425-base">
            Rejeté le {afficherDateAvecHeure(new Date(abandon.rejetRejetéLe || ''))}
          </div>
        </>
      );
    case 'confirmé':
      return (
        <>
          <div className="italic text-xs text-grey-425-base">Statut : Confirmé</div>
          <div className="italic text-xs text-grey-425-base">
            Confirmé le {afficherDateAvecHeure(new Date(abandon.confirmationConfirméLe || ''))}
          </div>
        </>
      );
    case 'confirmation-demandé':
      return (
        <>
          <div className="italic text-xs text-grey-425-base">Statut : Confirmation demandée</div>
          <div className="italic text-xs text-grey-425-base">
            Confirmation demandé le{' '}
            {afficherDateAvecHeure(new Date(abandon.confirmationDemandéLe || ''))}
          </div>
        </>
      );
    default:
      return (
        <>
          <div className="italic text-xs text-grey-425-base">Statut : Demandé</div>
          <div className="italic text-xs text-grey-425-base">
            Demandé le {afficherDateAvecHeure(new Date(abandon.demandeDemandéLe))}
          </div>
        </>
      );
  }
};

hydrateOnClient(ListeAbandons);
