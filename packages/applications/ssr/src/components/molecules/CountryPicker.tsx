'use client';
import * as zod from 'zod';
import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Input, { InputProps } from '@codegouvfr/react-dsfr/Input';
import { debounce } from '@mui/material/utils';

import { get } from '@potentiel-libraries/http-client';
import { getLogger } from '@potentiel-libraries/monitoring';

type Pays = {
  nom: string;
};

export type PaysPickerProps = {
  onSelected?: (pays: Pays | null) => void;
  defaultValue?: Pays;
} & Pick<InputProps, 'className' | 'label' | 'nativeInputProps'>;

const schema = zod.array(zod.string());

export const PaysPicker: React.FC<PaysPickerProps> = ({
  label,
  nativeInputProps,
  defaultValue,
  className,
  onSelected,
}) => {
  const [pays, setPays] = useState<Pays[]>([]);
  const [selectedPays, setSelectedPays] = useState<Pays | null>(defaultValue ?? null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (search: string) => {
    console.log('search', search);
    if (!search) {
      setPays([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const url = new URL(`/api/countries`, window.location.origin);
      const response = await get({
        url,
      });
      const data = schema.parse(response);
      setPays(data.map((pays) => ({ nom: pays })));
    } catch (error) {
      getLogger('PaysPicker').error(new Error('Error fetching pays', { cause: error }));
    } finally {
      setLoading(false);
    }
  };

  const searchDelayed = debounce(handleSearch, 400);

  // option key ajuster
  // le search ne marche pas
  return (
    <Autocomplete
      options={pays}
      loading={loading}
      loadingText="Chargement..."
      noOptionsText="Aucun résultat"
      className={className}
      getOptionLabel={({ nom }) => `${nom}`}
      getOptionKey={({ nom }) => nom}
      isOptionEqualToValue={(pays, value) => pays.nom === value.nom}
      filterOptions={(x) => x}
      autoHighlight
      autoComplete
      value={selectedPays}
      onChange={(_, value) => {
        setSelectedPays(value);
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
