import {
  Link,
  LinkButton,
  ListeVide,
  ModificationRequestActionTitles,
  Pagination,
  Table,
  Td,
  Th,
} from '@components';
import {
  ModificationRequestListItemDTO,
  ModificationRequestTypes,
} from '@modules/modificationRequest';
import { UserRole } from '@modules/users';
import ROUTES from '@routes';
import React from 'react';
import { PaginatedList } from '@modules/pagination';
import { afficherDate, ModificationRequestStatusTitle } from '../helpers';

interface Props {
  modificationRequests?: PaginatedList<ModificationRequestListItemDTO>;
  role?: UserRole;
  requestActions?: (
    modificationRequest: ModificationRequestListItemDTO,
  ) => Array<{ title: string; link: string; disabled?: boolean }> | null;
  currentUrl: string;
}

export const RequestList = ({ modificationRequests, requestActions, currentUrl }: Props) => {
  if (!modificationRequests?.itemCount) {
    return <ListeVide titre="Aucune demande n’a été trouvée" />;
  }

  const intituléLien = (type: ModificationRequestTypes) => {
    switch (type) {
      case 'abandon':
        return `la demande d'abandon`;

      case 'annulation abandon':
        return `la demande d'annulation d'abandon`;
      case 'delai':
        return `la demande de délai supplémentaire`;
      case 'fournisseur':
        return `la demande de changement de fournisseur`;
      case 'actionnaire':
        return `la demande de changement d'actionnaire`;
      case 'producteur':
        return `la demande de changement de producteur`;
      case 'puissance':
        return `la demande de changement de puissance`;
      case 'recours':
        return `la demande de recours`;
      case 'autre':
        return `la demande`;
      default:
        return '';
    }
  };

  const statusClass = (statut: string) => {
    switch (statut) {
      case 'information validée':
      case 'acceptée':
        return 'bg-success-975-base border-success-425-base';
      case 'en instruction':
      case 'en attente de confirmation':
      case 'demande confirmée':
        return 'bg-warning-975-base border-warning-425-base';
      case 'annulée':
      case 'rejetée':
        return 'bg-error-975-base border-error-425-base';
      case 'envoyée':
      default:
        return 'bg-info-975-base border-info-425-base';
    }
  };

  return (
    <>
      <Table className="table">
        <thead>
          <tr>
            <Th>Période</Th>
            <Th>Projet</Th>
            <Th>Type</Th>
            <Th>Statut</Th>
            <Th>Lien</Th>
            {requestActions ? <Th></Th> : null}
          </tr>
        </thead>
        <tbody>
          {modificationRequests.items.map((modificationRequestItem) => {
            const { project, requestedBy, requestedOn, status, ...modificationRequest } =
              modificationRequestItem;
            return (
              <tr key={`modificationRequest_${modificationRequest.id}`}>
                <Td className="align-top">
                  <div className="italic leading-normal text-xs">
                    {project.appelOffreId} Période {project.periodeId}
                  </div>
                  <div className="italic leading-normal text-xs">
                    {project.familleId?.length ? `famille ${project.familleId}` : null}
                  </div>
                </Td>
                <Td className="align-top">
                  <div>{project.nomProjet}</div>
                  <div className="italic leading-normal text-xs">
                    <span>{project.communeProjet}</span>, <span>{project.departementProjet}</span>,{' '}
                    <span>{project.regionProjet}</span>
                    <div>
                      Déposé par {requestedBy.fullName}{' '}
                      <Link
                        href={`mailto:${requestedBy.email}`}
                        aria-label={`Envoyer un email au porteur du projet ${project.nomProjet}`}
                      >
                        (envoyer un email)
                      </Link>{' '}
                      le {afficherDate(requestedOn)}
                    </div>
                  </div>
                </Td>
                <Td className="align-top">
                  <ModificationRequestActionTitles action={modificationRequest.type} />
                  <div className="italic leading-none text-xs">
                    {modificationRequest.description}
                  </div>
                  <div className="italic leading-normal text-xs">
                    {modificationRequest.attachmentFile && (
                      <Link
                        href={ROUTES.DOWNLOAD_PROJECT_FILE(
                          modificationRequest.attachmentFile.id,
                          modificationRequest.attachmentFile.filename,
                        )}
                        aria-label={`Télécharger la pièce-jointe de ${intituléLien(
                          modificationRequest.type,
                        )} pour le projet ${project.nomProjet}`}
                        download={true}
                      >
                        Télécharger la pièce-jointe
                      </Link>
                    )}
                  </div>
                </Td>
                <Td
                  className={`align-top !border-x-[1px] border-solid ${
                    status ? statusClass(status) : ''
                  }`}
                >
                  {status ? ModificationRequestStatusTitle[status] : ''}
                </Td>
                <Td>
                  <LinkButton
                    href={ROUTES.DEMANDE_PAGE_DETAILS(modificationRequest.id)}
                    aria-label={`Voir le détail de ${intituléLien(
                      modificationRequest.type,
                    )} pour le projet ${project.nomProjet}`}
                  >
                    Voir
                  </LinkButton>
                </Td>
                {requestActions && requestActions(modificationRequestItem) && (
                  <Td className="relative">
                    <img
                      src="/images/icons/external/more.svg"
                      height="12"
                      width="12"
                      tabIndex={0}
                      className="list--action-trigger cursor-pointer"
                    />
                    <ul className="list--action-menu">
                      {requestActions(modificationRequestItem)?.map(
                        ({ title, link, disabled }, actionIndex) => (
                          <li key={`request_action_${modificationRequestItem.id}_${actionIndex}`}>
                            {disabled ? <i>{title}</i> : <Link href={link}>{title}</Link>}
                          </li>
                        ),
                      )}
                    </ul>
                  </Td>
                )}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Pagination
        nombreDePage={modificationRequests.pageCount}
        pageCourante={modificationRequests.pagination.page}
        currentUrl={currentUrl}
      />
    </>
  );
};
