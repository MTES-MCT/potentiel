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
  Link,
} from '@components';
import { PendingCandidateInvitationDTO } from '@modules/notificationCandidats';
import routes from '@routes';
import { Request } from 'express';
import React from 'react';
import { PaginatedList } from '@modules/pagination';
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

      {invitations.items.length > 0 ? (
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
                      <Form action={routes.ADMIN_INVITATION_RELANCE_ACTION} method="POST">
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
              nombreDePage={invitations.pageCount}
              pageCourante={invitations.pagination.page}
              currentUrl={currentUrl}
            />
          )}
        </>
      ) : (
        <ListeVide titre="Aucune invitation candidat en attente">
          {invitations.itemCount > 0 && (
            <Link href={routes.ADMIN_INVITATION_LIST}>Voir toutes les invitations</Link>
          )}
        </ListeVide>
      )}
    </LegacyPageTemplate>
  );
};

hydrateOnClient(InvitationsCandidatsEnAttente);
