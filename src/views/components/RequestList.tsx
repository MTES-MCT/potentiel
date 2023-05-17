import {
  Link,
  LinkButton,
  ListeVide,
  ModificationRequestActionTitles,
  PaginationPanel,
  Table,
  Td,
  Th,
} from '@components';
import {
  ModificationRequestListItemDTO,
  ModificationRequestStatusDTO,
  ModificationRequestTypes,
} from '@modules/modificationRequest';
import { UserRole } from '@modules/users';
import ROUTES from '@routes';
import React from 'react';
import { PaginatedList } from '../../types';
import {
  afficherDate,
  // ModificationRequestColorByStatus,
  ModificationRequestStatusTitle,
} from '../helpers';

interface Props {
  modificationRequests?: PaginatedList<ModificationRequestListItemDTO>;
  role?: UserRole;
  requestActions?: (
    modificationRequest: ModificationRequestListItemDTO,
  ) => Array<{ title: string; link: string; disabled?: boolean }> | null;
}

export const RequestList = ({ modificationRequests, requestActions }: Props) => {
  if (!modificationRequests?.itemCount) {
    return <ListeVide titre="Aucune demande n’a été trouvée" />;
  }

  const buttonTitleByType = (type: ModificationRequestTypes) => {
    switch (type) {
      case 'abandon':
        return `Voir la demande d'abandon`;

      case 'annulation abandon':
        return `Voir la demande d'annulation d'abandon`;
      case 'delai':
        return `Voir la demande de délai supplémentaire`;
      case 'fournisseur':
        return `Voir la demande de changement de fournisseur`;
      case 'actionnaire':
        return `Voir la demande de changement d'actionnaire`;
      case 'producteur':
        return `Voir la demande de changement de producteur`;
      case 'puissance':
        return `Voir la demande de changement de puissance`;
      case 'recours':
        return `Voir la demande de recours`;
      case 'autre':
        return `Voir la demande`;
      default:
        return '';
    }
  };

  const statusClass = (statut: ModificationRequestStatusDTO) => {
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
                <Td valign="top">
                  <div className="italic leading-normal text-xs">
                    {project.appelOffreId} Période {project.periodeId}
                  </div>
                  <div className="italic leading-normal text-xs">
                    {project.familleId?.length ? `famille ${project.familleId}` : null}
                  </div>
                </Td>
                <Td valign="top">
                  <div>{project.nomProjet}</div>
                  <div className="italic leading-normal text-xs">
                    <span>{project.communeProjet}</span>, <span>{project.departementProjet}</span>,{' '}
                    <span>{project.regionProjet}</span>
                    <div>
                      Déposé par{' '}
                      <Link href={`mailto:${requestedBy.email}`}>{requestedBy.fullName}</Link> le{' '}
                      {afficherDate(requestedOn)}
                    </div>
                  </div>
                </Td>
                <Td valign="top">
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
                        download={true}
                      >
                        Télécharger la pièce-jointe
                      </Link>
                    )}
                  </div>
                </Td>
                <Td
                  valign="top"
                  className={`!border-x-[1px] border-solid ${status ? statusClass(status) : ''}`}
                >
                  {status ? ModificationRequestStatusTitle[status] : ''}
                </Td>
                <Td>
                  <LinkButton
                    href={ROUTES.DEMANDE_PAGE_DETAILS(modificationRequest.id)}
                    title={`${buttonTitleByType(modificationRequest.type)} pour le projet ${
                      project.nomProjet
                    }`}
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
      <PaginationPanel
        nombreDePage={modificationRequests.pageCount}
        pagination={{
          limiteParPage: modificationRequests.pagination.pageSize,
          page: modificationRequests.pagination.page,
        }}
        titreItems="Demandes"
      />
    </>
  );
};
