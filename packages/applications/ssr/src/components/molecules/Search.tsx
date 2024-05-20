import Button from '@codegouvfr/react-dsfr/Button';
// import SearchBar from '@codegouvfr/react-dsfr/SearchBar';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Icon } from '../atoms/Icon';

/**
we won't use SearchBar from DSFR from now
as it is a bit buggy
 */
export const Search = () => {
  const pathname = usePathname();
  const [searchParams, setSearchParams] = useState<string>('');
  const url = buildUrl(
    pathname,
    new URLSearchParams({ raisonSociale: searchParams }),
    searchParams,
  );

  return (
    <>
      <div className="flex flex-col">
        <div className="flex">
          <input
            value={searchParams}
            placeholder="Rechercher par raison sociale"
            onChange={(e) => setSearchParams(e.target.value)}
            className="leading-none !mt-0 px-4 pt-2 pb-[5px] rounded-t-[4px] rounded-tr-[4px] rounded-b-none rounded-bl-none border-0 border-b-[3px] border-b-blue-france-sun-base focus:border-b-blue-france-sun-base placeholder:italic"
          />
          <Button
            className="flex items-center py-2 px-2 lg:px-6 border-0 bg-blue-france-sun-base hover:bg-blue-france-sun-hover text-white"
            linkProps={{ href: url }}
          >
            <Icon id="ri-search-line" className="w-6 h-6 lg:mr-2" aria-hidden />
          </Button>
        </div>
      </div>
    </>
  );
};

const buildUrl = (pathname: string, URLSearchParams: URLSearchParams, searchParams: string) =>
  `${pathname}${searchParams.length > 0 ? `?${URLSearchParams.toString()}` : ''}`;
