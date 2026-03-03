import { notFound, redirect } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';

import { getReprésentantLégalInfos } from '../../../_helpers';

type ProjetPageProps = IdentifiantParameter;

// Page de redirection vers la dernière demande d'actionnaire (demandée, annulée, accordée ou rejetée) du projet
export default async function ProjetPage({ params: { identifiant } }: ProjetPageProps) {
  const identifiantProjet = decodeParameter(identifiant);

  const représentantLégal = await getReprésentantLégalInfos(
    IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
  );

  if (!représentantLégal.dateDernièreDemande) {
    return notFound();
  }

  return redirect(
    Routes.ReprésentantLégal.changement.détails(
      identifiantProjet,
      représentantLégal.dateDernièreDemande.formatter(),
    ),
  );
}
