import { redirect } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { getLauréat } from '@/app/_helpers';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { DétailsÉliminéPage } from './DétailsÉliminé';

type PageProps = IdentifiantParameter;

export default async function Page(props: PageProps) {
  const params = await props.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      decodeParameter(identifiant),
    ).formatter();

    const estLauréat = await getLauréat(identifiantProjet);

    if (estLauréat) {
      return redirect(Routes.Lauréat.détails.tableauDeBord(identifiantProjet));
    }

    return <DétailsÉliminéPage identifiantProjet={identifiantProjet} />;
  });
}
