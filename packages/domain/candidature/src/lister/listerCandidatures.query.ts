import { Message, MessageHandler, mediator } from 'mediateur';

import { List, RangeOptions } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { CandidatureEntity } from '../candidature.entity';
import { ConsulterCandidatureReadModel } from '../candidature';
import { mapToReadModel } from '../consulter/consulterCandidature.query';

export type CandidaturesListItemReadModel = ConsulterCandidatureReadModel;

export type ListerCandidaturesReadModel = Readonly<{
  items: ReadonlyArray<CandidaturesListItemReadModel>;
  range: RangeOptions;
  total: number;
}>;

export type ListerCandidaturesQuery = Message<
  'Candidature.Query.ListerCandidatures',
  {
    range?: RangeOptions;
    identifiantProjet?: IdentifiantProjet.RawType;
  },
  ListerCandidaturesReadModel
>;

export type ListerCandidaturesQueryDependencies = {
  list: List;
};

export const registerListerCandidaturesQuery = ({ list }: ListerCandidaturesQueryDependencies) => {
  const handler: MessageHandler<ListerCandidaturesQuery> = async ({ range, identifiantProjet }) => {
    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await list<CandidatureEntity>('candidature', {
      where: {
        identifiantProjet: mapToWhereEqual(identifiantProjet),
      },
      range,
    });

    return {
      items: items.map(mapToReadModel),
      range: {
        endPosition,
        startPosition,
      },
      total,
    };
  };
  mediator.register('Candidature.Query.ListerCandidatures', handler);
};

/**
 * @todo A voir si on généralise cette pratique et si on déplace ça dans le package core ou un nouveau package entity
 */
const mapToWhereEqual = <T>(value: T | undefined) =>
  value !== undefined
    ? {
        operator: 'equal' as const,
        value,
      }
    : undefined;
