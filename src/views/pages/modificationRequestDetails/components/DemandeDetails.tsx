import React from 'react'
import moment from 'moment'

import { formatDate } from '../../../../helpers/formatDate'
import { ModificationRequestPageDTO } from '../../../../modules/modificationRequest'
import { DownloadIcon } from '../../../components'
import ROUTES from '../../../../routes'
import { dataId } from '../../../../helpers/testId'

interface DemandeDetailsProps {
  modificationRequest: ModificationRequestPageDTO
}

export const DemandeDetails = ({ modificationRequest }: DemandeDetailsProps) => {
  const {
    requestedBy,
    requestedOn,
    justification,
    project,
    attachmentFile,
    status,
  } = modificationRequest
  return (
    <div className="panel__header">
      <div>
        Déposée par {requestedBy} le {formatDate(requestedOn)}
      </div>
      {justification && (
        <div style={{ fontStyle: 'italic', marginTop: 5 }}>
          {'"'}
          {justification}
          {'"'}
        </div>
      )}
      {modificationRequest.type === 'delai' ? (
        status === 'envoyée' || status === 'en instruction' ? (
          <div style={{ marginTop: 5 }}>
            La date de mise en service théorique est au <b>{formatDate(project.completionDueOn)}</b>
            .
            <br />
            Le porteur demande un délai de <b>{modificationRequest.delayInMonths} mois</b>, ce qui
            reporterait la mise en service au{' '}
            <b>
              {formatDate(
                +moment(project.completionDueOn).add(modificationRequest.delayInMonths, 'month')
              )}
            </b>
            .
          </div>
        ) : (
          <div style={{ marginTop: 5 }}>
            Le porteur a demandé un délai de <b>{modificationRequest.delayInMonths} mois</b>.{' '}
          </div>
        )
      ) : null}
      {attachmentFile && (
        <div style={{ marginTop: 10 }}>
          <DownloadIcon />
          <a
            href={ROUTES.DOWNLOAD_PROJECT_FILE(attachmentFile.id, attachmentFile.filename)}
            download={true}
            {...dataId('requestList-item-download-link')}
          >
            Télécharger la pièce-jointe
          </a>
        </div>
      )}
    </div>
  )
}
