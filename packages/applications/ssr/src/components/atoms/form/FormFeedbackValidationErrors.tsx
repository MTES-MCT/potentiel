import { FC } from 'react';

import { AlertError } from './AlertError';

export type FormFeedbackValidationProps = {
  errors: string[];
};

export const FormFeedbackValidationErrors: FC<FormFeedbackValidationProps> = ({ errors }) => {
  return (
    <AlertError
      description={
        errors.length > 0 ? (
          <>
            <p>Le formulaire n'a pu être validé à cause des erreurs suivantes :</p>
            <ul className="list-disc pl-3">
              {errors.map((e, index) => (
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
