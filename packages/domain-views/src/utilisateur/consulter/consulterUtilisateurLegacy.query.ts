import { Message, MessageHandler, mediator } from 'mediateur';
import { RawIdentifiantUtilisateur } from '@potentiel/domain-usecases';
import { Option } from '@potentiel/monads';

import { RécupérerUtilisateurLegacyPort } from '../utilisateur.port';
import { UtilisateurLegacyReadModel } from '../utilisateur.readmodel';

export type ConsulterUtilisateurLegacyQuery = Message<
  'CONSULTER_UTILISATEUR_LEGACY_QUERY',
  {
    identifiantUtilisateur: RawIdentifiantUtilisateur;
  },
  Option<UtilisateurLegacyReadModel>
>;

export type ConsulterUtilisateurLegacyDependencies = {
  récupérerUtilisateur: RécupérerUtilisateurLegacyPort;
};

export const registerConsulterUtilisateurLegacyQuery = ({
  récupérerUtilisateur,
}: ConsulterUtilisateurLegacyDependencies) => {
  const queryHandler: MessageHandler<ConsulterUtilisateurLegacyQuery> = async ({
    identifiantUtilisateur,
  }) => {
    const utilisateur = await récupérerUtilisateur(identifiantUtilisateur);

    return utilisateur;
  };

  mediator.register('CONSULTER_UTILISATEUR_LEGACY_QUERY', queryHandler);
};
