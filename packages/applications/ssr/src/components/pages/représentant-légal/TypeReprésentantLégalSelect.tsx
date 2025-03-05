import Select, { SelectProps } from '@codegouvfr/react-dsfr/SelectNext';
import { match } from 'ts-pattern';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

export type TypeReprésentantLégalSelectProps = {
  id: string;
  name: string;
  required?: true;
  label?: string;
  disabled?: boolean;
  state?: SelectProps.State | 'default';
  stateRelatedMessage?: string;
  typeReprésentantLégalActuel: ReprésentantLégal.TypeReprésentantLégal.RawType;
  onTypeReprésentantLégalSelected?: (
    typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.RawType,
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
  const defaultValue = ReprésentantLégal.TypeReprésentantLégal.bind({
    type: typeReprésentantLégalActuel,
  }).estInconnu()
    ? undefined
    : typeReprésentantLégalActuel;

  const typesReprésentantLégalOptions = ReprésentantLégal.TypeReprésentantLégal.types
    .filter((type) => type !== 'inconnu')
    .map((type) => ({
      label: match(type)
        .with('personne-physique', () => 'Personne physique')
        .with('personne-morale', () => 'Personne morale')
        .with('collectivité', () => 'Collectivité')
        .with('autre', () => 'Autre')
        .exhaustive(),
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
