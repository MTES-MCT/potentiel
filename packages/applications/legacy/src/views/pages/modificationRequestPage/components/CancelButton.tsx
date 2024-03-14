import * as React from 'react';
import { ModificationRequestStatusDTO } from '../../../../modules/modificationRequest';
import ROUTES from '../../../../routes';
import { Form, SecondaryButton } from '../../../components';

interface CancelButtonProps {
  status: ModificationRequestStatusDTO;
  id: string;
}
export const CancelButton = ({ status, id }: CancelButtonProps) =>
  (['envoyée', 'en instruction', 'en attente de confirmation'].includes(status) && (
    <Form action={ROUTES.ANNULER_DEMANDE_ACTION} method="post" className="m-0">
      <input type="hidden" name="modificationRequestId" value={id} />

      <SecondaryButton
        className="w-fit"
        type="submit"
        name="submit"
        confirmation={`Êtes-vous sûr de vouloir annuler cette demande ?`}
      >
        Annuler la demande
      </SecondaryButton>
    </Form>
  )) ||
  null;
