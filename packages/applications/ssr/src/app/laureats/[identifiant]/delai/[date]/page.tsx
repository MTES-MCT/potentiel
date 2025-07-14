import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { match } from 'ts-pattern';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat, IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';

import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToDélaiTimelineItemProps } from '@/utils/historique/mapToProps/délai/mapToDélaiTimelineItemProps';

import { DemandeDélaiActions, DétailsDemandeDélaiPage } from './DétailsDemandeDélai.page';

export const metadata: Metadata = {
  title: 'Détail de la demande de délai - Potentiel',
  description: 'Détail de la demande de délai',
};

type PageProps = { params: { identifiant: string; date: string } };

export default async function Page({ params: { identifiant, date } }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const demandéLe = decodeParameter(date);

      const demande = await mediator.send<Lauréat.Délai.ConsulterDemandeDélaiQuery>({
        type: 'Lauréat.Délai.Query.ConsulterDemandeDélai',
        data: { identifiantProjet: identifiantProjet.formatter(), demandéLe },
      });

      if (Option.isNone(demande)) {
        return notFound();
      }

      const historique = await mediator.send<Lauréat.Délai.ListerHistoriqueDélaiProjetQuery>({
        type: 'Lauréat.Délai.Query.ListerHistoriqueDélaiProjet',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      return (
        <DétailsDemandeDélaiPage
          identifiantProjet={mapToPlainObject(identifiantProjet)}
          demande={mapToPlainObject(demande)}
          actions={mapToActions(utilisateur.role, demande.statut)}
          historique={historique.items.map(mapToDélaiTimelineItemProps)}
        />
      );
    }),
  );
}

const mapToActions = (
  role: Role.ValueType,
  statut: Lauréat.Délai.ConsulterDemandeDélaiReadModel['statut'],
) => {
  const actions: Array<DemandeDélaiActions> = [];

  return match(statut.statut)
    .with('demandé', () => {
      if (role.aLaPermission('délai.annulerDemande')) {
        actions.push('annuler');
      }
      if (role.aLaPermission('délai.passerEnInstructionDemande')) {
        actions.push('passer-en-instruction');
      }
      if (role.aLaPermission('délai.rejeterDemande')) {
        actions.push('rejeter');
      }

      return actions;
    })
    .with('en-instruction', () => {
      if (role.aLaPermission('délai.passerEnInstructionDemande')) {
        actions.push('passer-en-instruction');
      }

      return actions;
    })
    .otherwise(() => actions);
};
