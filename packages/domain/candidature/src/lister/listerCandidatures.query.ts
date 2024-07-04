import { mediator, Message, MessageHandler } from 'mediateur';

import { Role } from '@potentiel-domain/utilisateur';
import { DateTime, IdentifiantProjet, StatutProjet } from '@potentiel-domain/common';
import { RangeOptions } from '@potentiel-domain/core';

import { CandidatureEntity } from '../candidature.entity';

export type ListerCandidaturesListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  appelOffre: string;
  période: string;
  famille: string;
  numéroCRE: string;
  statut: StatutProjet.ValueType;
  nom: string;
  dateDésignation: DateTime.RawType;
};

export type ListerCandidaturesReadModel = {
  items: Array<ListerCandidaturesListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type RécupérerCandidaturesPort = (
  identifiantUtilisateur: string,
  role: Role.RawType,
  range: RangeOptions,
  query: string | undefined,
) => Promise<{ items: ReadonlyArray<CandidatureEntity>; total: number }>;

export type ListerCandidaturesDependencies = {
  récupérerCandidatures: RécupérerCandidaturesPort;
};

export type ListerCandidaturesQuery = Message<
  'Candidature.Query.ListerCandidatures',
  {
    identifiantUtilisateur: string;
    role: Role.RawType;
    range: RangeOptions;
    query?: string;
  },
  ListerCandidaturesReadModel
>;

export const registerCandidaturesQuery = ({
  récupérerCandidatures,
}: ListerCandidaturesDependencies) => {
  const handler: MessageHandler<ListerCandidaturesQuery> = async ({
    identifiantUtilisateur,
    role,
    range,
    query,
  }) => {
    const { items, total } = await récupérerCandidatures(
      identifiantUtilisateur,
      role,
      range,
      query,
    );

    return { items: items.map(mapToReadModel), total, range };
  };

  mediator.register('Candidature.Query.ListerCandidatures', handler);
};

const mapToReadModel = ({
  appelOffre,
  famille,
  nom,
  numéroCRE,
  période,
  statut,
  dateDésignation,
}: CandidatureEntity): ListerCandidaturesListItemReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(
    `${appelOffre}#${période}#${famille}#${numéroCRE}`,
  ),
  appelOffre,
  période,
  famille,
  numéroCRE,
  nom,
  statut: StatutProjet.convertirEnValueType(statut),
  dateDésignation,
});
