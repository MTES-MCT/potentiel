import { redirect } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { getÉliminé } from '@/app/_helpers/getÉliminé';

type ProjetPageProps = IdentifiantParameter & {
  searchParams?: Record<string, string>;
};

// Page de redirection vers la page lauréat ou éliminé
export default async function ProjetPage(props: ProjetPageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const { identifiant } = params;

  const identifiantProjet = decodeParameter(identifiant);
  const éliminé = await getÉliminé(identifiantProjet);

  if (éliminé) {
    redirect(Routes.Éliminé.détails.tableauDeBord(identifiantProjet));
  }

  const urlSearchParams = new URLSearchParams(searchParams);
  if (urlSearchParams.size === 0) {
    return redirect(Routes.Lauréat.détails.tableauDeBord(identifiantProjet));
  }
  return redirect(
    `${Routes.Lauréat.détails.tableauDeBord(identifiantProjet)}?${urlSearchParams.toString()}`,
  );
}
