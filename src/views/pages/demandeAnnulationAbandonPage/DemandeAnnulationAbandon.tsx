import {
  DownloadLink,
  ErrorBox,
  Heading1,
  Heading2,
  LegacyPageTemplate,
  ProjectInfo,
  SecondaryButton,
  StatutDemandeModification,
  SuccessBox,
} from '@components';
import { AdminResponseForm, DemandeDetails } from '../modificationRequestPage/components';
import ROUTES from '@routes';
import React from 'react';
import { Request } from 'express';
import { DemandeAnnulationAbandonPageDTO } from '@modules/modificationRequest';
import { afficherDate, hydrateOnClient, ModificationRequestStatusTitle } from '../../helpers';
import { userIs } from '@modules/users';

type DemandeAnnulationAbandonProps = {
  request: Request;
  modificationRequest: DemandeAnnulationAbandonPageDTO;
};

export const DemandeAnnulationAbandon = ({
  request,
  modificationRequest,
}: DemandeAnnulationAbandonProps) => {
  const { user } = request;
  const { error, success } = request.query as any;
  const { id, status, respondedOn, respondedBy, cancelledOn, cancelledBy, responseFile } =
    modificationRequest;

  const isAdmin = userIs(['admin', 'dgec-validateur'])(user);
  const showFormulaireAdministrateur =
    isAdmin && !['rejetée', 'acceptée', 'annulée'].includes(status);
  return (
    <LegacyPageTemplate user={request.user} currentPage="list-requests">
      <div className="panel">
        <div className="panel__header" style={{ position: 'relative' }}>
          <Heading1>Je demande une annulation de l'abandon accordé de mon projet</Heading1>
        </div>
        {error && <ErrorBox title={error} />}
        {success && <SuccessBox title={success} />}
        <div className="flex flex-col gap-4">
          <div>
            <Heading2>Concernant le projet</Heading2>
            <ProjectInfo project={modificationRequest.project} className="mb-3" />
          </div>

          <div>
            <DemandeDetails modificationRequest={modificationRequest} />
            <StatutDemandeModification statutDemande={status} className="my-4">
              <>
                <span style={{ fontWeight: 'bold' }}>{ModificationRequestStatusTitle[status]}</span>{' '}
                {respondedOn && respondedBy && `par ${respondedBy} le ${afficherDate(respondedOn)}`}
                {cancelledOn && cancelledBy && `par ${cancelledBy} le ${afficherDate(cancelledOn)}`}
                {responseFile && status !== 'demande confirmée' && (
                  <div>
                    <DownloadLink
                      fileUrl={ROUTES.DOWNLOAD_PROJECT_FILE(responseFile.id, responseFile.filename)}
                    >
                      Télécharger le courrier de réponse
                    </DownloadLink>
                  </div>
                )}
              </>
            </StatutDemandeModification>
          </div>

          <div>
            {showFormulaireAdministrateur && (
              <div className="panel__header">
                <Heading2>Répondre</Heading2>
                <AdminResponseForm role={user.role} modificationRequest={modificationRequest} />
              </div>
            )}

            {userIs('porteur-projet')(user) &&
              ['envoyée', 'en-instruction', 'en attente de confirmation'].includes(status) && (
                <form
                  action={ROUTES.POST_ANNULER_DEMANDE_ANNULATION_ABANDON}
                  method="post"
                  style={{ margin: 0 }}
                >
                  <input type="hidden" name="demandeId" value={id} />

                  <SecondaryButton
                    className="border-red-marianne-425-base text-red-marianne-425-base hover:bg-red-marianne-975-base focus:bg-red-marianne-975-base"
                    type="submit"
                    name="submit"
                    confirmation="Etes-vous sur de vouloir annuler cette demande ?"
                  >
                    Annuler la demande
                  </SecondaryButton>
                </form>
              )}
          </div>
        </div>
      </div>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(DemandeAnnulationAbandon);
