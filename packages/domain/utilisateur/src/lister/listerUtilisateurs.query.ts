import { Message, MessageHandler, mediator } from 'mediateur';

import { RangeOptions } from '@potentiel-domain/entity';

import { UtilisateurEntity } from '../utilisateur.entity';
import {
  ConsulterUtilisateurReadModel,
  mapToReadModel,
} from '../consulter/consulterUtilisateur.query';
import { Role } from '..';

export type ListerUtilisateurReadModel = {
  items: Array<ConsulterUtilisateurReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerUtilisateurQuery = Message<
  'Utilisateur.Query.ListerUtilisateur',
  {
    roles?: Array<Role.RawType>;
  },
  ListerUtilisateurReadModel
>;

export type ListerUtilisateurPort = (
  roles?: Array<Role.RawType>,
) => Promise<ReadonlyArray<UtilisateurEntity>>;

export type ListerUtilisateurDependencies = {
  listerUtilisateur: ListerUtilisateurPort;
};

export const registerListerUtilisateursQuery = ({
  listerUtilisateur,
}: ListerUtilisateurDependencies) => {
  const handler: MessageHandler<ListerUtilisateurQuery> = async ({ roles }) => {
    const items = await listerUtilisateur(roles);

    return {
      items: items.map(mapToReadModel),
      range: {
        startPosition: 0,
        endPosition: items.length,
      },
      total: items.length,
    };
  };

  mediator.register('Utilisateur.Query.ListerUtilisateur', handler);
};
