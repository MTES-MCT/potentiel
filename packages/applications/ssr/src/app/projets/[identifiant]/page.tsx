import { redirect } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { getÉliminé } from '@/app/_helpers/getÉliminé';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

type ProjetPageProps = IdentifiantParameter & {
  searchParams?: Promise<Record<string, string>>;
};

// Page de redirection vers la page lauréat ou éliminé
export default async function ProjetPage(props: ProjetPageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const { identifiant } = params;

  const identifiantProjet = IdentifiantProjet.convertirEnValueType(
    decodeParameter(identifiant),
  ).formatter();

  return PageWithErrorHandling(async () => {
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
  });
}
