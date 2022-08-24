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

function getAdminAnulerRejetDemandeRoute({ type, id }) {
  if (!type) {
    return
  }

  switch (type) {
    case 'delai':
      return ROUTES.ADMIN_ANNULER_DELAI_REJETE({
        modificationRequestId: id,
      })
    case 'recours':
      return ROUTES.ADMIN_ANNULER_RECOURS_REJETE({
        modificationRequestId: id,
      })
    default:
      return
  }
}

export const DemandeStatus = ({ modificationRequest, role }: DemandeStatusProps) => {
  const {
    respondedOn,
    respondedBy,
    cancelledOn,
    cancelledBy,
    responseFile,
    status,
    type,
    authority = null,
  } = modificationRequest
  const afficherBoutonAnnulerRejet =
    (['admin', 'dgec-validateur'].includes(role) ||
      (role === 'dreal' && authority && authority === role)) &&
    ['delai', 'recours'].includes(type) &&
    status === 'rejetée'

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
          action={getAdminAnulerRejetDemandeRoute({ type, id: modificationRequest.id })}
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
      {responseFile && (
        <div className="mt-4">
          <a
            href={ROUTES.DOWNLOAD_PROJECT_FILE(responseFile.id, responseFile.filename)}
            download={true}
            {...dataId('requestList-item-download-link')}
          >
            Télécharger le courrier de réponse
          </a>
        </div>
      )}
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
