import { get } from '@potentiel-libraries/http-client';

type DossierRaccordement = {
  nomProjet: string;
  identifiantProjet: string;
  appelOffre: string;
  periode: string;
  famille: string;
  numeroCRE: string;
  commune: string;
  codePostal: string;
  referenceDossier: string;
  statutDGEC: string;
};

type ApiResponse = {
  items: DossierRaccordement[];
  range: { startPosition: number; endPosition: number };
  total: number;
};

export type GetAllDossiersProps = {
  apiUrl: string;
  accessToken: string;
};
export async function getAllDossiers({ accessToken, apiUrl }: GetAllDossiersProps) {
  const url = new URL(`${apiUrl}/reseaux/raccordements`);

  const dossiers: DossierRaccordement[] = [];

  let page = 1;

  while (page < 100) {
    url.searchParams.set('page', String(page));
    const { items, total } = await get<ApiResponse>({
      url,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    dossiers.push(...items);
    if (dossiers.length >= total) {
      break;
    }
    page++;
  }
  return dossiers;
}
