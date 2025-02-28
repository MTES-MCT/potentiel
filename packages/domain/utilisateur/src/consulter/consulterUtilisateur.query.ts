import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';
import { Email } from '@potentiel-domain/common';

import { UtilisateurEntity } from '../utilisateur.entity';
import * as IdentifiantUtilisateur from '../identifiantUtilisateur.valueType';
import * as Role from '../role.valueType';

export type ConsulterUtilisateurReadModel = {
  identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
  email: string;
  nomComplet: Option.Type<string>;
  rôle: Role.ValueType;
  fonction: Option.Type<string>;
};

export type ConsulterUtilisateurQuery = Message<
  'Utilisateur.Query.ConsulterUtilisateur',
  {
    identifiantUtilisateur: string;
  },
  Option.Type<ConsulterUtilisateurReadModel>
>;

export type RécupérerUtilisateurPort = (
  identifiantUtilisateur: string,
) => Promise<Option.Type<UtilisateurEntity>>;

export type ConsulterUtilisateurDependencies = {
  find: Find;
};

export const registerConsulterUtilisateurQuery = ({ find }: ConsulterUtilisateurDependencies) => {
  const handler: MessageHandler<ConsulterUtilisateurQuery> = async ({ identifiantUtilisateur }) => {
    const { email } = Email.convertirEnValueType(identifiantUtilisateur);
    const result = await find<UtilisateurEntity>(`utilisateur|${email}`);

    if (Option.isNone(result)) {
      return result;
    }

    return mapToReadModel(result);
  };

  mediator.register('Utilisateur.Query.ConsulterUtilisateur', handler);
};

export const mapToReadModel = (utilisateur: UtilisateurEntity): ConsulterUtilisateurReadModel => ({
  identifiantUtilisateur: Email.convertirEnValueType(utilisateur.identifiantUtilisateur),
  rôle: Role.convertirEnValueType(utilisateur.rôle),
  email: utilisateur.identifiantUtilisateur,
  nomComplet: utilisateur.rôle === 'dgec-validateur' ? utilisateur.nomComplet : Option.none,
  fonction: utilisateur.rôle === 'dgec-validateur' ? utilisateur.fonction : Option.none,
});
