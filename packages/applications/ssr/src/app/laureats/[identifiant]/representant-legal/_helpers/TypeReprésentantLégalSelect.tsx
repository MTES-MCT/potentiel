import Select, { SelectProps } from '@codegouvfr/react-dsfr/SelectNext';

import { Lauréat } from '@potentiel-domain/projet';

import { getTypeReprésentantLégalLabel } from './getTypeReprésentantLégalLabel';

export type TypeReprésentantLégalSelectProps = {
  id: string;
  name: string;
  required?: true;
  label?: string;
  disabled?: boolean;
  state?: SelectProps.State | 'default';
  stateRelatedMessage?: string;
  typeReprésentantLégalActuel: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  onTypeReprésentantLégalSelected?: (
    typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType,
  ) => void;
};

export const TypeReprésentantLégalSelect = ({
  id,
  name,
  required,
  label = 'Choisir le type de représentant légal',
  disabled,
  state = 'default',
  stateRelatedMessage,
  typeReprésentantLégalActuel,
  onTypeReprésentantLégalSelected,
}: TypeReprésentantLégalSelectProps) => {
  const defaultValue = Lauréat.ReprésentantLégal.TypeReprésentantLégal.bind({
    type: typeReprésentantLégalActuel,
  }).estInconnu()
    ? undefined
    : typeReprésentantLégalActuel;

  const typesReprésentantLégalOptions = Lauréat.ReprésentantLégal.TypeReprésentantLégal.types
    .filter((type) => type !== 'inconnu')
    .map((type) => ({
      label: getTypeReprésentantLégalLabel(type),
      value: type,
      key: type,
    }));

  return (
    <Select
      id={id}
      label={label}
      nativeSelectProps={{
        name,
        required,
        'aria-required': required,
        defaultValue,
        onChange: (e) => {
          const typeReprésentantLégalSélectionné = typesReprésentantLégalOptions.find(
            (type) => type.value === e.currentTarget.value,
          );

          if (typeReprésentantLégalSélectionné && onTypeReprésentantLégalSelected) {
            onTypeReprésentantLégalSelected(typeReprésentantLégalSélectionné.value);
          }
        },
      }}
      placeholder="Sélectionnez le type du représentant légal"
      options={typesReprésentantLégalOptions}
      state={state}
      stateRelatedMessage={stateRelatedMessage}
      disabled={disabled}
    />
  );
};
