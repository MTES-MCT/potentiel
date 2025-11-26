import { notFound, redirect } from 'next/navigation';
import { mediator } from 'mediateur';

import { getContext } from '@potentiel-applications/request-context';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';

import { ÉvaluationCarboneSection } from './ÉvaluationCarboneSection';

type PageProps = IdentifiantParameter & {
  searchParams?: Record<string, string>;
};

export default async function Page({ params: { identifiant }, searchParams }: PageProps) {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));
  const urlSearchParams = new URLSearchParams(searchParams);

  const { features } = getContext() ?? {};

  // Redirection vers la page projet legacy
  if (!features?.includes('page-projet')) {
    const legacyUrl = `/projet/${encodeURIComponent(identifiantProjet.formatter())}/details.html`;
    if (urlSearchParams.size === 0) {
      redirect(legacyUrl);
    }
    redirect(`${legacyUrl}?${urlSearchParams.toString()}`);
  }

  const fournisseur = await mediator.send<Lauréat.Fournisseur.ConsulterFournisseurQuery>({
    type: 'Lauréat.Fournisseur.Query.ConsulterFournisseur',
    data: { identifiantProjet: identifiantProjet.formatter() },
  });

  // que fait on ?
  // Faut il afficher le menu quand même ?
  if (Option.isNone(fournisseur)) {
    // peut être plutôt une page vide ?
    return notFound();
  }

  // if (Option.isSome(fournisseur)) {
  //   const { fournisseurs, évaluationCarboneSimplifiée } = fournisseur;

  // const { peutModifier, peutEnregistrerChangement } =
  //   await checkAutorisationChangement<'fournisseur'>({
  //     rôle: Role.convertirEnValueType(rôle),
  //     aUnAbandonEnCours,
  //     estAbandonné,
  //     estAchevé,
  //     règlesChangementPourAppelOffres,
  //     domain: 'fournisseur',
  //   });

  return <ÉvaluationCarboneSection />;
}
