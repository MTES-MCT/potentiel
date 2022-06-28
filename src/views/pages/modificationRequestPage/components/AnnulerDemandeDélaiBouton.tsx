import * as React from 'react'
import { ModificationRequestStatusDTO } from '@modules/modificationRequest'
import ROUTES from '../../../../routes'

interface CancelButtonProps {
  isAdmin: boolean
  status: ModificationRequestStatusDTO
  id: string
  projectId: string
  hasDelayInMonths: boolean
  route: string
}
export const AnnulerDemandeDélaiBouton = ({
  isAdmin,
  status,
  id,
  projectId,
  route,
}: CancelButtonProps) => {
  return (
    (!isAdmin && ['envoyée', 'en instruction', 'en attente de confirmation'].includes(status) && (
      <form action={route} method="post" style={{ margin: 0 }}>
        <input type="hidden" name="modificationRequestId" value={id} />
        <input type="hidden" name="projectId" value={projectId} />

        <button
          className="button-outline warning"
          type="submit"
          name="submit"
          data-confirm={`Etes-vous sur de vouloir annuler cette demande ?`}
        >
          Annuler la demande
        </button>
      </form>
    )) ||
    null
  )
}
