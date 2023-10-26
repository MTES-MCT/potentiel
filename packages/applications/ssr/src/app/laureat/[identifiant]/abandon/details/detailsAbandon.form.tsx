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
  const [state, formAction] = useFormState(detailsAbandonAction, initialState);

  return abandon.statut.estEnCours() ? (
    <>
      <h2>Gérer votre demande</h2>
      <form action={formAction}>
        {state.error && <Alert severity="error" title={state.error} />}
        <input
          type={'hidden'}
          value={abandon?.identifiantProjet.formatter()}
          name="identifiantProjet"
        />
      </form>
    </>
  ) : null;
};
