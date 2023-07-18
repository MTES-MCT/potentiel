import {
  ErrorBox,
  Heading1,
  ListeVide,
  LegacyPageTemplate,
  Pagination,
  SecondaryButton,
  SuccessBox,
  Table,
  Td,
  Th,
  Form,
} from '@components';
import { PendingCandidateInvitationDTO } from '@modules/notificationCandidats';
import ROUTES from '@routes';
import { Request } from 'express';
import React from 'react';
import { PaginatedList } from '../../types';
import { afficherDateAvecHeure, hydrateOnClient } from '../helpers';

interface InvitationsCandidatsEnAttenteProps {
  request: Request;
  invitations: PaginatedList<PendingCandidateInvitationDTO>;
  currentUrl: string;
}

export const InvitationsCandidatsEnAttente = ({
  request,
  invitations,
  currentUrl,
}: InvitationsCandidatsEnAttenteProps) => {
  const { error, success } = (request.query as any) || {};

  return (
    <LegacyPageTemplate user={request.user} currentPage="list-invitations">
      <Heading1>Invitations de candidats en attente</Heading1>
      <p>
        Sont listées uniquement les invitations de candidats qui n‘ont pas donné lieu à une
        inscription. Les parrainages ne sont pas inclus.
      </p>
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
                <Th>Email</Th>
                <Th className="w-[150px]">Date d‘invitation</Th>
                <Th className="w-[100px]"></Th>
              </tr>
            </thead>
            <tbody>
              {invitations.items.map((invitation) => {
                return (
                  <tr key={`invitation_${invitation.email}`}>
                    <Td>
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
                    </Td>
                    <Td>
                      {invitation.invitedOn ? afficherDateAvecHeure(invitation.invitedOn) : ''}
                    </Td>
                    <Td>
                      <Form action={ROUTES.ADMIN_INVITATION_RELANCE_ACTION} method="POST">
                        <input type="hidden" name="email" value={invitation.email} />
                        <SecondaryButton type="submit" name="submit" className="border-none">
                          relancer
                        </SecondaryButton>
                      </Form>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          {!Array.isArray(invitations) && (
            <Pagination
              titreItems="Invitations"
              nombreDePage={invitations.pageCount}
              limiteParPage={invitations.pagination.pageSize}
              pageCourante={invitations.pagination.page}
              currentUrl={currentUrl}
            />
          )}
        </>
      )}
    </LegacyPageTemplate>
  );
};

hydrateOnClient(InvitationsCandidatsEnAttente);
