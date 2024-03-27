import { Message, MessageHandler, mediator } from 'mediateur';
import { UtilisateurEntity } from '../utilisateur.entity';
import { Option } from '@potentiel-libraries/monads';
import { UtilisateurInconnuErreur } from '../utilisateurInconnu.error';
import * as IdentifiantUtilisateur from '../identifiantUtilisateur.valueType';

export type ConsulterUtilisateurReadModel = {
  identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
  email: string;
  nomComplet: string;
  fonction: string;
};

export type ConsulterUtilisateurQuery = Message<
  'Utilisateur.Query.ConsulterUtilisateur',
  {
    identifiantUtilisateur: string;
  },
  ConsulterUtilisateurReadModel
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
      throw new UtilisateurInconnuErreur();
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
}: UtilisateurEntity): ConsulterUtilisateurReadModel => ({
  identifiantUtilisateur: IdentifiantUtilisateur.convertirEnValueType(identifiantUtilisateur),
  email,
  nomComplet,
  fonction,
});
