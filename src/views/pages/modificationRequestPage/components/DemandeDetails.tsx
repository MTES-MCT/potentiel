import React from 'react'
import moment from 'moment'

import { formatDate } from '../../../../helpers/formatDate'
import { ModificationRequestPageDTO } from '@modules/modificationRequest'
import { DownloadIcon } from '../../../components'
import ROUTES from '../../../../routes'
import { dataId } from '../../../../helpers/testId'

interface DemandeDetailsProps {
  modificationRequest: ModificationRequestPageDTO
}

export const DemandeDetails = ({ modificationRequest }: DemandeDetailsProps) => {
  const { requestedBy, requestedOn, justification, project, attachmentFile, status } =
    modificationRequest
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
      {modificationRequest.type === 'puissance' && (
        <div className="flex flex-col" style={{ marginTop: 5 }}>
          <span>
            Puissance à la notification : {modificationRequest.project.puissanceInitiale}{' '}
            {modificationRequest.project.unitePuissance}
          </span>
          <span>
            Puissance actuelle : {modificationRequest.project.puissance}{' '}
            {modificationRequest.project.unitePuissance}
          </span>
          <span>
            Nouvelle puissance demandée : {modificationRequest.puissance}{' '}
            {modificationRequest.project.unitePuissance}
            {!modificationRequest.isAuto && (
              <span className="rounded-md bg-yellow-400 items-center px-2 py-0.5 ml-2">
                <span className="text-sm font-bold tracking-wide uppercase text-white m-0">
                  {modificationRequest.reason === 'hors-ratios-autorisés'
                    ? 'Hors ratios autorisés'
                    : 'Puissance maximum du volume reservé dépassé'}
                </span>
              </span>
            )}
          </span>
        </div>
      )}
      {modificationRequest.type === 'actionnaire' && (
        <div style={{ marginTop: 5 }}>
          <span>Nouvel actionnaire : {modificationRequest.actionnaire}</span>
        </div>
      )}
      {modificationRequest.type === 'producteur' && (
        <div style={{ marginTop: 5 }}>
          <span>Nouveau producteur : {modificationRequest.producteur}</span>
        </div>
      )}
      {modificationRequest.type === 'fournisseur' && (
        <div style={{ marginTop: 5 }}>
          {modificationRequest.fournisseurs?.length > 0 && (
            <>
              <span>Nouveau(x) fournisseur(s) : </span>
              <ul>
                {modificationRequest.fournisseurs?.map((fournisseur, index) => (
                  <li key={index}>
                    {fournisseur.kind} : {fournisseur.name}
                  </li>
                ))}
              </ul>
            </>
          )}
          {modificationRequest.evaluationCarbone && (
            <>
              <br />
              <span>
                Nouvelle évaluation carbone : {modificationRequest.evaluationCarbone} kg eq CO2/kWc
              </span>
            </>
          )}
        </div>
      )}
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
