import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { DemanderChangementPuissancePage } from '@/components/pages/puissance/changement/demander/DemanderChangementPuissance.page';
import { getPériodeAppelOffres } from '@/app/_helpers/getPériodeAppelOffres';

import { getLauréatInfos, getPuissanceInfos } from '../../../_helpers/getLauréat';

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

    const lauréat = await getLauréatInfos({ identifiantProjet: identifiantProjet.formatter() });
    const puissance = await getPuissanceInfos({
      identifiantProjet: identifiantProjet.formatter(),
    });
    const { appelOffres, période } = await getPériodeAppelOffres(lauréat.identifiantProjet);

    const cahierDesChargesChoisi =
      await mediator.send<Lauréat.ConsulterCahierDesChargesChoisiQuery>({
        type: 'Lauréat.CahierDesCharges.Query.ConsulterCahierDesChargesChoisi',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

    if (Option.isNone(cahierDesChargesChoisi)) {
      return notFound();
    }

    return (
      <DemanderChangementPuissancePage
        identifiantProjet={mapToPlainObject(puissanceActuelle.identifiantProjet)}
        puissance={puissanceActuelle.puissance}
        unitéPuissance={mapToPlainObject(puissance.unitéPuissance)}
        appelOffre={mapToPlainObject(appelOffres)}
        période={mapToPlainObject(période)}
        technologie={lauréat.technologie}
        famille={période.familles.find((f) => f.id === identifiantProjet.famille)}
        cahierDesCharges={mapToPlainObject(cahierDesChargesChoisi)}
        volumeRéservé={mapToPlainObject(lauréat.volumeRéservé)}
        puissanceInitiale={puissance.puissanceInitiale}
      />
    );
  });
}
