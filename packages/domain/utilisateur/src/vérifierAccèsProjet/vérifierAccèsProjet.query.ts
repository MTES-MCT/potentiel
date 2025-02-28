import { Message, MessageHandler, mediator } from 'mediateur';

import { OperationRejectedError } from '@potentiel-domain/core';

import * as Utilisateur from '../utilisateur.valueType';

export type VérifierAccèsProjetQuery = Message<
  'System.Authorization.VérifierAccèsProjet',
  {
    utilisateur: Utilisateur.ValueType;
    identifiantProjetValue: string;
  },
  void
>;

export type VérifierAccèsProjetPort = (args: {
  utilisateur: Utilisateur.ValueType;
  identifiantProjetValue: string;
}) => Promise<boolean>;

export type VérifierAccèsProjetDependencies = {
  vérifierAccèsProjet: VérifierAccèsProjetPort;
};

class ProjetInaccessibleError extends OperationRejectedError {
  constructor() {
    super(`Vous n'avez pas accès à ce projet`);
  }
}

export const registerVérifierAccèsProjetQuery = ({
  vérifierAccèsProjet,
}: VérifierAccèsProjetDependencies) => {
  const handler: MessageHandler<VérifierAccèsProjetQuery> = async ({
    utilisateur,
    identifiantProjetValue,
  }) => {
    const estAccessible = await vérifierAccèsProjet({
      utilisateur,
      identifiantProjetValue,
    });

    if (!estAccessible) {
      throw new ProjetInaccessibleError();
    }
  };

  mediator.register('System.Authorization.VérifierAccèsProjet', handler);
};
