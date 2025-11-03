import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { match } from 'ts-pattern';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat, IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getCahierDesCharges } from '@/app/_helpers';

import { mapToDélaiTimelineItemProps } from '../(historique)/mapToDélaiTimelineItemProps';

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

      const demandeDélai = await mediator.send<Lauréat.Délai.ConsulterDemandeDélaiQuery>({
        type: 'Lauréat.Délai.Query.ConsulterDemandeDélai',
        data: { identifiantProjet: identifiantProjet.formatter(), demandéLe },
      });

      if (Option.isNone(demandeDélai)) {
        return notFound();
      }

      const historique = await mediator.send<Lauréat.Délai.ListerHistoriqueDélaiProjetQuery>({
        type: 'Lauréat.Délai.Query.ListerHistoriqueDélaiProjet',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      const achèvement = await mediator.send<Lauréat.Achèvement.ConsulterAchèvementQuery>({
        type: 'Lauréat.Achèvement.Query.ConsulterAchèvement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(achèvement)) {
        return notFound();
      }

      const cahierDesCharges = await getCahierDesCharges(identifiantProjet);
      const règles = await cahierDesCharges.getRèglesChangements('délai');

      return (
        <DétailsDemandeDélaiPage
          identifiantProjet={mapToPlainObject(identifiantProjet)}
          demande={mapToPlainObject(demandeDélai)}
          dateAchèvementPrévisionnelActuelle={mapToPlainObject(
            achèvement.dateAchèvementPrévisionnel,
          )}
          actions={mapToActions({
            utilisateur,
            demandeDélai,
            autoritéCompétente: règles.demande ? règles.autoritéCompétente : undefined,
          })}
          historique={historique.items.map(mapToDélaiTimelineItemProps)}
        />
      );
    }),
  );
}

type MapToActionsProps = {
  utilisateur: Utilisateur.ValueType;
  demandeDélai: Lauréat.Délai.ConsulterDemandeDélaiReadModel;
  autoritéCompétente?: AppelOffre.AutoritéCompétente;
};

const mapToActions = ({
  utilisateur: { identifiantUtilisateur, role },
  demandeDélai: { statut, instruction },
  autoritéCompétente,
}: MapToActionsProps) => {
  const actions: Array<DemandeDélaiActions> = [];
  const estAutoritéCompétente = autoritéCompétente
    ? Lauréat.Délai.AutoritéCompétente.convertirEnValueType(autoritéCompétente).estCompétent(role)
    : false;

  return match(statut.statut)
    .with('demandé', () => {
      if (role.aLaPermission('délai.annulerChangement')) {
        actions.push('annuler');
      }
      if (role.aLaPermission('délai.passerDemandeEnInstruction') && estAutoritéCompétente) {
        actions.push('passer-en-instruction');
      }
      if (role.aLaPermission('délai.rejeterChangement') && estAutoritéCompétente) {
        actions.push('rejeter');
      }

      if (role.aLaPermission('délai.accorderChangement') && estAutoritéCompétente) {
        actions.push('accorder');
      }

      if (role.aLaPermission('délai.corrigerChangement')) {
        actions.push('corriger');
      }

      return actions;
    })
    .with('en-instruction', () => {
      if (!instruction) {
        return actions;
      }

      if (role.aLaPermission('délai.rejeterChangement') && estAutoritéCompétente) {
        actions.push('rejeter');
      }

      if (role.aLaPermission('délai.accorderChangement') && estAutoritéCompétente) {
        actions.push('accorder');
      }

      if (role.aLaPermission('délai.corrigerChangement')) {
        actions.push('corriger');
      }

      if (
        !identifiantUtilisateur.estÉgaleÀ(instruction.passéeEnInstructionPar) &&
        role.aLaPermission('délai.reprendreInstructionDemande') &&
        estAutoritéCompétente
      ) {
        actions.push('reprendre-instruction');
      }

      return actions;
    })
    .otherwise(() => actions);
};
