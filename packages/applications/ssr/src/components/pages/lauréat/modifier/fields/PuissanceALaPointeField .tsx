import Checkbox from '@codegouvfr/react-dsfr/Checkbox';

import { ModifierLauréatFormProps } from '../ModifierLauréat.form';

type Props = {
  puissanceALaPointe: ModifierLauréatFormProps['candidature']['puissanceALaPointe'];
};

export const PuissanceALaPointeField = ({ puissanceALaPointe }: Props) => (
  <Checkbox
    // state={validationErrors['puissanceALaPointe'] ? 'error' : 'default'}
    // stateRelatedMessage={validationErrors['puissanceALaPointe']}
    id="puissanceALaPointe"
    options={[
      {
        label: 'Engagement de fourniture de puissance à la pointe',
        nativeInputProps: {
          name: 'puissanceALaPointe',
          value: 'true',
          defaultChecked: puissanceALaPointe,
        },
      },
    ]}
  />
);
