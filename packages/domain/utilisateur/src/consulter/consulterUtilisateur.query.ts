import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';

import { UtilisateurEntity } from '../utilisateur.entity';
import * as IdentifiantUtilisateur from '../identifiantUtilisateur.valueType';

export type ConsulterUtilisateurReadModel = {
  identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
  email: string;
  nomComplet: string;
  fonction: string;
  régionDreal: Option.Type<string>;
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
  récupérerUtilisateur: RécupérerUtilisateurPort;
};

export const registerConsulterUtilisateurQuery = ({
  récupérerUtilisateur,
}: ConsulterUtilisateurDependencies) => {
  const handler: MessageHandler<ConsulterUtilisateurQuery> = async ({ identifiantUtilisateur }) => {
    const result = await récupérerUtilisateur(identifiantUtilisateur);

    if (Option.isNone(result)) {
      return result;
    }

    return mapToReadModel(result);
  };

  mediator.register('Utilisateur.Query.ConsulterUtilisateur', handler);
};

const mapToReadModel = ({
  identifiantUtilisateur,
  email,
  nomComplet,
  fonction,
  régionDreal,
}: UtilisateurEntity): ConsulterUtilisateurReadModel => ({
  identifiantUtilisateur: IdentifiantUtilisateur.convertirEnValueType(identifiantUtilisateur),
  email,
  nomComplet,
  fonction,
  régionDreal: régionDreal ?? Option.none,
});
