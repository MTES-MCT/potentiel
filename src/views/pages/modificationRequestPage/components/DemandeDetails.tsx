import { ModificationRequestPageDTO } from '@modules/modificationRequest'
import { format } from 'date-fns'
import moment from 'moment'
import React from 'react'
import { formatDate } from '../../../../helpers/formatDate'
import { dataId } from '../../../../helpers/testId'
import ROUTES from '@routes'
import { DownloadIcon, ExternalLink, Heading2, Link } from '@components'

interface DemandeDetailsProps {
  modificationRequest: ModificationRequestPageDTO
}

export const DemandeDetails = ({ modificationRequest }: DemandeDetailsProps) => {
  const { requestedBy, requestedOn, justification, attachmentFile, cahierDesCharges } =
    modificationRequest

  return (
    <div className="panel__header">
      <Heading2>Détail de la demande</Heading2>
      <div>
        Déposée par {requestedBy} le {formatDate(requestedOn)}
      </div>
      {cahierDesCharges && (
        <div>
          Instruction selon le cahier des charges{' '}
          {cahierDesCharges.type === 'initial'
            ? 'initial (en vigueur à la candidature)'
            : `${
                cahierDesCharges.alternatif ? 'alternatif' : ''
              } modifié rétroactivement et publié le ${cahierDesCharges.paruLe}`}{' '}
          (<ExternalLink href={cahierDesCharges.url}>voir le cahier des charges</ExternalLink>)
        </div>
      )}
      {justification && <div className="italic mt-2">{`"${justification}"`}</div>}
      <DetailsByType modificationRequest={modificationRequest} />
      {attachmentFile && (
        <div className="mt-4">
          <DownloadIcon />
          <Link
            href={ROUTES.DOWNLOAD_PROJECT_FILE(attachmentFile.id, attachmentFile.filename)}
            download={true}
            {...dataId('requestList-item-download-link')}
          >
            Télécharger la pièce-jointe
          </Link>
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
  const {
    project: { completionDueOn },
    status,
    delayInMonths,
    dateAchèvementDemandée,
  } = modificationRequest

  const dateDemandée = dateAchèvementDemandée
    ? new Date(dateAchèvementDemandée)
    : moment(completionDueOn).add(delayInMonths, 'month').toDate()

  return status === 'envoyée' || status === 'en instruction' ? (
    <div className="mt-2">
      La date d'achèvement théorique est au <b>{format(new Date(completionDueOn), 'dd/MM/yyyy')}</b>
      .
      <br />
      Le porteur demande un délai pour une nouvelle date limite d'achèvement le{' '}
      <span className="font-bold">{format(dateDemandée, 'dd/MM/yyyy')}</span>.
    </div>
  ) : (
    <div className="mt-1">
      {delayInMonths && (
        <>
          Le porteur a demandé un délai de <span className="font-bold">{delayInMonths} mois</span>.
        </>
      )}
      {dateAchèvementDemandée && (
        <>
          Le porteur a demandé un délai pour une nouvelle date d'achèvement le{' '}
          <span className="font-bold">
            {format(new Date(dateAchèvementDemandée), 'dd/MM/yyyy')}
          </span>
        </>
      )}
    </div>
  )
}

interface PuissanceDetailsProps {
  modificationRequest: ModificationRequestPageDTO & { type: 'puissance' }
}
const PuissanceDetails = ({ modificationRequest }: PuissanceDetailsProps) => {
  const { project, status, puissanceAuMomentDuDepot } = modificationRequest
  const { puissance, puissanceInitiale, unitePuissance } = project

  const hasPuissanceChangedSinceDepot =
    puissance !== (puissanceAuMomentDuDepot || puissanceInitiale)

  return (
    <div className="mt-2">
      <div>
        Puissance à la notification : {puissanceInitiale} {unitePuissance}
      </div>

      {puissanceAuMomentDuDepot && puissanceInitiale !== puissanceAuMomentDuDepot && (
        <div>
          Puissance au moment du dépôt : {puissanceAuMomentDuDepot} {unitePuissance}
        </div>
      )}

      {(status === 'en instruction' || status === 'envoyée') && (
        <>
          {hasPuissanceChangedSinceDepot && (
            <div>
              Puissance actuelle : {project.puissance} {unitePuissance}
            </div>
          )}
        </>
      )}

      <div>
        Nouvelle puissance demandée : {modificationRequest.puissance} {unitePuissance}
      </div>
    </div>
  )
}

interface ActionnaireDetailsProps {
  modificationRequest: ModificationRequestPageDTO & { type: 'actionnaire' }
}
const ActionnaireDetails = ({ modificationRequest }: ActionnaireDetailsProps) => {
  return (
    <div className="mt-2">
      <span>Nouvel actionnaire : {modificationRequest.actionnaire}</span>
    </div>
  )
}

interface ProducteurDetailsProps {
  modificationRequest: ModificationRequestPageDTO & { type: 'producteur' }
}
const ProducteurDetails = ({ modificationRequest }: ProducteurDetailsProps) => {
  return (
    <div className="mt-2">
      <span>Nouveau producteur : {modificationRequest.producteur}</span>
    </div>
  )
}

interface FournisseurDetailsProps {
  modificationRequest: ModificationRequestPageDTO & { type: 'fournisseur' }
}
const FournisseurDetails = ({ modificationRequest }: FournisseurDetailsProps) => {
  return (
    <div className="mt-2">
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
