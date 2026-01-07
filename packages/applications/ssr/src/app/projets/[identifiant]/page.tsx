import { redirect } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { getÉliminé } from '@/app/_helpers/getÉliminé';

type ProjetPageProps = IdentifiantParameter & {
  searchParams?: Record<string, string>;
};

// Page de redirection vers la page lauréat ou éliminé
export default async function ProjetPage({
  params: { identifiant },
  searchParams,
}: ProjetPageProps) {
  const identifiantProjet = decodeParameter(identifiant);
  const éliminé = await getÉliminé(identifiantProjet);

  if (éliminé) {
    redirect(Routes.Éliminé.détails(identifiantProjet));
  }
  const urlSearchParams = new URLSearchParams(searchParams);
  if (urlSearchParams.size === 0) {
    return redirect(Routes.Lauréat.détails.tableauDeBord(identifiantProjet));
  }
  return redirect(
    `${Routes.Lauréat.détails.tableauDeBord(identifiantProjet)}?${urlSearchParams.toString()}`,
  );
}
