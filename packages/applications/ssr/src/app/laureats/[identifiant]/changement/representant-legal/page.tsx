import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { z } from 'zod';

import { Option } from '@potentiel-libraries/monads';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  AvailableChangementReprésentantLégalAction,
  DétailsChangementReprésentantLégalPage,
} from '@/components/pages/représentant-légal/changement/détails/DétailsChangementReprésentantLégal.page';

export const metadata: Metadata = {
  title: 'Détail du représentant légal du projet - Potentiel',
  description: "Détail du représentant légal d'un projet",
};

type PageProps = IdentifiantParameter & {
  searchParams?: Record<string, string>;
};

const paramsSchema = z.object({
  demandeLe: z.string().min(1),
});

export default async function Page({ params: { identifiant }, searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );
      const { demandeLe: demandéLe } = paramsSchema.parse(searchParams);

      const changement =
        await mediator.send<ReprésentantLégal.ConsulterChangementReprésentantLégalQuery>({
          type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
            demandéLe,
          },
        });

      if (Option.isNone(changement)) {
        return notFound();
      }

      const actions: Array<AvailableChangementReprésentantLégalAction> = [];

      if (changement.demande.statut.estDemandé()) {
        if (utilisateur.role.aLaPermission('représentantLégal.accorderChangement')) {
          actions.push('accorder');
        }
        if (utilisateur.role.aLaPermission('représentantLégal.rejeterChangement')) {
          actions.push('rejeter');
        }
        if (utilisateur.role.aLaPermission('représentantLégal.annulerChangement')) {
          actions.push('annuler');
        }
      }

      return (
        <DétailsChangementReprésentantLégalPage
          identifiantProjet={mapToPlainObject(identifiantProjet)}
          demande={mapToPlainObject(changement.demande)}
          role={mapToPlainObject(utilisateur.role)}
          actions={actions}
        />
      );
    }),
  );
}
