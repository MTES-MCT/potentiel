import { NextResponse } from 'next/server';

class RéférentielPaysClientConfigurationError extends Error {
  constructor() {
    super(`Configuration is missing for the référenciel pays client`);
  }
}

const getApiUrl = () => process.env.REFERENCIEL_PAYS_ENDPOINT;

const fetchCountries = async (
  url: string,
  countries: string[] = [],
  search: string,
): Promise<string[]> => {
  console.log('fetching countries...');
  const response = await fetch(url);
  // NOM_COURT__contains
  const { data, links } = (await response.json()) as {
    data: { NOM_COURT: string }[];
    links: { next: string | null };
  };

  const newCountries = countries.concat(data.map(({ NOM_COURT }) => NOM_COURT));
  return links.next ? fetchCountries(links.next, newCountries, search) : newCountries;
};

const getAllCountries = async (search) => {
  const apiUrl = getApiUrl();

  if (!apiUrl) {
    throw new RéférentielPaysClientConfigurationError();
  }

  return fetchCountries(apiUrl, [], search);
};

export const GET = async (search) => {
  const countries = await getAllCountries(search);
  return NextResponse.json(countries);
};
