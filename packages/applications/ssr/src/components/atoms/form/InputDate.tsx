import Input, { type InputProps } from '@codegouvfr/react-dsfr/Input';
import type { FC } from 'react';

import type { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

type InputDateProps = {
  label: InputProps['label'];
  name: string;
  id?: string;
  required?: true;
  min?: Iso8601DateTime;
  max?: Iso8601DateTime;
  defaultValue?: Iso8601DateTime;
  value?: Iso8601DateTime;
  state: InputProps['state'];
  stateRelatedMessage: InputProps['stateRelatedMessage'];
  small?: true;
  hintText?: string;
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
  small,
  hintText,
}) => (
  <Input
    label={label}
    hintText={hintText}
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
    }}
    classes={{
      nativeInputOrTextArea: small ? 'w-48' : undefined,
    }}
    state={state}
    stateRelatedMessage={stateRelatedMessage}
  />
);

const formatDateForInput = (date: Iso8601DateTime | undefined): string | undefined =>
  date?.split('T').shift();
