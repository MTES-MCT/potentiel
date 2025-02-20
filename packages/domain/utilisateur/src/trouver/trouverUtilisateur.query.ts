import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';

import { UtilisateurEntity } from '../utilisateur.entity';
import * as IdentifiantUtilisateur from '../identifiantUtilisateur.valueType';
import { Role, RécupérerUtilisateurPort } from '..';

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

export type TrouverUtilisateurDependencies = {
  récupérerUtilisateur: RécupérerUtilisateurPort;
};

export const registerTrouverUtilisateurQuery = ({
  récupérerUtilisateur,
}: TrouverUtilisateurDependencies) => {
  const handler: MessageHandler<TrouverUtilisateurQuery> = async ({ identifiantUtilisateur }) => {
    const result = await récupérerUtilisateur(identifiantUtilisateur);

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
