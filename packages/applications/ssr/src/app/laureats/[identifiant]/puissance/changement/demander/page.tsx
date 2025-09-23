import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { CahierDesCharges, Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { getCahierDesCharges } from '@/app/_helpers';

import { getPuissanceInfos } from '../../../_helpers/getLauréat';

import { DemanderChangementPuissancePage } from './DemanderChangementPuissance.page';

export const metadata: Metadata = {
  title: 'Demander le changement de puissance du projet - Potentiel',
  description: 'Formulaire de demande de changement de puissance du projet',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));

    const puissanceActuelle = await mediator.send<Lauréat.Puissance.ConsulterPuissanceQuery>({
      type: 'Lauréat.Puissance.Query.ConsulterPuissance',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });

    if (Option.isNone(puissanceActuelle)) {
      return notFound();
    }

    const puissance = await getPuissanceInfos({
      identifiantProjet: identifiantProjet.formatter(),
    });

    const cahierDesCharges = await getCahierDesCharges(identifiantProjet);

    cahierDesCharges.vérifierQueLeChangementEstPossible('information-enregistrée', 'puissance');

    const volumeRéservé = await mediator.send<Lauréat.Puissance.ConsulterVolumeRéservéQuery>({
      type: 'Lauréat.Puissance.Query.ConsulterVolumeRéservé',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });

    return (
      <DemanderChangementPuissancePage
        identifiantProjet={mapToPlainObject(puissanceActuelle.identifiantProjet)}
        puissance={puissanceActuelle.puissance}
        unitéPuissance={mapToPlainObject(puissance.unitéPuissance)}
        cahierDesCharges={mapToPlainObject(cahierDesCharges)}
        cahierDesChargesInitial={mapToPlainObject(
          CahierDesCharges.bind({
            ...cahierDesCharges,
            cahierDesChargesModificatif: undefined,
          }),
        )}
        volumeRéservé={Option.isSome(volumeRéservé) ? mapToPlainObject(volumeRéservé) : undefined}
        puissanceInitiale={puissance.puissanceInitiale}
      />
    );
  });
}
