import {
  PaginationPanel,
  PrimaryButton,
  LegacyPageTemplate,
  SuccessBox,
  ErrorBox,
  Heading1,
  ListeVide,
  Table,
  Td,
} from '@components';
import { FailedNotificationDTO } from '@modules/notification';
import ROUTES from '@routes';
import { Request } from 'express';
import React from 'react';
import { PaginatedList } from '../../types';
import { afficherDateAvecHeure, hydrateOnClient } from '../helpers';
type EmailsEnErreurProps = {
  request: Request;
  notifications: PaginatedList<FailedNotificationDTO>;
};

export const EmailsEnErreur = ({ request, notifications }: EmailsEnErreurProps) => {
  const { error, success } = (request.query as any) || {};

  return (
    <LegacyPageTemplate user={request.user} currentPage="list-notifications">
      <div className="panel">
        <div className="panel__header">
          <Heading1>Emails en erreur</Heading1>
          <p>
            Sont listés uniquement les emails de notification qui ont un status &quot;erreur&quot;.
          </p>
        </div>
        <div className="panel__header">
          <form
            action={ROUTES.ADMIN_NOTIFICATION_RETRY_ACTION}
            method="POST"
            style={{ maxWidth: 'auto', margin: '0 0 25px 0' }}
          >
            {!!notifications.itemCount && (
              <PrimaryButton className="mt-3" type="submit" name="submit" id="submit">
                Réessayer toutes les notifications en erreur
              </PrimaryButton>
            )}
          </form>
          {success && <SuccessBox title={success} />}
          {error && <ErrorBox title={error} />}
        </div>

        {notifications.items.length === 0 ? (
          <ListeVide titre="Aucune notification à lister" />
        ) : (
          <>
            <div className="m-2">
              <strong>{notifications.itemCount}</strong> notifications{' '}
            </div>
            <Table>
              <thead>
                <tr>
                  <th>Destinataire</th>
                  <th style={{ width: 150 }}>Type</th>
                  <th style={{ width: 100 }}>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {notifications.items.map((notification) => {
                  return (
                    <tr key={'notification_' + notification.id}>
                      <Td>
                        {notification.recipient.email} {notification.recipient.name}
                      </Td>
                      <Td>{notification.type}</Td>
                      <Td>
                        {notification.createdAt
                          ? afficherDateAvecHeure(notification.createdAt)
                          : ''}
                      </Td>
                      <Td valign="top" className="relative">
                        {notification.error && (
                          <ErrorBox title="Echec de l‘envoi">
                            <div className="italic leading-normal text-xs">
                              {notification.error}
                            </div>
                          </ErrorBox>
                        )}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            {!Array.isArray(notifications) && (
              <PaginationPanel
                nombreDePage={notifications.pageCount}
                pagination={{
                  limiteParPage: notifications.pagination.pageSize,
                  page: notifications.pagination.page,
                }}
                titreItems="Notifications"
              />
            )}
          </>
        )}
      </div>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(EmailsEnErreur);
