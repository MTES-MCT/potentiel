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
} from '@components';
import { AdminResponseForm, DemandeDetails } from '../modificationRequestPage/components';
import ROUTES from '@routes';
import React from 'react';
import { Request } from 'express';
import { DemandeAbandonPageDTO } from '@modules/modificationRequest';
import { dataId } from '../../../helpers/testId';
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
      <div className="panel">
        <div className="panel__header">
          <Heading1>
            <ModificationRequestActionTitles action={type} />
          </Heading1>
          {error && <ErrorBox title={error} />}
          {success && <SuccessBox title={success} />}
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <Heading2>Concernant le projet</Heading2>
            <ProjectInfo project={modificationRequest.project} className="mb-3" />
          </div>

          <div>
            <DemandeDetails modificationRequest={modificationRequest} />
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
                <div>
                  <form action={ROUTES.CONFIRMER_DEMANDE_ABANDON} method="post" className="m-0">
                    <input type="hidden" name="demandeAbandonId" value={id} />
                    <PrimaryButton type="submit" className="mt-4">
                      Je confirme ma demande
                    </PrimaryButton>
                  </form>
                </div>
              )}
            </StatutDemandeModification>

            {status === 'rejetée' && userIs(['admin', 'dgec-validateur'])(user) && (
              <form method="post" action={ROUTES.ADMIN_ANNULER_ABANDON_REJETE} className="m-0 mt-4">
                <SecondaryButton
                  type="submit"
                  value={id}
                  name="demandeAbandonId"
                  confirmation='Êtes-vous sûr de vouloir repasser la demande en statut "envoyée" ?'
                >
                  Annuler le rejet de la demande
                </SecondaryButton>
              </form>
            )}
          </div>
          {showFormulaireAdministrateur && (
            <div>
              <Heading2>Répondre</Heading2>
              <AdminResponseForm role={user.role} modificationRequest={modificationRequest}>
                {!['en attente de confirmation', 'demande confirmée'].includes(
                  modificationRequest.status,
                ) && (
                  <PrimaryButton
                    type="submit"
                    name="submitConfirm"
                    {...dataId('ask-confirmation-button')}
                    className="mt-2"
                  >
                    Demander une confirmation au porteur de projet
                  </PrimaryButton>
                )}
              </AdminResponseForm>
            </div>
          )}
          {userIs('porteur-projet')(user) &&
            ['envoyée', 'en instruction', 'en attente de confirmation'].includes(status) && (
              <form action={ROUTES.ANNULER_DEMANDE_ABANDON_ACTION} method="post" className="m-0">
                <input type="hidden" name="modificationRequestId" value={id} />

                <SecondaryButton
                  className="border-red-marianne-425-base text-red-marianne-425-base hover:bg-red-marianne-975-base focus:bg-red-marianne-975-base"
                  type="submit"
                  name="submit"
                  confirmation="Êtes-vous sur de vouloir annuler cette demande ?"
                >
                  Annuler la demande
                </SecondaryButton>
              </form>
            )}
        </div>
      </div>
    </LegacyPageTemplate>
  );
};

helpers.hydrateOnClient(DemandeAbandon);
