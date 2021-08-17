import React from 'react'
import { User } from '../../../../entities'
import { formatDate } from '../../../../helpers/formatDate'
import { dataId } from '../../../../helpers/testId'
import { ModificationRequestPageDTO } from '../../../../modules/modificationRequest'
import ROUTES from '../../../../routes'
import {
  ModificationRequestColorByStatus,
  ModificationRequestStatusTitle,
  ModificationRequestTitleByType,
  ModificationRequestTitleColorByStatus,
} from '../../../helpers'

interface DemandeStatusProps {
  modificationRequest: ModificationRequestPageDTO
  role: User['role']
}

export const DemandeStatus = ({ modificationRequest, role }: DemandeStatusProps) => {
  const {
    respondedOn,
    respondedBy,
    cancelledOn,
    cancelledBy,
    responseFile,
    status,
  } = modificationRequest
  return (
    <div
      className={'notification ' + (status ? ModificationRequestColorByStatus[status] : '')}
      style={{ color: ModificationRequestTitleColorByStatus[status] }}
    >
      <span
        style={{
          fontWeight: 'bold',
        }}
      >
        {ModificationRequestStatusTitle[status]}
      </span>{' '}
      {respondedOn && respondedBy && `par ${respondedBy} le ${formatDate(respondedOn)}`}
      {cancelledOn && cancelledBy && `par ${cancelledBy} le ${formatDate(cancelledOn)}`}
      <StatusForDelai modificationRequest={modificationRequest} />
      {responseFile && status !== 'demande confirmée' && (
        <div>
          <a
            href={ROUTES.DOWNLOAD_PROJECT_FILE(responseFile.id, responseFile.filename)}
            download={true}
            {...dataId('requestList-item-download-link')}
          >
            Télécharger le courrier de réponse
          </a>
        </div>
      )}
      <Confirmation role={role} modificationRequest={modificationRequest} />
    </div>
  )
}

interface StatusForDelaiProps {
  modificationRequest: ModificationRequestPageDTO
}
const StatusForDelai = ({ modificationRequest }: StatusForDelaiProps) => {
  const { project } = modificationRequest
  if (
    modificationRequest.type === 'delai' &&
    modificationRequest.status === 'acceptée' &&
    modificationRequest.acceptanceParams
  ) {
    const {
      acceptanceParams: { delayInMonths },
    } = modificationRequest
    return (
      <div>
        L‘administration vous accorde un délai{' '}
        <b>{delayInMonths ? `de ${delayInMonths} mois.` : '.'}</b> Votre date de mise en service
        théorique est actuellement au <b>{formatDate(project.completionDueOn)}</b>.
      </div>
    )
  }

  return null
}

interface ConfirmationProps {
  modificationRequest: ModificationRequestPageDTO
  role: User['role']
}
const Confirmation = ({ modificationRequest, role }: ConfirmationProps) => {
  const { versionDate, id, status } = modificationRequest
  if (status === 'en attente de confirmation' && role === 'porteur-projet') {
    return (
      <div>
        <form action={ROUTES.CONFIRMER_DEMANDE_ACTION} method="post" style={{ margin: 0 }}>
          <input type="hidden" name="modificationRequestId" value={id} />
          <input type="hidden" name="versionDate" value={versionDate.getTime()} />
          <button className="button" type="submit" {...dataId('submit-button')}>
            Je confirme ma demande
          </button>
        </form>
      </div>
    )
  }

  return null
}
