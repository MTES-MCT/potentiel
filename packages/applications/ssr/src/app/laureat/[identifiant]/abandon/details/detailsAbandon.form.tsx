'use client';
import { experimental_useFormState as useFormState } from 'react-dom';
import { DetailsAbandonState, detailsAbandonAction } from './detailsAbandon.action';
import Alert from '@codegouvfr/react-dsfr/Alert';

const initialState: DetailsAbandonState = {
  error: undefined,
  validationErrors: [],
};

type DetailsAbandonForm = {
  estEnCours: boolean;
  identifiantProjet: string;
};

export const DetailsAbandonForm = ({ identifiantProjet, estEnCours }: DetailsAbandonForm) => {
  const [state, formAction] = useFormState(detailsAbandonAction, initialState);

  return estEnCours ? (
    <>
      <h2>Gérer votre demande</h2>
      <form action={formAction}>
        {state.error && <Alert severity="error" title={state.error} />}
        <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
      </form>
    </>
  ) : null;
};
