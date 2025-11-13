import { mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { CréerPorteurCommand } from '../../créer/créerPorteur.command';

/**
 * @deprecated Copie de Accès.AccèsProjetAutoriséEvent pour éviter une dépendence cyclique.
 * Idéalement, Utilisateur pourrait dépendre de Projet plutot que l'inverse, mais pour cela Role doit être sortid d'Utitilisateur.
 **/
export type AccèsProjetAutoriséEvent = DomainEvent<
  'AccèsProjetAutorisé-V1',
  {
    identifiantProjet: string;
    identifiantUtilisateur: Email.RawType;
    autoriséLe: DateTime.RawType;
    autoriséPar: Email.RawType;
    raison: 'invitation' | 'notification' | 'réclamation';
  }
>;

export const accèsProjetAutoriséHandler = async ({
  payload: { identifiantUtilisateur, autoriséLe, raison },
}: AccèsProjetAutoriséEvent) => {
  // dans les cas 'invitation' et 'notification', le porteur est invité directement
  if (raison !== 'réclamation') {
    return;
  }

  await mediator.send<CréerPorteurCommand>({
    type: 'Utilisateur.Command.CréerPorteur',
    data: {
      crééLe: DateTime.convertirEnValueType(autoriséLe),
      identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateur),
    },
  });
};
