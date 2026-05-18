import type { Metadata } from 'next';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getFournisseurInfos } from '../../_helpers/getLauréat';
import { MettreÀJourFournisseurPage } from '../changement/(mettre-à-jour)/MettreÀJourFournisseur.page';

export const metadata: Metadata = { title: 'Modifier le fournisseur' };

export default async function Page(props: IdentifiantParameter) {
  const params = await props.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Fournisseur.MettreÀJourFournisseurUseCase>(
        'Lauréat.Fournisseur.UseCase.MettreÀJour',
      );

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );
      const fournisseur = await getFournisseurInfos(identifiantProjet.formatter());

      return (
        <MettreÀJourFournisseurPage
          identifiantProjet={mapToPlainObject(fournisseur.identifiantProjet)}
          fournisseurs={mapToPlainObject(fournisseur.fournisseurs)}
          évaluationCarboneSimplifiée={fournisseur.évaluationCarboneSimplifiée}
          évaluationCarboneSimplifiéeInitiale={fournisseur.évaluationCarboneSimplifiéeInitiale}
          technologie={fournisseur.technologie}
        />
      );
    }),
  );
}
