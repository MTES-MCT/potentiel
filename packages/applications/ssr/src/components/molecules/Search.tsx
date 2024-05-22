import assert from 'assert';

import SearchBar from '@codegouvfr/react-dsfr/SearchBar';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export type SearchProps = {
  label: string;
  params: string;
};

export const Search = ({ params, label }: SearchProps) => {
  const pathname = usePathname();
  const [searchParams, setSearchParams] = useState<string>('');
  const [inputElement, setInputElement] = useState<HTMLInputElement | null>(null);

  const url = buildUrl(pathname, new URLSearchParams({ [params]: searchParams }), searchParams);
  const router = useRouter();

  return (
    <SearchBar
      onButtonClick={() => router.push(url)}
      label={label}
      allowEmptySearch
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
