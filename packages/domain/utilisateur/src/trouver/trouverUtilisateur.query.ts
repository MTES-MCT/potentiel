import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';
import { Email } from '@potentiel-domain/common';

import { UtilisateurEntity } from '../utilisateur.entity';
import { Role } from '..';

export type TrouverUtilisateurReadModel = {
  identifiantUtilisateur: Email.ValueType;
  rôle: Role.ValueType;
  fonction: Option.Type<string>;
  région: Option.Type<string>;
  zone: Option.Type<string>;
  identifiantGestionnaireRéseau: Option.Type<string>;
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
  identifiantUtilisateur: Email.convertirEnValueType(utilisateur.identifiantUtilisateur),
  rôle: Role.convertirEnValueType(utilisateur.rôle),
  fonction: utilisateur.rôle === 'dgec-validateur' ? utilisateur.fonction : Option.none,
  région: utilisateur.rôle === 'dreal' ? utilisateur.région : Option.none,
  zone: utilisateur.rôle === 'cocontractant' ? utilisateur.zone : Option.none,
  identifiantGestionnaireRéseau:
    utilisateur.rôle === 'grd' ? utilisateur.identifiantGestionnaireRéseau : Option.none,
  désactivé: utilisateur.désactivé,
});
