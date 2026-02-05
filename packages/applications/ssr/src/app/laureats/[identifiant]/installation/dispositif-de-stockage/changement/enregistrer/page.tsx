import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { vérifierQueLeCahierDesChargesPermetUnChangement } from '@/app/_helpers/vérifierQueLeCahierDesChargesPermetUnChangement';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { EnregistrerChangementDispositifDeStockagePage } from './EnregistrerChangementDispositifDeStockage.page';

export const metadata: Metadata = {
  title: 'Changer le dispositif de stockage du projet - Potentiel',
  description: 'Formulaire de changement du dispositif de stockage du projet',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Installation.EnregistrerChangementDispositifDeStockageUseCase>(
        'Lauréat.Installation.UseCase.EnregistrerChangementDispositifDeStockage',
      );

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const actuel = await mediator.send<Lauréat.Installation.ConsulterDispositifDeStockageQuery>({
        type: 'Lauréat.Installation.Query.ConsulterDispositifDeStockage',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(actuel)) {
        return notFound();
      }

      await vérifierQueLeCahierDesChargesPermetUnChangement(
        actuel.identifiantProjet,
        'information-enregistrée',
        'dispositifDeStockage',
      );

      return (
        <EnregistrerChangementDispositifDeStockagePage
          identifiantProjet={mapToPlainObject(actuel.identifiantProjet)}
          dispositifDeStockage={mapToPlainObject(actuel.dispositifDeStockage)}
        />
      );
    }),
  );
}
