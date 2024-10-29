import { Message, MessageHandler, mediator } from 'mediateur';

import { OperationRejectedError } from '@potentiel-domain/core';
import { Find } from '@potentiel-domain/entity';
import { Option } from '@potentiel-libraries/monads';

import * as Role from '../role.valueType';
import * as Groupe from '../groupe.valueType';
import * as Utilisateur from '../utilisateur.valueType';

export type VérifierAccèsProjetQuery = Message<
  'System.Authorization.VérifierAccésProjet',
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
  find: Find;
};

class ProjetInaccessibleError extends OperationRejectedError {
  constructor() {
    super(`Vous n'avez pas accès à ce projet`);
  }
}

export const registerVérifierAccèsProjetQuery = ({
  vérifierAccèsProjet,
  find,
}: VérifierAccèsProjetDependencies) => {
  const handler: MessageHandler<VérifierAccèsProjetQuery> = async ({
    utilisateur,
    identifiantProjetValue,
  }) => {
    if (
      utilisateur.role.estÉgaleÀ(Role.admin) ||
      utilisateur.role.estÉgaleÀ(Role.dgecValidateur) ||
      utilisateur.role.estÉgaleÀ(Role.cre) ||
      utilisateur.role.estÉgaleÀ(Role.caisseDesDépôts) ||
      utilisateur.role.estÉgaleÀ(Role.acheteurObligé)
    ) {
      return;
    }

    const estAccessible = await vérifierAccèsProjet({
      utilisateur,
      identifiantProjetValue,
    });

    if (!estAccessible) {
      throw new ProjetInaccessibleError();
    }
  };

  mediator.register('System.Authorization.VérifierAccésProjet', handler);
};
