import * as React from 'react';
import { ModificationRequestStatusDTO } from '@modules/modificationRequest';
import { SecondaryButton } from '@views/components';

interface CancelButtonProps {
  status: ModificationRequestStatusDTO;
  id: string;
  route: any;
}
export const AnnulerDemandeDélaiBouton = ({ status, id, route }: CancelButtonProps) =>
  (['envoyée', 'en instruction'].includes(status) && (
    <form action={route} method="post" className="m-0">
      <input type="hidden" name="modificationRequestId" value={id} />

      <SecondaryButton
        className="border-red-marianne-425-base text-red-marianne-425-base hover:bg-red-marianne-975-base focus:bg-red-marianne-975-base flex-1"
        type="submit"
        name="submit"
        confirmation={`Êtes-vous sûr de vouloir annuler cette demande de délai ?`}
      >
        Annuler la demande
      </SecondaryButton>
    </form>
  )) ||
  null;
