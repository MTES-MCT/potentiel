import Select from '@codegouvfr/react-dsfr/SelectNext';
import { FC } from 'react';

export type TypeSociété = 'constituée' | 'en cours de constitution' | 'non renseignée';

export type SaisieTypeSociétéStepProps = {
  onChange?: (nouveauTypeSociété: TypeSociété) => void;
};

export const typesSociétéOptions = [
  {
    label: 'Société constituée',
    value: 'constituée',
    key: 'constituée',
  },
  {
    label: 'Société en cours de constitution',
    value: 'en cours de constitution',
    key: 'en cours de constitution',
  },
];

export const SaisieTypeSociétéStep: FC<SaisieTypeSociétéStepProps> = ({ onChange }) => (
  <Select
    id="typeSociete"
    label="Choisir le type de société"
    nativeSelectProps={{
      name: 'typeSociete',
      required: true,
      'aria-required': true,
      onChange: (e) => {
        if (onChange) {
          onChange(e.currentTarget.value as TypeSociété);
        }
      },
    }}
    className="lg:w-1/2"
    placeholder="Sélectionnez le type de société"
    options={typesSociétéOptions}
  />
);
