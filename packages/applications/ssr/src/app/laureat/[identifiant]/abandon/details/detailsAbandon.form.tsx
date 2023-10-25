'use client';
import { experimental_useFormState as useFormState } from 'react-dom';
import { Abandon } from '@potentiel-domain/laureat';
import { DetailsAbandonState, detailsAbandonAction } from './detailsAbandon.action';
import Alert from '@codegouvfr/react-dsfr/Alert';

const initialState: DetailsAbandonState = {
  error: undefined,
  validationErrors: [],
};

export const DetailsAbandonForm = ({ abandon }: { abandon: Abandon.ConsulterAbandonReadModel }) => {
  const confirmationPossible = abandon.statut === 'confirmation-demandée';
  const annulationPossible = abandon.statut !== 'rejeté' && abandon.statut !== 'accordé';

  const [state, formAction] = useFormState(detailsAbandonAction, initialState);

  return confirmationPossible || annulationPossible ? (
    <>
      <h2>Gérer votre demande</h2>
      <form action={formAction}>
        {state.error && <Alert severity="error" title={state.error} />}
        <input type={'hidden'} value={abandon?.identifiantProjet} name="identifiantProjet" />
      </form>
    </>
  ) : null;
};
