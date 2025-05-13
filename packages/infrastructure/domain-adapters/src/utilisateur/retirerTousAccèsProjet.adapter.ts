import { mediator } from 'mediateur';

import { RetirerTousAccèsProjet } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';
import { ListerPorteursQuery, RetirerAccèsProjetCommand } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';

export const retirerTousAccèsProjet: RetirerTousAccèsProjet = async (identifiantProjet) => {
  try {
    const porteurs = await mediator.send<ListerPorteursQuery>({
      type: 'Utilisateur.Query.ListerPorteurs',
      data: { identifiantProjet: identifiantProjet.formatter() },
    });

    for (const porteur of porteurs.items) {
      await mediator.send<RetirerAccèsProjetCommand>({
        type: 'Utilisateur.Command.RetirerAccèsProjet',
        data: {
          identifiantProjet,
          identifiantUtilisateur: porteur.identifiantUtilisateur,
          retiréLe: DateTime.now(),
          retiréPar: Email.system(),
          cause: 'changement-producteur',
        },
      });
    }
  } catch (error) {
    getLogger().error(
      new Error('Impossible de retirer les accès aux porteurs suite au changement de producteur', {
        cause: error,
      }),
    );
  }
};
