import { Message, MessageHandler, mediator } from 'mediateur';

import { RangeOptions } from '@potentiel-domain/entity';

import { UtilisateurEntity } from '../utilisateur.entity';
import {
  ConsulterUtilisateurReadModel,
  mapToReadModel,
} from '../consulter/consulterUtilisateur.query';
import { Role } from '..';

export type ListerUtilisateursReadModel = {
  items: Array<ConsulterUtilisateurReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerUtilisateursQuery = Message<
  'Utilisateur.Query.ListerUtilisateurs',
  {
    roles?: Array<Role.RawType>;
  },
  ListerUtilisateursReadModel
>;

export type ListerUtilisateursPort = (
  roles?: Array<Role.RawType>,
) => Promise<ReadonlyArray<UtilisateurEntity>>;

export type ListerUtilisateursDependencies = {
  listerUtilisateurs: ListerUtilisateursPort;
};

export const registerListerUtilisateursQuery = ({
  listerUtilisateurs,
}: ListerUtilisateursDependencies) => {
  const handler: MessageHandler<ListerUtilisateursQuery> = async ({ roles }) => {
    const items = await listerUtilisateurs(roles);

    return {
      items: items.map(mapToReadModel),
      range: {
        startPosition: 0,
        endPosition: items.length,
      },
      total: items.length,
    };
  };

  mediator.register('Utilisateur.Query.ListerUtilisateurs', handler);
};
