'use client';

import { FC } from 'react';
import { match } from 'ts-pattern';

import { PlainType } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';
import { Historique } from '@potentiel-domain/historique';
import { HistoryRecord } from '@potentiel-domain/entity';

import { Timeline, TimelineProps } from '@/components/organisms/Timeline';

import {
  mapToAbandonDemandéTimelineProps,
  mapToAbandonAnnuléTimelineProps,
  mapToConfirmationAbandonDemandéeTimelineProps,
  mapToAbandonConfirméTimelineProps,
  mapToAbandonAccordéTimelineProps,
  mapToAbandonRejetéTimelineProps,
  mapToPreuveRecandidatureDemandéeTimelineProps,
  mapToPreuveRecandidatureTransmiseTimelineProps,
} from './timeline/mapToAbandonTimelineProps';

export type ListHistoriqueProps = {
  historique: PlainType<Historique.ListerHistoriqueProjetReadModel>;
};

export const ListHistorique: FC<ListHistoriqueProps> = ({ historique }) => {
  return <Timeline items={historique.items.map((item) => mapToTimelineProps(item))} />;
};

const mapToTimelineProps = (record: HistoryRecord) => {
  return match(record)
    .returnType<TimelineProps['items'][number]>()
    .with(
      {
        type: 'AbandonDemandé-V1',
      },
      mapToAbandonDemandéTimelineProps,
    )
    .with(
      {
        type: 'AbandonAnnulé-V1',
      },
      mapToAbandonAnnuléTimelineProps,
    )
    .with(
      {
        type: 'ConfirmationAbandonDemandée-V1',
      },
      mapToConfirmationAbandonDemandéeTimelineProps,
    )
    .with(
      {
        type: 'AbandonConfirmé-V1',
      },
      mapToAbandonConfirméTimelineProps,
    )
    .with(
      {
        type: 'AbandonAccordé-V1',
      },
      mapToAbandonAccordéTimelineProps,
    )
    .with(
      {
        type: 'AbandonRejeté-V1',
      },
      mapToAbandonRejetéTimelineProps,
    )
    .with(
      {
        type: 'PreuveRecandidatureDemandée-V1',
      },
      mapToPreuveRecandidatureDemandéeTimelineProps,
    )
    .with(
      {
        type: 'PreuveRecandidatureTransmise-V1',
      },
      mapToPreuveRecandidatureTransmiseTimelineProps,
    )
    .otherwise(() => ({
      date: record.createdAt as DateTime.RawType,
      title: 'Étape inconnue',
    }));
};
