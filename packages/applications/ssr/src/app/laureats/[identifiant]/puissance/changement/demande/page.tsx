import { notFound, redirect } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';

import { getPuissanceInfos } from '../../../_helpers';

type ProjetPageProps = IdentifiantParameter;

// Page de redirection vers la dernière demande de puissance (demandée, annulée, accordée ou rejetée) du projet
export default async function ProjetPage({ params: { identifiant } }: ProjetPageProps) {
  const identifiantProjet = decodeParameter(identifiant);

  const puissance = await getPuissanceInfos(
    IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
  );

  if (!puissance.dateDernièreDemande) {
    return notFound();
  }

  return redirect(
    Routes.Puissance.changement.détails(
      identifiantProjet,
      puissance.dateDernièreDemande.formatter(),
    ),
  );
}
