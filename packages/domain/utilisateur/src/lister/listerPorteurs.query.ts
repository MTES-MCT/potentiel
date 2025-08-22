import { type Message, type MessageHandler, mediator } from 'mediateur';

import { type List, type RangeOptions, Where } from '@potentiel-domain/entity';

import {
  type ConsulterUtilisateurReadModel,
  mapToReadModel,
} from '../consulter/consulterUtilisateur.query';
import type { UtilisateurEntity } from '../utilisateur.entity';

export type ListerPorteursReadModel = {
  items: Array<ConsulterUtilisateurReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerPorteursQuery = Message<
  'Utilisateur.Query.ListerPorteurs',
  {
    range?: RangeOptions;
    identifiantsUtilisateur?: Array<string>;
  },
  ListerPorteursReadModel
>;

export type ListerPorteursDependencies = {
  list: List;
};

export const registerListerPorteursQuery = ({ list }: ListerPorteursDependencies) => {
  const handler: MessageHandler<ListerPorteursQuery> = async ({
    range,
    identifiantsUtilisateur,
  }) => {
    const utilisateurs = await list<UtilisateurEntity>('utilisateur', {
      where: {
        rôle: Where.equal('porteur-projet'),
        identifiantUtilisateur: Where.matchAny(identifiantsUtilisateur),
        désactivé: Where.equalNull(),
      },
      orderBy: {
        invitéLe: 'descending',
      },
      range,
    });

    return {
      items: utilisateurs.items.map(mapToReadModel),
      range: utilisateurs.range,
      total: utilisateurs.total,
    };
  };

  mediator.register('Utilisateur.Query.ListerPorteurs', handler);
};
