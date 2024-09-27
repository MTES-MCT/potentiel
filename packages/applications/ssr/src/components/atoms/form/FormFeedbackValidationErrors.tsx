import { FC } from 'react';
import { useFormStatus } from 'react-dom';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { FormState } from '@/utils/formAction';

export type FormFeedbackValidationProps = {
  formState: FormState;
};

export const FormFeedbackValidationErrors: FC<FormFeedbackValidationProps> = ({ formState }) => {
  const { pending } = useFormStatus();

  if (pending || formState.status !== 'validation-error') {
    return undefined;
  }

  return (
    <Alert
      small
      severity="error"
      className="mt-6"
      description={
        formState.message && formState.message.length > 0 ? (
          <>
            <p>
              Le formulaire n'a pu être validé à cause $
              {formState.message.length > 1 ? 'des erreurs suivantes' : "de l'erreur suivante"} :
            </p>
            <ul className="list-disc pl-3">
              {formState.message.map((e, index) => (
                <li key={index}>
                  <span className="font-bold"></span>
                  {e}
                </li>
              ))}
            </ul>
          </>
        ) : (
          'Erreur lors de la validation des données du formulaire'
        )
      }
    />
  );
};
