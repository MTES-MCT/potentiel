import { mediator, Message, MessageHandler } from 'mediateur';

import { Role } from '@potentiel-domain/utilisateur';
import { DateTime, IdentifiantProjet, StatutProjet } from '@potentiel-domain/common';
import { RangeOptions } from '@potentiel-domain/entity';

import { ProjetEntity } from '../projet.entity';

export type ListerProjetsListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  appelOffre: string;
  période: string;
  famille: string;
  numéroCRE: string;
  statut: StatutProjet.ValueType;
  nom: string;
  dateDésignation: DateTime.RawType;
  localité: ProjetEntity['localité'];
};

export type ListerProjetsReadModel = {
  items: Array<ListerProjetsListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type RécupérerProjetsPort = (
  identifiantUtilisateur: string,
  role: Role.RawType,
  range: RangeOptions,
  query: string | undefined,
) => Promise<{ items: ReadonlyArray<ProjetEntity>; total: number }>;

export type ListerProjetsDependencies = {
  récupérerProjets: RécupérerProjetsPort;
};

export type ListerProjetsQuery = Message<
  'Candidature.Query.ListerProjets',
  {
    identifiantUtilisateur: string;
    role: Role.RawType;
    range: RangeOptions;
    query?: string;
  },
  ListerProjetsReadModel
>;

export const registerProjetsQuery = ({ récupérerProjets }: ListerProjetsDependencies) => {
  const handler: MessageHandler<ListerProjetsQuery> = async ({
    identifiantUtilisateur,
    role,
    range,
    query,
  }) => {
    const { items, total } = await récupérerProjets(identifiantUtilisateur, role, range, query);

    return { items: items.map(mapToReadModel), total, range };
  };

  mediator.register('Candidature.Query.ListerProjets', handler);
};

const mapToReadModel = ({
  appelOffre,
  famille,
  nom,
  numéroCRE,
  période,
  statut,
  dateDésignation,
  localité,
}: ProjetEntity): ListerProjetsListItemReadModel => ({
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
  localité,
});
