import { ModificationRequestPageDTO } from '@modules/modificationRequest'
import moment from 'moment'
import React from 'react'
import { formatDate } from '../../../../helpers/formatDate'
import { dataId } from '../../../../helpers/testId'
import ROUTES from '../../../../routes'
import { DownloadIcon } from '../../../components'

interface DemandeDetailsProps {
  modificationRequest: ModificationRequestPageDTO
}

export const DemandeDetails = ({ modificationRequest }: DemandeDetailsProps) => {
  const { requestedBy, requestedOn, justification, attachmentFile } = modificationRequest

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
      <DetailsByType modificationRequest={modificationRequest} />
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

interface DetailsByTypeProps {
  modificationRequest: ModificationRequestPageDTO
}
const DetailsByType = ({ modificationRequest }: DetailsByTypeProps) => {
  switch (modificationRequest.type) {
    case 'delai':
      return <DelaiDetails modificationRequest={modificationRequest} />
    case 'puissance':
      return <PuissanceDetails modificationRequest={modificationRequest} />
    case 'actionnaire':
      return <ActionnaireDetails modificationRequest={modificationRequest} />
    case 'producteur':
      return <ProducteurDetails modificationRequest={modificationRequest} />
    case 'fournisseur':
      return <FournisseurDetails modificationRequest={modificationRequest} />
    default:
      return null
  }
}

interface DelaiDetailsProps {
  modificationRequest: ModificationRequestPageDTO & { type: 'delai' }
}
const DelaiDetails = ({ modificationRequest }: DelaiDetailsProps) => {
  const { project, status } = modificationRequest

  return status === 'envoyée' || status === 'en instruction' ? (
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
}

interface PuissanceDetailsProps {
  modificationRequest: ModificationRequestPageDTO & { type: 'puissance' }
}
const PuissanceDetails = ({ modificationRequest }: PuissanceDetailsProps) => {
  return (
    <div style={{ marginTop: 5 }}>
      <span>
        Puissance à la notification : {modificationRequest.project.puissanceInitiale}{' '}
        {modificationRequest.project.unitePuissance}
      </span>

      <br />

      <span>
        Puissance actuelle : {modificationRequest.project.puissance}{' '}
        {modificationRequest.project.unitePuissance}
      </span>

      <br />

      <span>
        Nouvelle puissance demandée : {modificationRequest.puissance}{' '}
        {modificationRequest.project.unitePuissance}
      </span>
    </div>
  )
}

interface ActionnaireDetailsProps {
  modificationRequest: ModificationRequestPageDTO & { type: 'actionnaire' }
}
const ActionnaireDetails = ({ modificationRequest }: ActionnaireDetailsProps) => {
  return (
    <div style={{ marginTop: 5 }}>
      <span>Nouvel actionnaire : {modificationRequest.actionnaire}</span>
    </div>
  )
}

interface ProducteurDetailsProps {
  modificationRequest: ModificationRequestPageDTO & { type: 'producteur' }
}
const ProducteurDetails = ({ modificationRequest }: ProducteurDetailsProps) => {
  return (
    <div style={{ marginTop: 5 }}>
      <span>Nouveau producteur : {modificationRequest.producteur}</span>
    </div>
  )
}

interface FournisseurDetailsProps {
  modificationRequest: ModificationRequestPageDTO & { type: 'fournisseur' }
}
const FournisseurDetails = ({ modificationRequest }: FournisseurDetailsProps) => {
  return (
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
  )
}
