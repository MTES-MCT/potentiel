import {
  PrimaryButton,
  DownloadLink,
  ErrorBox,
  Heading1,
  Heading2,
  ModificationRequestActionTitles,
  LegacyPageTemplate,
  ProjectInfo,
  SecondaryButton,
  SuccessBox,
  StatutDemandeModification,
  Form,
} from '@components';
import { AdminResponseForm, DemandeDetails } from '../modificationRequestPage/components';
import ROUTES from '@routes';
import React from 'react';
import { Request } from 'express';
import { DemandeAbandonPageDTO } from '@modules/modificationRequest';
import * as helpers from '../../helpers';
import { userIs } from '@modules/users';

type DemandeAbandonProps = {
  request: Request;
  modificationRequest: DemandeAbandonPageDTO;
};

export const DemandeAbandon = ({ request, modificationRequest }: DemandeAbandonProps) => {
  const { user } = request;
  const { error, success } = request.query as any;
  const { type, id, status, respondedOn, respondedBy, cancelledOn, cancelledBy, responseFile } =
    modificationRequest;

  const isAdmin = userIs(['admin', 'dgec-validateur'])(user);
  const showFormulaireAdministrateur =
    isAdmin && !['rejetée', 'acceptée', 'annulée'].includes(status);

  return (
    <LegacyPageTemplate user={request.user} currentPage="list-requests">
      <Heading1>
        <ModificationRequestActionTitles action={type} />
      </Heading1>
      {error && <ErrorBox title={error} />}
      {success && <SuccessBox title={success} />}
      <div className="flex flex-col gap-4">
        <div>
          <Heading2>Concernant le projet</Heading2>
          <ProjectInfo project={modificationRequest.project} className="mb-3" />
        </div>

        <div>
          {user.role !== 'dreal' && <DemandeDetails modificationRequest={modificationRequest} />}
          <StatutDemandeModification statutDemande={status} className="my-4">
            <span className="font-bold">{helpers.ModificationRequestStatusTitle[status]}</span>{' '}
            {respondedOn &&
              respondedBy &&
              `par ${respondedBy} le ${helpers.afficherDate(respondedOn)}`}
            {cancelledOn &&
              cancelledBy &&
              `par ${cancelledBy} le ${helpers.afficherDate(cancelledOn)}`}
            {responseFile && status !== 'demande confirmée' && (
              <div className="mt-2">
                <DownloadLink
                  fileUrl={ROUTES.DOWNLOAD_PROJECT_FILE(responseFile.id, responseFile.filename)}
                >
                  Télécharger le courrier de réponse
                </DownloadLink>
              </div>
            )}
            {status === 'en attente de confirmation' && user.role === 'porteur-projet' && (
              <Form action={ROUTES.CONFIRMER_DEMANDE_ABANDON} method="post" className="m-0">
                <input type="hidden" name="demandeAbandonId" value={id} />
                <PrimaryButton type="submit" className="mt-4">
                  Je confirme ma demande
                </PrimaryButton>
              </Form>
            )}
          </StatutDemandeModification>

          {status === 'rejetée' && isAdmin && (
            <Form method="post" action={ROUTES.ADMIN_ANNULER_ABANDON_REJETE} className="m-0 mt-4">
              <SecondaryButton
                type="submit"
                value={id}
                name="demandeAbandonId"
                confirmation='Êtes-vous sûr de vouloir repasser la demande en statut "envoyée" ?'
              >
                Annuler le rejet de la demande
              </SecondaryButton>
            </Form>
          )}
        </div>
        {showFormulaireAdministrateur && (
          <div>
            <Heading2>Répondre</Heading2>
            <AdminResponseForm role={user.role} modificationRequest={modificationRequest}>
              {!['en attente de confirmation', 'demande confirmée'].includes(
                modificationRequest.status,
              ) && (
                <PrimaryButton type="submit" name="submitConfirm" className="mt-2">
                  Demander une confirmation au porteur de projet
                </PrimaryButton>
              )}
            </AdminResponseForm>
          </div>
        )}
        {userIs('porteur-projet')(user) &&
          ['envoyée', 'en instruction', 'en attente de confirmation'].includes(status) && (
            <Form action={ROUTES.ANNULER_DEMANDE_ABANDON_ACTION} method="post" className="m-0">
              <input type="hidden" name="modificationRequestId" value={id} />

              <SecondaryButton
                className="w-fit"
                type="submit"
                name="submit"
                confirmation="Êtes-vous sur de vouloir annuler cette demande ?"
              >
                Annuler la demande
              </SecondaryButton>
            </Form>
          )}
      </div>
    </LegacyPageTemplate>
  );
};

helpers.hydrateOnClient(DemandeAbandon);
