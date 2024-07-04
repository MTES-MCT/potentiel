import assert from 'assert';

import SearchBar from '@codegouvfr/react-dsfr/SearchBar';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export type SearchProps = {
  label: string;
  params: string;
};

export const Search = ({ params, label }: SearchProps) => {
  const pathname = usePathname();
  const [searchParams, setSearchParams] = useState<string>('');
  const [inputElement, setInputElement] = useState<HTMLInputElement | null>(null);

  const url = buildUrl(
    pathname,
    new URLSearchParams({ [params]: searchParams.trim() }),
    searchParams,
  );

  const router = useRouter();

  // Cela permet de refresh automatiquement la page sans filtre quand on retire sa recherche (au clavier ou en utilisant le bouton "x" du composant)
  useEffect(() => {
    if (searchParams === '') {
      router.push(url);
    }
  }, [searchParams]);

  return (
    <SearchBar
      onButtonClick={() => router.push(url)}
      label={label}
      allowEmptySearch
      className="mb-4"
      renderInput={({ className, id, placeholder, type }) => (
        <input
          ref={setInputElement}
          className={className}
          id={id}
          placeholder={placeholder}
          type={type}
          value={searchParams}
          onChange={(event) => setSearchParams(event.currentTarget.value)}
          // This is from DSFR documentation
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              assert(inputElement !== null);
              inputElement.blur();
            }
          }}
        />
      )}
    />
  );
};

const buildUrl = (pathname: string, URLSearchParams: URLSearchParams, searchParams: string) =>
  `${pathname}${searchParams.length > 0 ? `?${URLSearchParams.toString()}` : ''}`;
