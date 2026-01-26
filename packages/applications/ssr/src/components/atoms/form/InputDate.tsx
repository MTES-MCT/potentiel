import { FC, ReactNode } from 'react';
import Input, { InputProps } from '@codegouvfr/react-dsfr/Input';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

type InputDateProps = {
  label: ReactNode;
  name: string;
  id?: string;
  required?: true;
  min?: Iso8601DateTime;
  max?: Iso8601DateTime;
  defaultValue?: Iso8601DateTime;
  value?: Iso8601DateTime;
  state: InputProps['state'];
  stateRelatedMessage: InputProps['stateRelatedMessage'];
  onChange?: () => void;
};

export const InputDate: FC<InputDateProps> = ({
  label,
  name,
  id,
  required,
  min,
  max,
  defaultValue,
  value,
  state,
  stateRelatedMessage,
  onChange,
}) => {
  return (
    <Input
      label={label}
      nativeInputProps={{
        type: 'date',
        name,
        id,
        required,
        'aria-required': required,
        min: formatDateForInput(min),
        max: formatDateForInput(max),
        defaultValue: formatDateForInput(defaultValue),
        value: formatDateForInput(value),
        onChange,
      }}
      state={state}
      stateRelatedMessage={stateRelatedMessage}
    />
  );
};

const formatDateForInput = (date: Iso8601DateTime | undefined): string | undefined =>
  date?.split('T').shift();
