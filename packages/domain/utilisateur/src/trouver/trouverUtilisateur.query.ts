import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';

import { UtilisateurEntity } from '../utilisateur.entity';
import * as IdentifiantUtilisateur from '../identifiantUtilisateur.valueType';
import { Role } from '..';

export type TrouverUtilisateurReadModel = {
  identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
  nomComplet: string;
  rôle: Role.ValueType;
};

export type TrouverUtilisateurQuery = Message<
  'System.Utilisateur.Query.TrouverUtilisateur',
  {
    identifiantUtilisateur: string;
  },
  Option.Type<TrouverUtilisateurReadModel>
>;

export type TrouverUtilisateurPort = (
  identifiantUtilisateur: string,
) => Promise<Option.Type<UtilisateurEntity>>;

export type TrouverUtilisateurDependencies = {
  trouverUtilisateur: TrouverUtilisateurPort;
};

export const registerTrouverUtilisateurQuery = ({
  trouverUtilisateur,
}: TrouverUtilisateurDependencies) => {
  const handler: MessageHandler<TrouverUtilisateurQuery> = async ({ identifiantUtilisateur }) => {
    const result = await trouverUtilisateur(identifiantUtilisateur);

    if (Option.isNone(result)) {
      return result;
    }

    return mapToReadModel(result);
  };

  mediator.register('System.Utilisateur.Query.TrouverUtilisateur', handler);
};

export const mapToReadModel = ({
  identifiantUtilisateur,
  nomComplet,
  rôle,
}: UtilisateurEntity): TrouverUtilisateurReadModel => ({
  identifiantUtilisateur: IdentifiantUtilisateur.convertirEnValueType(identifiantUtilisateur),
  nomComplet,
  rôle: Role.convertirEnValueType(rôle),
});
