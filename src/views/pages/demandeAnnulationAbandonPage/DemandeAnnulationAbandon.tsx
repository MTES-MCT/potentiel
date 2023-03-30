import {
  DownloadLink,
  ErrorBox,
  Heading1,
  Heading2,
  PageTemplate,
  ProjectInfo,
  SuccessBox,
} from '@components';
import { AdminResponseForm, DemandeDetails } from '../modificationRequestPage/components';
import ROUTES from '@routes';
import React from 'react';
import { Request } from 'express';
import { DemandeAnnulationAbandonPageDTO } from '@modules/modificationRequest';
import {
  afficherDate,
  hydrateOnClient,
  ModificationRequestColorByStatus,
  ModificationRequestStatusTitle,
  ModificationRequestTitleColorByStatus,
} from '../../helpers';
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
    <PageTemplate user={request.user} currentPage="list-requests">
      <div className="panel">
        <div className="panel__header" style={{ position: 'relative' }}>
          <Heading1>Je demande une annulation de l'abandon accordé de mon projet</Heading1>
        </div>
        <DemandeDetails modificationRequest={modificationRequest} />

        <Heading2>Concernant le projet</Heading2>
        <ProjectInfo project={modificationRequest.project} className="mb-3" />
        {error && <ErrorBox title={error} />}
        {success && <SuccessBox title={success} />}

        <div className="panel__header">
          <div
            className={'notification ' + (status ? ModificationRequestColorByStatus[status] : '')}
            style={{ color: ModificationRequestTitleColorByStatus[status] }}
          >
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
          </div>
        </div>
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

              <button
                className="button-outline warning"
                type="submit"
                name="submit"
                onClick={(event) =>
                  confirm(`Etes-vous sur de vouloir annuler cette demande ?`) ||
                  event.preventDefault()
                }
              >
                Annuler la demande
              </button>
            </form>
          )}
      </div>
    </PageTemplate>
  );
};

hydrateOnClient(DemandeAnnulationAbandon);
