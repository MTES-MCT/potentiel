import * as React from 'react';
import { ModificationRequestStatusDTO } from '@modules/modificationRequest';
import ROUTES from '@routes';
import { SecondaryButton } from '@views/components';

interface CancelButtonProps {
  status: ModificationRequestStatusDTO;
  id: string;
}
export const CancelButton = ({ status, id }: CancelButtonProps) =>
  (['envoyée', 'en instruction', 'en attente de confirmation'].includes(status) && (
    <form action={ROUTES.ANNULER_DEMANDE_ACTION} method="post" style={{ margin: 0 }}>
      <input type="hidden" name="modificationRequestId" value={id} />

      <SecondaryButton
        className="border-red-marianne-425-base text-red-marianne-425-base hover:bg-red-marianne-975-base focus:bg-red-marianne-975-base flex-1"
        type="submit"
        name="submit"
        confirmation={`Êtes-vous sûr de vouloir annuler cette demande ?`}
      >
        Annuler la demande
      </SecondaryButton>
    </form>
  )) ||
  null;
