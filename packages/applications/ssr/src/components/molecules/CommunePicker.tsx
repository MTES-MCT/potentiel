'use client';

import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Input, { InputProps } from '@codegouvfr/react-dsfr/Input';
import { debounce } from '@mui/material/utils';

import { getLogger } from '@potentiel-libraries/monitoring';
import { GeoApiClient } from '@potentiel-infrastructure/geo-api-client';

type Commune = {
  commune: string;
  codePostal: string;
  département: string;
  région: string;
};

export type CommunePickerProps = {
  onSelected?: (commune: Commune | null) => void;
  defaultValue?: Commune;
} & Pick<InputProps, 'className' | 'label' | 'nativeInputProps'>;

export const CommunePicker: React.FC<CommunePickerProps> = ({
  label,
  nativeInputProps,
  defaultValue,
  className,
  onSelected,
}) => {
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [selectedCommune, setSelectedCommune] = useState<Commune | null>(defaultValue ?? null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (search: string) => {
    if (!search) {
      setCommunes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const geoClient = GeoApiClient(process.env.NEXT_PUBLIC_GEO_API_URL ?? '');
      const data = await geoClient.fetchCommunes(search);
      setCommunes(
        data.map(({ nom, region, departement, codesPostaux }) => ({
          commune: nom,
          région: region.nom,
          département: departement.nom,
          codePostal: codesPostaux[0],
        })),
      );
    } catch (error) {
      getLogger('CommunePicker').error(new Error('Error fetching communes', { cause: error }));
    } finally {
      setLoading(false);
    }
  };

  const searchDelayed = debounce(handleSearch, 400);

  return (
    <Autocomplete
      options={communes}
      loading={loading}
      loadingText="Chargement..."
      noOptionsText="Aucun résultat"
      className={className}
      getOptionLabel={({ commune, département, région }) => `${commune}, ${département}, ${région}`}
      getOptionKey={({ commune, codePostal }) => commune + codePostal}
      isOptionEqualToValue={(commune, value) =>
        commune.commune === value.commune && commune.codePostal === value.codePostal
      }
      filterOptions={(x) => x}
      autoHighlight
      autoComplete
      value={selectedCommune}
      onChange={(_, value) => {
        setSelectedCommune(value);
        onSelected?.(value);
      }}
      onInputChange={(_, newInputValue) => searchDelayed(newInputValue)}
      renderInput={({ inputProps, InputProps }) => {
        return (
          <div ref={InputProps.ref}>
            <Input
              id={inputProps.id}
              label={label}
              nativeInputProps={{
                type: 'text',
                ...inputProps,
                ...nativeInputProps,
              }}
            />
          </div>
        );
      }}
    />
  );
};
