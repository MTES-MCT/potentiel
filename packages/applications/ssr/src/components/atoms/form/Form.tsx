import { FC, FormHTMLAttributes } from 'react';
import { useFormState } from 'react-dom';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { formAction } from '@/utils/formAction';
import { Heading2 } from '../headings';

export type FormProps = Omit<FormHTMLAttributes<HTMLFormElement>, 'action'> & {
  action: ReturnType<typeof formAction>;
  children: React.ReactNode;
  heading?: React.ReactNode;
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
  heading,
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
      {heading && <Heading2>{heading}</Heading2>}

      {state.error && <Alert small severity="error" description={state.error} className="mb-4" />}

      {!omitMandatoryFieldsLegend && (
        <div className="text-sm italic my-4">
          Sauf mention contraire "(optionnel)" dans le label, tous les champs sont obligatoires
        </div>
      )}

      {children}
    </form>
  );
};
