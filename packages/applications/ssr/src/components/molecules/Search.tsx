'use client';
import assert from 'assert';

import SearchBar from '@codegouvfr/react-dsfr/SearchBar';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export type SearchProps = {
  label: string;
  params: string;
};

export const Search = ({ params, label }: SearchProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState<string>(() => searchParams.get(params) ?? '');
  const [inputElement, setInputElement] = useState<HTMLInputElement | null>(null);
  const router = useRouter();

  const updateSearch = (search: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (search) {
      newSearchParams.delete('page');

      newSearchParams.set(params, search);
    } else {
      newSearchParams.delete(params);
    }
    const url = buildUrl(pathname, newSearchParams);
    router.push(url);
  };

  return (
    <SearchBar
      onButtonClick={() => updateSearch(search)}
      label={label}
      allowEmptySearch
      className="w-full"
      renderInput={({ className, id, placeholder, type }) => (
        <input
          ref={setInputElement}
          className={className}
          id={id}
          placeholder={placeholder}
          type={type}
          value={search}
          onChange={(event) => {
            setSearch(event.currentTarget.value);
            if (event.currentTarget.value === '') {
              updateSearch('');
            }
          }}
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

const buildUrl = (pathname: string, searchParams: URLSearchParams) =>
  `${pathname}${searchParams.size > 0 ? `?${searchParams.toString()}` : ''}`;
