import { Metadata } from 'next';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { vérifierQueLeCahierDesChargesPermetUnChangement } from '@/app/_helpers';
import { getLauréatInfos } from '@/app/laureats/[identifiant]/_helpers';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import { EnregistrerChangementNomProjetPage } from './EnregistrerChangementNomProjet.page';

export const metadata: Metadata = {
  title: 'Changement de nom du projet - Potentiel',
  description: 'Formulaire de demande de changement de nom du projet',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));

    const lauréat = await getLauréatInfos(identifiantProjet.formatter());

    await vérifierQueLeCahierDesChargesPermetUnChangement(
      lauréat.identifiantProjet,
      'information-enregistrée',
      'nomProjet',
    );

    return (
      <EnregistrerChangementNomProjetPage
        identifiantProjet={mapToPlainObject(lauréat.identifiantProjet)}
        nomProjet={lauréat.nomProjet}
      />
    );
  });
}
