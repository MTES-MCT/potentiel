import { Message, MessageHandler, mediator } from 'mediateur';
import { OperationRejectedError } from '@potentiel-domain/core';
import { Role, Utilisateur } from '..';

export type VérifierAccèsProjetQuery = Message<
  'VERIFIER_ACCES_PROJET_QUERY',
  {
    utilisateur: Utilisateur.ValueType;
    identifiantProjetValue: string;
  },
  void
>;

export type VérifierAccèsProjetPort = (args: {
  identifiantUtilisateurValue: string;
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
    if (
      utilisateur.role.estÉgaleÀ(Role.admin) ||
      utilisateur.role.estÉgaleÀ(Role.dgecValidateur) ||
      utilisateur.role.estÉgaleÀ(Role.dreal)
    ) {
      return;
    }

    const identifiantUtilisateurValue = utilisateur.identifiantUtilisateur.formatter();
    const estAccessible = await vérifierAccèsProjet({
      identifiantUtilisateurValue,
      identifiantProjetValue,
    });

    if (!estAccessible) {
      throw new ProjetInaccessibleError();
    }
  };

  mediator.register('VERIFIER_ACCES_PROJET_QUERY', handler);
};
