import { Metadata } from 'next';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { vérifierQueLeCahierDesChargesPermetUnChangement } from '@/app/_helpers';

import { getFournisseurInfos } from '../../../_helpers/getLauréat';
import { MettreÀJourFournisseurPage } from '../(mettre-à-jour)/MettreÀJourFournisseur.page';

export const metadata: Metadata = {
  title: 'Changer le fournisseur du projet - Potentiel',
  description: 'Formulaire de changement de fournisseur du projet',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));
    const fournisseur = await getFournisseurInfos({
      identifiantProjet: identifiantProjet.formatter(),
    });

    await vérifierQueLeCahierDesChargesPermetUnChangement(
      fournisseur.identifiantProjet,
      'information-enregistrée',
      'fournisseur',
    );

    return (
      <MettreÀJourFournisseurPage
        identifiantProjet={mapToPlainObject(fournisseur.identifiantProjet)}
        fournisseurs={mapToPlainObject(fournisseur.fournisseurs)}
        évaluationCarboneSimplifiée={fournisseur.évaluationCarboneSimplifiée}
        évaluationCarboneSimplifiéeInitiale={fournisseur.évaluationCarboneSimplifiéeInitiale}
        technologie={fournisseur.technologie}
      />
    );
  });
}
