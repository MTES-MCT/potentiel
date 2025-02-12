'use client';

import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Input, { InputProps } from '@codegouvfr/react-dsfr/Input';
import { debounce } from '@mui/material/utils';

type GeoApiCommuneItem = {
  nom: string;
  codesPostaux: string[];
  departement: {
    code: string;
    nom: string;
  };
  region: {
    code: string;
    nom: string;
  };
};

type Commune = {
  commune: string;
  codePostal: string;
  departement: string;
  region: string;
};

const fetchCommunes = async (search: string, signal?: AbortSignal): Promise<Commune[]> => {
  const params = new URLSearchParams({
    nom: search,
    fields: 'departement,region,codesPostaux',
    boost: 'population',
    limit: '10',
  });

  const apiUrl = process.env.NEXT_PUBLIC_GEO_API_URL || '';

  const response = await fetch(`${apiUrl}/communes?${params}`, { signal });
  const data: GeoApiCommuneItem[] = await response.json();
  return data.map(({ nom, region, departement, codesPostaux }) => ({
    commune: nom,
    region: region.nom,
    departement: departement.nom,
    codePostal: codesPostaux[0],
  }));
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
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!search) {
      setCommunes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    fetchCommunes(search, controller.signal)
      .then((data) => {
        setCommunes(data);
        setLoading(false);
      })
      .catch((error) => console.error('Error fetching communes:', error));
    return () => {
      controller.abort();
    };
  }, [search]);

  const searchDelayed = debounce(setSearch, 400);

  return (
    <Autocomplete
      options={communes}
      loading={loading}
      loadingText="Chargement..."
      noOptionsText="Aucun résultat"
      className={className}
      getOptionLabel={({ commune, departement, region }) => `${commune}, ${departement}, ${region}`}
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
