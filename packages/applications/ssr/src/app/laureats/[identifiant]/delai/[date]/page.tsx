import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { match } from 'ts-pattern';

import type { AppelOffre } from '@potentiel-domain/appel-offre';
import type { DateTime } from '@potentiel-domain/common';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import type { Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import { getCahierDesCharges } from '@/app/_helpers';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToDélaiTimelineItemProps } from '../(historique)/mapToDélaiTimelineItemProps';
import { type DemandeDélaiActions, DétailsDemandeDélaiPage } from './DétailsDemandeDélai.page';

export const metadata: Metadata = { title: 'Demande de délai' };

type PageProps = { params: Promise<{ identifiant: string; date: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;

  const { identifiant, date } = params;

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

      const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());
      const règlesChangement = cahierDesCharges.getRèglesChangements('délai');

      if (!règlesChangement.motifs) {
        return notFound();
      }

      const motifsDisponibles = utilisateur.estDGEC()
        ? Object.keys(règlesChangement.motifs)
        : Object.entries(règlesChangement.motifs)
            .filter(([, motif]) => motif?.autoritéCompétente === utilisateur.rôle.nom)
            .map(([key]) => key);

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
            autoritéCompétente: règlesChangement.demande
              ? règlesChangement.motifs[demandeDélai.motif.motif]?.autoritéCompétente
              : undefined,
          })}
          historique={historique.items
            .filter((item) =>
              isDélaiDetailsEvent({ item, demandéLe: demandeDélai.demandéLe.formatter() }),
            )
            .map((item) =>
              mapToDélaiTimelineItemProps(
                item,
                utilisateur.rôle.aLaPermission('délai.consulterDemande'),
              ),
            )}
          motifsDisponibles={motifsDisponibles?.map(
            (m) => Lauréat.Délai.MotifDemandeDélai.convertirEnValueType(m).motif,
          )}
        />
      );
    }),
  );
}

type isDélaiDetailsEventProps = {
  item: Lauréat.Délai.HistoriqueDélaiProjetListItemReadModel;
  demandéLe: DateTime.RawType;
};

const isDélaiDetailsEvent = ({ item: { payload }, demandéLe }: isDélaiDetailsEventProps) =>
  ('demandéLe' in payload ? payload.demandéLe : payload.dateDemande) === demandéLe;

type MapToActionsProps = {
  utilisateur: Utilisateur.ValueType;
  demandeDélai: Lauréat.Délai.ConsulterDemandeDélaiReadModel;
  autoritéCompétente?: AppelOffre.AutoritéCompétente;
};

const mapToActions = ({
  utilisateur: { identifiantUtilisateur, rôle },
  demandeDélai: { statut, instruction },
  autoritéCompétente,
}: MapToActionsProps) => {
  const actions: Array<DemandeDélaiActions> = [];
  const estAutoritéCompétente = autoritéCompétente
    ? Lauréat.Délai.AutoritéCompétente.convertirEnValueType(autoritéCompétente).estCompétent(rôle)
    : false;

  return match(statut.statut)
    .with('demandé', () => {
      if (rôle.aLaPermission('délai.annulerDemande')) {
        actions.push('annuler');
      }
      if (rôle.aLaPermission('délai.passerDemandeEnInstruction') && estAutoritéCompétente) {
        actions.push('passer-en-instruction');
      }
      if (rôle.aLaPermission('délai.rejeterDemande') && estAutoritéCompétente) {
        actions.push('rejeter');
      }

      if (rôle.aLaPermission('délai.accorderDemande') && estAutoritéCompétente) {
        actions.push('accorder');
      }

      if (rôle.aLaPermission('délai.corrigerDemande')) {
        actions.push('corriger');
      }

      return actions;
    })
    .with('en-instruction', () => {
      if (!instruction) {
        return actions;
      }

      if (rôle.aLaPermission('délai.annulerDemande')) {
        actions.push('annuler');
      }

      if (rôle.aLaPermission('délai.rejeterDemande') && estAutoritéCompétente) {
        actions.push('rejeter');
      }

      if (rôle.aLaPermission('délai.accorderDemande') && estAutoritéCompétente) {
        actions.push('accorder');
      }

      if (rôle.aLaPermission('délai.corrigerDemande')) {
        actions.push('corriger');
      }

      if (
        !identifiantUtilisateur.estÉgaleÀ(instruction.passéeEnInstructionPar) &&
        rôle.aLaPermission('délai.reprendreInstructionDemande') &&
        estAutoritéCompétente
      ) {
        actions.push('reprendre-instruction');
      }

      return actions;
    })
    .otherwise(() => actions);
};
