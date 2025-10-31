import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';
import { Email } from '@potentiel-domain/common';

import { UtilisateurEntity } from '../utilisateur.entity';
import { Role, Région, Zone } from '..';

export type TrouverUtilisateurReadModel = {
  identifiantUtilisateur: Email.ValueType;
  rôle: Role.ValueType;
  fonction: string | undefined;
  région: Région.ValueType | undefined;
  zone: Zone.ValueType | undefined;
  identifiantGestionnaireRéseau: string | undefined;
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
  fonction: utilisateur.rôle === 'dgec-validateur' ? utilisateur.fonction : undefined,
  région:
    utilisateur.rôle === 'dreal' ? Région.convertirEnValueType(utilisateur.région) : undefined,
  zone:
    utilisateur.rôle === 'cocontractant' ? Zone.convertirEnValueType(utilisateur.zone) : undefined,
  identifiantGestionnaireRéseau:
    utilisateur.rôle === 'grd' ? utilisateur.identifiantGestionnaireRéseau : undefined,
  désactivé: utilisateur.désactivé,
});
