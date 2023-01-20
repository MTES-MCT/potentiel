import { ErrorBox, Link, PageTemplate, ProjectInfo, SuccessBox } from '@components'
import { AdminResponseForm, DemandeDetails } from '../modificationRequestPage/components'
import ROUTES from '@routes'
import React from 'react'
import { Request } from 'express'
import { DemandeAnnulationAbandonPageDTO } from '@modules/modificationRequest'
import {
  hydrateOnClient,
  ModificationRequestColorByStatus,
  ModificationRequestStatusTitle,
  ModificationRequestTitleColorByStatus,
} from '../../helpers'
import { formatDate } from '../../../helpers/formatDate'
import { userIs } from '@modules/users'

type DemandeAnnulationAbandonProps = {
  request: Request
  modificationRequest: DemandeAnnulationAbandonPageDTO
}

export const DemandeAnnulationAbandon = ({
  request,
  modificationRequest,
}: DemandeAnnulationAbandonProps) => {
  const { user } = request
  const { error, success } = request.query as any
  const { id, status, respondedOn, respondedBy, cancelledOn, cancelledBy, responseFile } =
    modificationRequest

  const isAdmin = userIs(['admin', 'dgec-validateur'])(user)
  const showFormulaireAdministrateur =
    isAdmin && !['rejetée', 'acceptée', 'annulée'].includes(status)
  return (
    <PageTemplate user={request.user} currentPage="list-requests">
      <div className="panel">
        <div className="panel__header" style={{ position: 'relative' }}>
          <h3>Je demande une annulation de l'abandon accordé de mon projet</h3>
        </div>
        <DemandeDetails modificationRequest={modificationRequest} />

        <p className="m-0">Concernant le projet :</p>
        <ProjectInfo project={modificationRequest.project} className="mb-3" />
        {error && <ErrorBox title={error} />}
        {success && <SuccessBox title={success} />}

        <div className="panel__header">
          <div
            className={'notification ' + (status ? ModificationRequestColorByStatus[status] : '')}
            style={{ color: ModificationRequestTitleColorByStatus[status] }}
          >
            <span style={{ fontWeight: 'bold' }}>{ModificationRequestStatusTitle[status]}</span>{' '}
            {respondedOn && respondedBy && `par ${respondedBy} le ${formatDate(respondedOn)}`}
            {cancelledOn && cancelledBy && `par ${cancelledBy} le ${formatDate(cancelledOn)}`}
            {responseFile && status !== 'demande confirmée' && (
              <div>
                <Link
                  href={ROUTES.DOWNLOAD_PROJECT_FILE(responseFile.id, responseFile.filename)}
                  download={true}
                >
                  Télécharger le courrier de réponse
                </Link>
              </div>
            )}
          </div>
        </div>
        {showFormulaireAdministrateur && (
          <div className="panel__header">
            <h4>Répondre</h4>
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
                data-confirm={`Etes-vous sur de vouloir annuler cette demande ?`}
              >
                Annuler la demande
              </button>
            </form>
          )}
      </div>
    </PageTemplate>
  )
}

hydrateOnClient(DemandeAnnulationAbandon)
