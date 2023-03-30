import * as React from 'react';
import { ModificationRequestStatusDTO } from '@modules/modificationRequest';
import ROUTES from '@routes';

interface CancelButtonProps {
  status: ModificationRequestStatusDTO;
  id: string;
}
export const CancelButton = ({ status, id }: CancelButtonProps) =>
  (['envoyée', 'en instruction', 'en attente de confirmation'].includes(status) && (
    <form action={ROUTES.ANNULER_DEMANDE_ACTION} method="post" style={{ margin: 0 }}>
      <input type="hidden" name="modificationRequestId" value={id} />

      <button
        className="button-outline warning"
        type="submit"
        name="submit"
        onClick={(event) =>
          confirm(`Etes-vous sur de vouloir annuler cette demande ?`) || event.preventDefault()
        }
      >
        Annuler la demande
      </button>
    </form>
  )) ||
  null;
