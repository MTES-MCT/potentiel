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
  Th,
  Form,
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
  currentUrl: string;
};

export const EmailsEnErreur = ({ request, notifications, currentUrl }: EmailsEnErreurProps) => {
  const { error, success } = (request.query as any) || {};

  return (
    <LegacyPageTemplate user={request.user} currentPage="list-notifications">
      <Heading1>Emails en erreur</Heading1>
      <p>Sont listés uniquement les emails de notification qui ont un status &quot;erreur&quot;.</p>
      <Form
        action={ROUTES.ADMIN_NOTIFICATION_RETRY_ACTION}
        method="POST"
        className="max-w-none mx-0 mb-6"
      >
        {!!notifications.itemCount && (
          <PrimaryButton className="mt-3" type="submit" name="submit" id="submit">
            Réessayer toutes les notifications en erreur
          </PrimaryButton>
        )}
      </Form>
      {success && <SuccessBox title={success} />}
      {error && <ErrorBox title={error} />}

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
                <Th>Destinataire</Th>
                <Th className="w-[150px]">Type</Th>
                <Th className="w-[100px]">Date</Th>
                <Th>Status</Th>
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
                      {notification.createdAt ? afficherDateAvecHeure(notification.createdAt) : ''}
                    </Td>
                    <Td className="align-top relative">
                      {notification.error && (
                        <ErrorBox title="Echec de l‘envoi">
                          <div className="italic leading-normal text-xs">{notification.error}</div>
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
              limiteParPage={notifications.pagination.pageSize}
              pageCourante={notifications.pagination.page}
              titreItems="Notifications"
              currentUrl={currentUrl}
            />
          )}
        </>
      )}
    </LegacyPageTemplate>
  );
};

hydrateOnClient(EmailsEnErreur);
