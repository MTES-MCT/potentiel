import React from 'react'
import { formatDate } from '../../../../helpers/formatDate'
import { dataId } from '../../../../helpers/testId'
import { ModificationRequestPageDTO } from '../../../../modules/modificationRequest'
import ROUTES from '../../../../routes'
import {
  ModificationRequestColorByStatus,
  ModificationRequestStatusTitle,
  ModificationRequestTitleColorByStatus,
} from '../../../helpers'

interface DemandeStatusProps {
  modificationRequest: ModificationRequestPageDTO
}

export const DemandeStatus = ({ modificationRequest }: DemandeStatusProps) => {
  const { respondedOn, respondedBy, responseFile, project, status } = modificationRequest
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
      {respondedOn && respondedBy ? `par ${respondedBy} le ${formatDate(respondedOn)}` : ''}
      {modificationRequest.type === 'delai' &&
      modificationRequest.status === 'acceptée' &&
      modificationRequest.acceptanceParams ? (
        <div>
          L‘administration vous accorde un délai{' '}
          <b>
            {modificationRequest.acceptanceParams?.delayInMonths
              ? `de ${modificationRequest.acceptanceParams?.delayInMonths} mois.`
              : '.'}
          </b>{' '}
          Votre date de mise en service théorique est actuellement au{' '}
          <b>{formatDate(project.completionDueOn)}</b>.
        </div>
      ) : null}
      {responseFile ? (
        <div>
          <a
            href={ROUTES.DOWNLOAD_PROJECT_FILE(responseFile.id, responseFile.filename)}
            download={true}
            {...dataId('requestList-item-download-link')}
          >
            Télécharger le courrier de réponse
          </a>
        </div>
      ) : null}
    </div>
  )
}
