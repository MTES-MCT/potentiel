import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC, FormHTMLAttributes } from 'react';
import { useFormState } from 'react-dom';

import { formAction } from '@/utils/formAction';

export type FormProps = Omit<FormHTMLAttributes<HTMLFormElement>, 'action'> & {
  action: ReturnType<typeof formAction>;
  children: React.ReactNode;
  omitMandatoryFieldsLegend?: true;
  onSuccess?: () => void;
  onValidationError?: (validationErrors: Array<string>) => void;
};

export const Form: FC<FormProps> = ({
  action,
  omitMandatoryFieldsLegend,
  onSuccess,
  onValidationError,
  children,
  ...props
}) => {
  const [state, formAction] = useFormState(action, {
    error: undefined,
    validationErrors: [],
  });

  if (state.success && onSuccess) {
    onSuccess();
  }
  if (state.validationErrors && onValidationError) {
    onValidationError(state.validationErrors);
  }

  return (
    <form action={formAction} {...props}>
      {state.error && <Alert small severity="error" description={state.error} className="mb-4" />}

      {!omitMandatoryFieldsLegend && (
        <div className="text-sm italic mb-4">
          Sauf mention contraire "(optionnel)" dans le label, tous les champs sont obligatoires
        </div>
      )}

      {children}
    </form>
  );
};
