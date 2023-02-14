import * as React from 'react'
import { ModificationRequestStatusDTO } from '@modules/modificationRequest'

interface CancelButtonProps {
  status: ModificationRequestStatusDTO
  id: string
  route: any
}
export const AnnulerDemandeDélaiBouton = ({ status, id, route }: CancelButtonProps) =>
  (['envoyée', 'en instruction', 'en attente de confirmation'].includes(status) && (
    <form action={route} method="post" style={{ margin: 0 }}>
      <input type="hidden" name="modificationRequestId" value={id} />

      <button
        className="button-outline warning"
        type="submit"
        name="submit"
        onClick={(event) =>
          confirm(`Êtes-vous sur de vouloir annuler cette demande ?`) || event.preventDefault()
        }
      >
        Annuler la demande
      </button>
    </form>
  )) ||
  null
