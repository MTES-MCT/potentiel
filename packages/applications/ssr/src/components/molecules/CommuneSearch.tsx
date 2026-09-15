'use client';

import Input from '@codegouvfr/react-dsfr/Input';
import Autocomplete from '@mui/material/Autocomplete';
import { debounce } from '@mui/material/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { type Ref, useState } from 'react';

import { GeoApiClient } from '@potentiel-infrastructure/geo-api-client';
import { getLogger } from '@potentiel-libraries/monitoring';

type Commune = {
  commune: string;
  codePostal: string;
  département: string;
};

export const CommuneSearch = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [selectedCommune, setSelectedCommune] = useState<Commune | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        data.map(({ nom, codesPostaux, departement }) => ({
          commune: nom,
          codePostal: codesPostaux[0],
          département: departement.nom,
        })),
      );
    } catch (error) {
      getLogger('CommuneSearch').error(new Error('Error fetching communes', { cause: error }));
    } finally {
      setLoading(false);
    }
  };

  const updateSearch = (search: string | null) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (search) {
      newSearchParams.delete('page');

      newSearchParams.set('commune', search.trim());
    } else {
      newSearchParams.delete('commune');
    }
    const url = buildUrl(pathname, newSearchParams);
    router.push(url);
  };

  const searchDelayed = debounce(handleSearch, 400);

  return (
    <Autocomplete
      options={communes}
      loading={loading}
      loadingText="Chargement..."
      noOptionsText="Aucun résultat"
      getOptionLabel={({ commune, département }) => `${commune}, ${département}`}
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
        updateSearch(value ? value.commune : null);
      }}
      onInputChange={(_, newInputValue) => searchDelayed(newInputValue)}
      renderInput={({ inputProps, InputProps }) => {
        return (
          <div ref={InputProps.ref as Ref<HTMLDivElement>}>
            <Input
              id={inputProps.id}
              label="Commune"
              nativeInputProps={{
                type: 'text',
                placeholder: 'Rechercher par commune',
                ...inputProps,
              }}
            />
          </div>
        );
      }}
    />
  );
};

const buildUrl = (pathname: string, searchParams: URLSearchParams) =>
  `${pathname}${searchParams.size > 0 ? `?${searchParams.toString()}` : ''}`;
