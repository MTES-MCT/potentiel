import { Metadata } from 'next';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { EnregistrerChangementFournisseurPage } from '@/components/pages/fournisseur/changement/enregistrer/EnregistrerChangementFournisseur.page';

import { getFournisseurInfos } from '../../../_helpers/getLauréat';

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

    return (
      <EnregistrerChangementFournisseurPage
        identifiantProjet={mapToPlainObject(fournisseur.identifiantProjet)}
        fournisseurs={mapToPlainObject(fournisseur.fournisseurs)}
        évaluationCarboneSimplifiée={fournisseur.évaluationCarboneSimplifiée}
        évaluationCarboneSimplifiéeInitiale={fournisseur.évaluationCarboneSimplifiéeInitiale}
        technologie={fournisseur.technologie}
      />
    );
  });
}
