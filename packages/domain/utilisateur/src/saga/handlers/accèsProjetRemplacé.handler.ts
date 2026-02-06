import { mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { CréerPorteurCommand } from '../../créer/créerPorteur.command.js';

/**
 * @deprecated Copie de Accès.AccèsProjetRemplacéEvent pour éviter une dépendence cyclique.
 **/
export type AccèsProjetRemplacéEvent = DomainEvent<
  'AccèsProjetRemplacé-V1',
  {
    identifiantProjet: string;
    identifiantUtilisateur: Email.RawType;
    nouvelIdentifiantUtilisateur: Email.RawType;
    remplacéLe: DateTime.RawType;
    remplacéPar: Email.RawType;
  }
>;

export const accèsProjetRemplacéHandler = async ({
  payload: { nouvelIdentifiantUtilisateur, remplacéLe },
}: AccèsProjetRemplacéEvent) => {
  await mediator.send<CréerPorteurCommand>({
    type: 'Utilisateur.Command.CréerPorteur',
    data: {
      crééLe: DateTime.convertirEnValueType(remplacéLe),
      identifiantUtilisateur: Email.convertirEnValueType(nouvelIdentifiantUtilisateur),
    },
  });
};
