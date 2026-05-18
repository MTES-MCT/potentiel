import { Message, MessageHandler, mediator } from 'mediateur';

import { Email } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';
import { Option } from '@potentiel-libraries/monads';

import { Utilisateur } from '../index.js';
import { UtilisateurEntity } from '../utilisateur.entity.js';

export type TrouverUtilisateurReadModel = Utilisateur.ValueType & {
  désactivé?: true;
};

export type TrouverUtilisateurQuery = Message<
  'System.Utilisateur.Query.TrouverUtilisateur',
  {
    identifiantUtilisateur: string;
  },
  Option.Type<TrouverUtilisateurReadModel>
>;

export type TrouverUtilisateurDependencies = {
  find: Find;
};

export const registerTrouverUtilisateurQuery = ({ find }: TrouverUtilisateurDependencies) => {
  const handler: MessageHandler<TrouverUtilisateurQuery> = async ({ identifiantUtilisateur }) => {
    const email = Email.convertirEnValueType(identifiantUtilisateur);
    const result = await find<UtilisateurEntity>(`utilisateur|${email.formatter()}`);

    if (Option.isNone(result)) {
      return result;
    }

    return mapToReadModel(result);
  };

  mediator.register('System.Utilisateur.Query.TrouverUtilisateur', handler);
};

export const mapToReadModel = (utilisateur: UtilisateurEntity): TrouverUtilisateurReadModel => ({
  ...Utilisateur.convertirEnValueType(utilisateur),
  désactivé: utilisateur.désactivé,
});
