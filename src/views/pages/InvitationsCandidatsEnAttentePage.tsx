import {
  ErrorBox,
  Heading1,
  ListeVide,
  LegacyPageTemplate,
  PaginationPanel,
  SecondaryButton,
  SuccessBox,
  Table,
} from '@components';
import { PendingCandidateInvitationDTO } from '@modules/notificationCandidats';
import ROUTES from '@routes';
import { Request } from 'express';
import React from 'react';
import { dataId } from '../../helpers/testId';
import { PaginatedList } from '../../types';
import { afficherDateAvecHeure, hydrateOnClient } from '../helpers';

interface InvitationsCandidatsEnAttenteProps {
  request: Request;
  invitations: PaginatedList<PendingCandidateInvitationDTO>;
}

export const InvitationsCandidatsEnAttente = ({
  request,
  invitations,
}: InvitationsCandidatsEnAttenteProps) => {
  const { error, success } = (request.query as any) || {};

  return (
    <LegacyPageTemplate user={request.user} currentPage="list-invitations">
      <div className="panel">
        <div className="panel__header">
          <Heading1>Invitations de candidats en attente</Heading1>
          <p>
            Sont listées uniquement les invitations de candidats qui n‘ont pas donné lieu à une
            inscription. Les parrainages ne sont pas inclus.
          </p>
        </div>
        {success && <SuccessBox title={success} />}
        {error && <ErrorBox title={error} />}

        {invitations.items.length === 0 ? (
          <ListeVide titre="Aucune invitation candidat en attente" />
        ) : (
          <>
            <div className="m-2">
              <strong>{invitations.itemCount}</strong> invitations en attente{' '}
            </div>
            <Table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th style={{ width: 150 }}>Date d‘invitation</th>
                  <th style={{ width: 100 }}></th>
                </tr>
              </thead>
              <tbody>
                {invitations.items.map((invitation) => {
                  return (
                    <tr key={'invitation_' + invitation.email} {...dataId('invitationList-item')}>
                      <td>
                        {invitation.email}{' '}
                        {invitation.fullName ? (
                          <div
                            style={{
                              fontStyle: 'italic',
                              lineHeight: 'normal',
                              fontSize: 12,
                            }}
                          >
                            {invitation.fullName}
                          </div>
                        ) : (
                          ''
                        )}
                      </td>
                      <td>
                        {invitation.invitedOn ? afficherDateAvecHeure(invitation.invitedOn) : ''}
                      </td>
                      <td>
                        <form
                          action={ROUTES.ADMIN_INVITATION_RELANCE_ACTION}
                          method="POST"
                          style={{}}
                        >
                          <input type="hidden" name="email" value={invitation.email} />
                          <SecondaryButton type="submit" name="submit" className="border-none">
                            relancer
                          </SecondaryButton>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            {!Array.isArray(invitations) ? (
              <PaginationPanel
                nombreDePage={invitations.pageCount}
                pagination={{
                  limiteParPage: invitations.pagination.pageSize,
                  page: invitations.pagination.page,
                }}
                titreItems="Invitations"
              />
            ) : (
              ''
            )}
          </>
        )}
      </div>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(InvitationsCandidatsEnAttente);
