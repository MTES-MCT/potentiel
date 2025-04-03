import { InputProps } from '@codegouvfr/react-dsfr/Input';

type GetAllInputNativeProps = (
  value: number | string,
  existingInputNativeProps?: InputProps['nativeInputProps'],
) => InputProps['nativeInputProps'];

export const getAllInputNativeProps: GetAllInputNativeProps = (
  value,
  existingInputNativeProps = {},
) =>
  typeof value === 'number'
    ? {
        ...existingInputNativeProps,
        type: 'number',
        inputMode: 'decimal',
        pattern: '[0-9]+([.][0-9]+)?',
        step: 'any',
      }
    : {
        ...existingInputNativeProps,
      };
