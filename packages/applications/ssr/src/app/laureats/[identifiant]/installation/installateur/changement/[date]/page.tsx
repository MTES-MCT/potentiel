import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import { mapToInstallationTimelineItemProps } from '../../../(historique)/mapToInstallationTimelineItemProps';

import { DétailsChangementInstallateurPage } from './DétailsChangementInstallateur.page';

export const metadata: Metadata = {
  title: "Détail du changement de l'installateur du projet - Potentiel",
  description: "Détail du changement de l'installateur du projet",
};

type PageProps = {
  params: {
    identifiant: string;
    date: string;
  };
};

export default async function Page({ params: { identifiant, date } }: PageProps) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));
    const enregistréLe = decodeParameter(date);

    const changement =
      await mediator.send<Lauréat.Installation.ConsulterChangementInstallateurQuery>({
        type: 'Lauréat.Installateur.Query.ConsulterChangementInstallateur',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
          enregistréLe,
        },
      });

    if (Option.isNone(changement)) {
      return notFound();
    }

    const historique =
      await mediator.send<Lauréat.Installation.ListerHistoriqueInstallationProjetQuery>({
        type: 'Lauréat.Installation.Query.ListerHistoriqueInstallationProjet',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

    return (
      <DétailsChangementInstallateurPage
        identifiantProjet={mapToPlainObject(identifiantProjet)}
        changement={mapToPlainObject(changement.changement)}
        historique={historique.items
          .filter((i) =>
            [
              'InstallationImportée-V1',
              'InstallateurModifié-V1',
              'ChangementInstallateurEnregistré-V1',
            ].includes(i.type),
          )
          .map(mapToInstallationTimelineItemProps)}
      />
    );
  });
}
