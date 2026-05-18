import { mediator } from 'mediateur';
import { Metadata } from 'next';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { ModifierDispositifDeStockagePage } from './ModifierDispositifDeStockage.page';

export const metadata: Metadata = { title: 'Modifier le dispositif de stockage' };

export default async function Page(props: IdentifiantParameter) {
  const params = await props.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Installation.ModifierDispositifDeStockageUseCase>(
        'Lauréat.Installation.UseCase.ModifierDispositifDeStockage',
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

      return (
        <ModifierDispositifDeStockagePage
          identifiantProjet={mapToPlainObject(identifiantProjet)}
          dispositifDeStockage={
            Option.isSome(actuel) ? mapToPlainObject(actuel.dispositifDeStockage) : undefined
          }
        />
      );
    }),
  );
}
