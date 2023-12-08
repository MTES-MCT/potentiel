import { Message, MessageHandler, mediator } from 'mediateur';
import { OperationRejectedError } from '@potentiel-domain/core';

export type VérifierAccèsProjetQuery = Message<
  'VERIFIER_ACCES_PROJET_QUERY',
  {
    identifiantUtilisateur: string;
    identifiantProjet: string;
  },
  void
>;

export type VérifierAccèsProjetPort = (args: {
  identifiantUtilisateur: string;
  identifiantProjet: string;
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
    identifiantUtilisateur,
    identifiantProjet,
  }) => {
    const estAccessible = await vérifierAccèsProjet({ identifiantUtilisateur, identifiantProjet });

    if (!estAccessible) {
      throw new ProjetInaccessibleError();
    }
  };

  mediator.register('VERIFIER_ACCES_PROJET_QUERY', handler);
};
