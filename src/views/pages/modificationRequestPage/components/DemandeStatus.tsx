import { SecondaryButton } from '@components'
import { ModificationRequestPageDTO } from '@modules/modificationRequest'
import { UserRole } from '@modules/users'
import ROUTES from '@routes'
import React from 'react'
import { formatDate } from '../../../../helpers/formatDate'
import { dataId } from '../../../../helpers/testId'
import {
  ModificationRequestColorByStatus,
  ModificationRequestStatusTitle,
  ModificationRequestTitleColorByStatus,
} from '../../../helpers'

interface DemandeStatusProps {
  modificationRequest: ModificationRequestPageDTO
  role: UserRole
}

export const DemandeStatus = ({ modificationRequest, role }: DemandeStatusProps) => {
  const { respondedOn, respondedBy, cancelledOn, cancelledBy, responseFile, status, type } =
    modificationRequest
  const afficherBoutonAnnulerRejet =
    ['admin', 'dgec-validateur', 'dreal'].includes(role) && type === 'delai' && status === 'rejetée'
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
      {afficherBoutonAnnulerRejet && (
        <form
          method="post"
          action={ROUTES.ADMIN_ANNULER_DELAI_REJETE({
            modificationRequestId: modificationRequest.id,
          })}
          className="m-0 mt-4"
        >
          <SecondaryButton
            type="submit"
            value={modificationRequest.id}
            name="modificationRequestId"
            onClick={(e) => {
              if (
                !confirm(
                  'Êtes-vous sûr de vouloir passer le statut de la demande en statut "envoyée" ?'
                )
              ) {
                e.preventDefault()
              }
            }}
          >
            Annuler le rejet de la demande
          </SecondaryButton>
        </form>
      )}
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
      acceptanceParams: { delayInMonths, dateAchèvementAccordée },
    } = modificationRequest

    if (delayInMonths) {
      return (
        <div>
          L‘administration vous accorde un délai{' '}
          <b>{delayInMonths ? `de ${delayInMonths} mois.` : '.'}</b> Votre date d'achèvement
          théorique est actuellement au <b>{formatDate(project.completionDueOn)}</b>.
        </div>
      )
    }

    if (dateAchèvementAccordée) {
      return (
        <div>
          L‘administration vous accorde un report de date limite d'achèvement au{' '}
          <span className="font-bold">{formatDate(new Date(dateAchèvementAccordée))}</span>.
        </div>
      )
    }

    return null
  }

  return null
}

interface ConfirmationProps {
  modificationRequest: ModificationRequestPageDTO
  role: UserRole
}
const Confirmation = ({ modificationRequest, role }: ConfirmationProps) => {
  const { versionDate, id, status } = modificationRequest
  if (status === 'en attente de confirmation' && role === 'porteur-projet') {
    return (
      <div>
        <form action={ROUTES.CONFIRMER_DEMANDE_ACTION} method="post" style={{ margin: 0 }}>
          <input type="hidden" name="modificationRequestId" value={id} />
          <input type="hidden" name="versionDate" value={versionDate} />
          <button className="button" type="submit" {...dataId('submit-button')}>
            Je confirme ma demande
          </button>
        </form>
      </div>
    )
  }

  return null
}
