import * as React from 'react';
import { ModificationRequestStatusDTO } from '@modules/modificationRequest';
import { Form, SecondaryButton } from '@views/components';

interface CancelButtonProps {
  status: ModificationRequestStatusDTO;
  id: string;
  route: any;
}
export const AnnulerDemandeDélaiBouton = ({ status, id, route }: CancelButtonProps) =>
  (['envoyée', 'en instruction'].includes(status) && (
    <Form action={route} method="post" className="m-0">
      <input type="hidden" name="modificationRequestId" value={id} />

      <SecondaryButton
        className="w-fit"
        type="submit"
        name="submit"
        confirmation={`Êtes-vous sûr de vouloir annuler cette demande de délai ?`}
      >
        Annuler la demande
      </SecondaryButton>
    </Form>
  )) ||
  null;
