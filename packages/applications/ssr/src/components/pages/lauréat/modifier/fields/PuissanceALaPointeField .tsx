import Checkbox from '@codegouvfr/react-dsfr/Checkbox';

import { FieldValidationErrors, ModifierLauréatFormProps } from '../ModifierLauréat.form';

type Props = {
  puissanceALaPointe: ModifierLauréatFormProps['candidature']['puissanceALaPointe'];
  validationErrors: FieldValidationErrors;
};

export const PuissanceALaPointeField = ({ puissanceALaPointe, validationErrors }: Props) => (
  <Checkbox
    state={validationErrors['candidature.puissanceALaPointe'] ? 'error' : 'default'}
    stateRelatedMessage={validationErrors['candidature.puissanceALaPointe']}
    id="candidature.puissanceALaPointe"
    options={[
      {
        label: 'Engagement de fourniture de puissance à la pointe',
        nativeInputProps: {
          name: 'candidature.puissanceALaPointe',
          value: 'true',
          defaultChecked: puissanceALaPointe,
        },
      },
    ]}
  />
);
