import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { ModifierDispositifDeStockagePage } from './ModifierDispositifDeStockage.page';

export const metadata: Metadata = {
  title: "Changement du couplage de l'installation à un dispositif de stockage - Potentiel",
  description: "Formulaire de changement du couplage de l'installation à un dispositif de stockage",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
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

      if (Option.isNone(actuel)) {
        return notFound();
      }

      return (
        <ModifierDispositifDeStockagePage
          identifiantProjet={mapToPlainObject(identifiantProjet)}
          dispositifDeStockage={mapToPlainObject(actuel.dispositifDeStockage)}
        />
      );
    }),
  );
}
