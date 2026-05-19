import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { vérifierQueLeCahierDesChargesPermetUnChangement } from '@/app/_helpers/vérifierQueLeCahierDesChargesPermetUnChangement';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { EnregistrerChangementDispositifDeStockagePage } from './EnregistrerChangementDispositifDeStockage.page';

export const metadata: Metadata = { title: 'Changer le dispositif de stockage' };

export default async function Page(props: IdentifiantParameter) {
  const params = await props.params;

  const { identifiant } = params;

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

      await vérifierQueLeCahierDesChargesPermetUnChangement(
        identifiantProjet,
        'information-enregistrée',
        'dispositifDeStockage',
      );

      return (
        <EnregistrerChangementDispositifDeStockagePage
          identifiantProjet={mapToPlainObject(identifiantProjet)}
          dispositifDeStockage={
            Option.isSome(actuel) ? mapToPlainObject(actuel.dispositifDeStockage) : undefined
          }
        />
      );
    }),
  );
}
