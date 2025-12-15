import { redirect } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';

import { getContext } from '@potentiel-applications/request-context';
import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { getLauréat } from '../_helpers/getLauréat';

type PageProps = IdentifiantParameter & {
  searchParams?: Record<string, string>;
};

export default async function Page({ params: { identifiant }, searchParams }: PageProps) {
  const identifiantProjet = decodeParameter(identifiant);
  const urlSearchParams = new URLSearchParams(searchParams);

  const { features } = getContext() ?? {};

  // Redirection vers la page projet legacy
  if (!features?.includes('page-projet')) {
    const legacyUrl = `/projet/${encodeURIComponent(identifiantProjet)}/details.html`;
    if (urlSearchParams.size === 0) {
      redirect(legacyUrl);
    }
    redirect(`${legacyUrl}?${urlSearchParams.toString()}`);
  }

  const lauréat = await getLauréat(
    IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
  );
  return (
    <ColumnPageTemplate
      leftColumn={{
        children: (
          <ul>
            <li>Email à la candidature : {lauréat.lauréat.emailContact.formatter()}</li>
            <li>Prix : {lauréat.lauréat.prixReference}</li>
            <li>ECS : {lauréat.fournisseur.évaluationCarboneSimplifiée}</li>
            <li>Actionnaire : {lauréat.actionnaire.actionnaire}</li>
            <li>Producteur : {lauréat.producteur.producteur}</li>
          </ul>
        ),
      }}
      rightColumn={{
        children: (
          <div>
            <Button
              priority="secondary"
              linkProps={{ href: Routes.Accès.lister(identifiantProjet, 'classé') }}
            >
              Gérer les accès des utilisateurs au projet
            </Button>
          </div>
        ),
      }}
    />
  );
}
