import { Link, ListeVide, ModificationRequestActionTitles, PaginationPanel } from '@components';
import { ModificationRequestListItemDTO } from '@modules/modificationRequest';
import { UserRole } from '@modules/users';
import ROUTES from '@routes';
import React from 'react';
import { formatDateToString } from '../../helpers/formatDateToString';
import { dataId } from '../../helpers/testId';
import { PaginatedList } from '../../types';
import { ModificationRequestColorByStatus, ModificationRequestStatusTitle } from '../helpers';

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

  return (
    <>
      <table className="table" {...dataId('requestList-list')}>
        <thead>
          <tr>
            <th>Période</th>
            <th>Projet</th>
            <th>Type</th>
            <th>Statut</th>
            {requestActions ? <th></th> : null}
          </tr>
        </thead>
        <tbody>
          {modificationRequests.items.map((modificationRequestItem) => {
            const { project, requestedBy, requestedOn, status, ...modificationRequest } =
              modificationRequestItem;
            return (
              <tr
                key={'modificationRequest_' + modificationRequest.id}
                style={{ cursor: 'pointer' }}
                data-goto-onclick={ROUTES.DEMANDE_PAGE_DETAILS(modificationRequest.id)}
              >
                <td valign="top">
                  <div
                    style={{
                      fontStyle: 'italic',
                      lineHeight: 'normal',
                      fontSize: 12,
                    }}
                    {...dataId('requestList-item-periode')}
                  >
                    {project.appelOffreId} Période {project.periodeId}
                  </div>
                  <div
                    style={{
                      fontStyle: 'italic',
                      lineHeight: 'normal',
                      fontSize: 12,
                    }}
                    {...dataId('requestList-item-famille')}
                  >
                    {project.familleId?.length ? `famille ${project.familleId}` : null}
                  </div>
                </td>
                <td valign="top">
                  <div {...dataId('requestList-item-nomProjet')}>{project.nomProjet}</div>
                  <div
                    style={{
                      fontStyle: 'italic',
                      lineHeight: 'normal',
                      fontSize: 12,
                    }}
                  >
                    <span {...dataId('requestList-item-communeProjet')}>
                      {project.communeProjet}
                    </span>
                    ,{' '}
                    <span {...dataId('requestList-item-departementProjet')}>
                      {project.departementProjet}
                    </span>
                    ,{' '}
                    <span {...dataId('requestList-item-regionProjet')}>{project.regionProjet}</span>
                    <div>
                      Déposé par{' '}
                      <Link href={`mailto:${requestedBy.email}`}>{requestedBy.fullName}</Link> le{' '}
                      {formatDateToString(requestedOn)}
                    </div>
                  </div>
                </td>
                <td valign="top">
                  <div {...dataId('requestList-item-type')}>
                    <ModificationRequestActionTitles action={modificationRequest.type} />
                  </div>
                  <div
                    style={{
                      fontStyle: 'italic',
                      lineHeight: 'normal',
                      fontSize: 12,
                    }}
                  >
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
                </td>
                <td
                  valign="top"
                  className={
                    'notification ' + (status ? ModificationRequestColorByStatus[status] : '')
                  }
                  {...dataId('requestList-item-type')}
                >
                  {status ? ModificationRequestStatusTitle[status] : ''}
                </td>
                {requestActions && requestActions(modificationRequestItem) ? (
                  <td style={{ position: 'relative' }}>
                    <img
                      src="/images/icons/external/more.svg"
                      height="12"
                      width="12"
                      style={{ cursor: 'pointer' }}
                      tabIndex={0}
                      className="list--action-trigger"
                    />
                    <ul className="list--action-menu">
                      {requestActions(modificationRequestItem)?.map(
                        ({ title, link, disabled }, actionIndex) => (
                          <li
                            key={'request_action_' + modificationRequestItem.id + '_' + actionIndex}
                          >
                            {disabled ? (
                              <i>{title}</i>
                            ) : (
                              <Link href={link} {...dataId('requestList-item-action')}>
                                {title}
                              </Link>
                            )}
                          </li>
                        ),
                      )}
                    </ul>
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
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
