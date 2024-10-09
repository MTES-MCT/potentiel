import { FC } from 'react';
import Input, { InputProps } from '@codegouvfr/react-dsfr/Input';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

type InputDateProps = InputProps.RegularInput & {
  nativeInputProps: {
    type: 'date';
    min?: Iso8601DateTime;
    max?: Iso8601DateTime;
    defaultValue?: Iso8601DateTime;
    value?: Iso8601DateTime;
  };
};

export const InputDate: FC<InputDateProps> = (props) => {
  return (
    <Input
      {...props}
      nativeInputProps={{
        ...props.nativeInputProps,
        min: formatDateForInput(props.nativeInputProps.min),
        max: formatDateForInput(props.nativeInputProps.max),
        defaultValue: formatDateForInput(props.nativeInputProps.defaultValue),
        value: formatDateForInput(props.nativeInputProps.value),
      }}
    />
  );
};

const formatDateForInput = (date: Iso8601DateTime | undefined): string | undefined =>
  date?.split('T').shift();
