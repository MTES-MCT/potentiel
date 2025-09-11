import { InputProps } from '@codegouvfr/react-dsfr/Input';

type GetAllInputNativeProps = (
  value: number | string | undefined,
) => InputProps['nativeInputProps'];

export const getInputTypeNativeProps: GetAllInputNativeProps = (value) =>
  typeof value === 'number'
    ? {
        type: 'number',
        inputMode: 'decimal',
        pattern: '[0-9]+([.][0-9]+)?',
        step: 'any',
      }
    : {
        type: 'text',
      };
