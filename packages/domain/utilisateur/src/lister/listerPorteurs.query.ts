import { Message, MessageHandler, mediator } from 'mediateur';

import { List, RangeOptions, Where, WhereOptions } from '@potentiel-domain/entity';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { UtilisateurEntity } from '../utilisateur.entity';
import {
  ConsulterUtilisateurReadModel,
  mapToReadModel,
} from '../consulter/consulterUtilisateur.query';

export type ListerPorteursReadModel = {
  items: Array<ConsulterUtilisateurReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerPorteursQuery = Message<
  'Utilisateur.Query.ListerPorteurs',
  {
    identifiantProjet: string;
  },
  ListerPorteursReadModel
>;

export type ListerPorteursDependencies = {
  list: List;
};

export const registerListerPorteursQuery = ({ list }: ListerPorteursDependencies) => {
  const handler: MessageHandler<ListerPorteursQuery> = async ({ identifiantProjet }) => {
    const where = {
      rôle: Where.equal('porteur-projet'),
      projets: Where.include(IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter()),
    } satisfies WhereOptions<UtilisateurEntity>;

    const utilisateurs = await list<UtilisateurEntity>('utilisateur', {
      where,
      orderBy: {
        invitéLe: 'descending',
      },
    });

    return {
      items: utilisateurs.items.map(mapToReadModel),
      range: utilisateurs.range,
      total: utilisateurs.total,
    };
  };

  mediator.register('Utilisateur.Query.ListerPorteurs', handler);
};
