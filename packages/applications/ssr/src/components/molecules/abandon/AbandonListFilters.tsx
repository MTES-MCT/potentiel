'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';
import SelectNext from '@codegouvfr/react-dsfr/SelectNext';
import { Heading2 } from '../../atoms/headings';
import { useState } from 'react';

export const AbandonListFilters = () => {
  const pathname = usePathname();
  //   const router = useRouter();
  const searchParams = useSearchParams();
  const statut = searchParams.get('statut') ?? undefined;
  const recandidature = searchParams.has('recandidature')
    ? !!searchParams.get('recandidature')
    : undefined;

  const buildUrl = (pathname: string, searchParams: string) =>
    `${pathname}${searchParams ? `?${searchParams}` : ''}`;

  const [url, setUrl] = useState(buildUrl(pathname, searchParams.toString()));

  return (
    <>
      <Heading2 className="mt-1 mb-6">Affiner la recherche</Heading2>
      <SelectNext
        label="Recandidature"
        placeholder="Filtrer par recandidature"
        nativeSelectProps={{
          onChange: (e) => {
            const value = e.currentTarget.value;
            const urlSearchParams = new URLSearchParams(searchParams);

            switch (value) {
              case 'all':
                urlSearchParams.delete('recandidature');
                break;

              case 'avec-recandidature':
                urlSearchParams.set('recandidature', 'true');
                break;

              case 'sans-recandidature':
                urlSearchParams.set('recandidature', 'false');
                break;
            }

            setUrl(buildUrl(pathname, urlSearchParams.toString()));
          },
        }}
        options={[
          {
            label: 'Tous',
            value: 'all',
            selected: recandidature === undefined,
          },
          {
            label: 'Avec recandidature',
            value: 'avec-recandidature',
            selected: recandidature === true,
          },
          {
            label: 'Sans recandidature',
            value: 'sans-recandidature',
            selected: recandidature === false,
          },
        ]}
      />

      {/* <Select
          label="Statut"
          id="statut"
          nativeSelectProps={{
            name: 'statut',
            defaultValue: statut,
          }}
        >
          <option value="">Filtrer par statut</option>
          <option value={Abandon.StatutAbandon.accordé.statut}>
            {Abandon.StatutAbandon.accordé.libellé().toLocaleLowerCase()}
          </option>
          <option value={Abandon.StatutAbandon.annulé.statut}>
            {Abandon.StatutAbandon.annulé.libellé().toLocaleLowerCase()}
          </option>
          <option value={Abandon.StatutAbandon.confirmationDemandée.statut}>
            {Abandon.StatutAbandon.confirmationDemandée.libellé().toLocaleLowerCase()}
          </option>
          <option value={Abandon.StatutAbandon.confirmé.statut}>
            {Abandon.StatutAbandon.confirmé.libellé().toLocaleLowerCase()}
          </option>
          <option value={Abandon.StatutAbandon.demandé.statut}>
            {Abandon.StatutAbandon.demandé.libellé().toLocaleLowerCase()}
          </option>
          <option value={Abandon.StatutAbandon.rejeté.statut}>
            {Abandon.StatutAbandon.rejeté.libellé().toLocaleLowerCase()}
          </option>
        </Select> */}

      <Button className="mb-4" linkProps={{ href: url }}>
        Filtrer
      </Button>
    </>
  );
};
