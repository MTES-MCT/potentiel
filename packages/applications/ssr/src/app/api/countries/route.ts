import { NextResponse } from 'next/server';

class RéférentielPaysClientConfigurationError extends Error {
  constructor() {
    super(`Configuration is missing for the référenciel pays client`);
  }
}

const getApiUrl = () => process.env.REFERENTIEL_PAYS_ENDPOINT;

const fetchCountries = async (url: URL, countries: string[] = []): Promise<string[]> => {
  console.log('Fetching countries...');

  const response = await fetch(url);

  const { data, links } = (await response.json()) as {
    data: { NOM_COURT: string }[];
    links: { next: string | null };
  };

  const newCountries = countries.concat(data.map(({ NOM_COURT }) => NOM_COURT));
  return links.next ? fetchCountries(new URL(links.next), newCountries) : newCountries;
};

const getAllCountries = async (search: string) => {
  const apiUrl = getApiUrl();

  if (!apiUrl) {
    throw new RéférentielPaysClientConfigurationError();
  }

  const url = new URL(apiUrl);
  url.searchParams.set('page_size', '100');
  // Set the search parameter for country names (see apiURL/swagger for more details)
  url.searchParams.set('NOM_COURT__contains', search);

  return fetchCountries(url, []);
};

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const countries = await getAllCountries(search);
  return NextResponse.json(countries);
};
