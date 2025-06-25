'use client';
import * as zod from 'zod';
import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Input, { InputProps } from '@codegouvfr/react-dsfr/Input';
import { debounce } from '@mui/material/utils';

import { get } from '@potentiel-libraries/http-client';
import { getLogger } from '@potentiel-libraries/monitoring';

type Pays = string;

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
    if (!search) {
      setPays([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const url = new URL(`/api/countries`, window.location.origin);
      url.searchParams.append('search', search);

      const response = await get({
        url,
      });

      const data = schema.parse(response);
      setPays(data);
    } catch (error) {
      getLogger('PaysPicker').error(new Error('Error fetching pays', { cause: error }));
    } finally {
      setLoading(false);
    }
  };

  const searchDelayed = debounce(handleSearch, 300);

  return (
    <Autocomplete
      options={pays}
      loading={loading}
      loadingText="Chargement..."
      noOptionsText="Aucun résultat"
      className={className}
      getOptionLabel={(pays) => pays}
      getOptionKey={(pays) => pays}
      isOptionEqualToValue={(pays, value) => pays === value}
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
